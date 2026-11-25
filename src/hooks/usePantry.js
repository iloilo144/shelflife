import { useCallback, useEffect, useReducer } from 'react'
import { createSeed } from '../data/seed'

const KEY = 'shelflife:v1'

function load() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) return { ...JSON.parse(raw), undo: null }
  } catch {
    /* ignore and start fresh */
  }
  return { ...createSeed(), undo: null }
}

const uid = () => `i-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, items: [{ ...action.item, id: uid() }, ...state.items], undo: null }

    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.item.id ? { ...i, ...action.item } : i)),
        undo: null,
      }

    case 'DELETE': {
      const item = state.items.find((i) => i.id === action.id)
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
        undo: { label: `Deleted ${item.name}`, snapshot: { items: state.items, log: state.log } },
      }
    }

    // "used" and "wasted" both leave the pantry, but are logged for the statistics.
    case 'FINISH': {
      const finished = state.items.filter((i) => action.ids.includes(i.id))
      const entries = finished.map((i) => ({
        id: uid(),
        name: i.name,
        category: i.category,
        price: i.price ?? 0,
        action: action.outcome,
        at: new Date().toISOString(),
      }))
      const label =
        finished.length === 1
          ? `${finished[0].name} ${action.outcome === 'used' ? 'marked as used' : 'moved to the bin'}`
          : `${finished.length} items marked as used`
      return {
        items: state.items.filter((i) => !action.ids.includes(i.id)),
        log: [...entries, ...state.log],
        undo: { label, snapshot: { items: state.items, log: state.log } },
      }
    }

    case 'UNDO':
      return state.undo ? { ...state.undo.snapshot, undo: null } : state

    case 'CLEAR_UNDO':
      return { ...state, undo: null }

    case 'RESET':
      return { ...createSeed(), undo: null }

    default:
      return state
  }
}

export function usePantry() {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ items: state.items, log: state.log }))
    } catch {
      /* storage unavailable: keep working in memory */
    }
  }, [state.items, state.log])

  // undo is only offered for a few seconds
  useEffect(() => {
    if (!state.undo) return
    const t = setTimeout(() => dispatch({ type: 'CLEAR_UNDO' }), 6000)
    return () => clearTimeout(t)
  }, [state.undo])

  return {
    items: state.items,
    log: state.log,
    undo: state.undo,
    add: useCallback((item) => dispatch({ type: 'ADD', item }), []),
    update: useCallback((item) => dispatch({ type: 'UPDATE', item }), []),
    remove: useCallback((id) => dispatch({ type: 'DELETE', id }), []),
    finish: useCallback((ids, outcome) => dispatch({ type: 'FINISH', ids: [].concat(ids), outcome }), []),
    undoLast: useCallback(() => dispatch({ type: 'UNDO' }), []),
    reset: useCallback(() => dispatch({ type: 'RESET' }), []),
  }
}
