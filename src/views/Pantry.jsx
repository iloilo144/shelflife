import { useMemo, useRef, useState } from 'react'
import { Check, Pencil, Plus, Search, Trash2, Ban, ArrowRight, Refrigerator } from 'lucide-react'
import { CATEGORIES } from '../data/catalog'
import Thumb from '../components/Thumb'
import Ring from '../components/Ring'
import { useFlip, animateOut } from '../hooks/useFlip'
import { daysLeft, dueLabel, freshness, shortDate, urgency } from '../utils/dates'
import './Pantry.css'

const SORTS = {
  expiry: { label: 'Use soonest first', fn: (a, b) => daysLeft(a) - daysLeft(b) },
  name: { label: 'A to Z', fn: (a, b) => a.name.localeCompare(b.name) },
  recent: { label: 'Recently added', fn: (a, b) => b.addedAt.localeCompare(a.addedAt) },
}

function TodayNote({ items, onCook }) {
  const today = items.filter((i) => daysLeft(i) === 0)
  const week = items.filter((i) => daysLeft(i) > 0 && daysLeft(i) <= 3)
  const expired = items.filter((i) => daysLeft(i) < 0)
  // lower-case the first letter for use mid-sentence, but keep proper adjectives ("Greek yoghurt")
  const inSentence = (name) => (/^(Greek|French|Italian|Spanish)\b/.test(name) ? name : name.charAt(0).toLowerCase() + name.slice(1))
  const list = (arr) => arr.map((i) => inSentence(i.name)).join(', ').replace(/, ([^,]*)$/, ' and $1')

  if (!today.length && !week.length && !expired.length) {
    return <p className="note">Nothing is close to its date. A good week to cook from the cupboard.</p>
  }
  return (
    <div>
      <p className="note">
        {today.length > 0 && (
          <>
            The <mark className="mark mark--red">{list(today)}</mark> {today.length === 1 ? 'needs' : 'need'} eating today
          </>
        )}
        {today.length > 0 && week.length > 0 ? ', and ' : ''}
        {week.length > 0 && (
          <>
            {today.length ? '' : 'Use '}
            <mark className="mark">
              {week.length} more {week.length === 1 ? 'thing' : 'things'}
            </mark>{' '}
            in the next three days
          </>
        )}
        .{' '}
        {expired.length > 0 && (
          <>
            The {list(expired)} {expired.length === 1 ? 'is' : 'are'} past {expired.length === 1 ? 'its' : 'their'} date.
          </>
        )}
      </p>
      <button className="note__link" onClick={onCook}>
        See what you can cook <ArrowRight size={18} aria-hidden="true" />
      </button>
    </div>
  )
}

export default function Pantry({ items, onAdd, onEdit, onFinish, onDelete, onCook }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('expiry')
  const spotsRef = useRef(null)
  const rowsRef = useRef(null)
  useFlip(spotsRef)
  useFlip(rowsRef)

  const finish = (id, outcome) => animateOut(id, outcome, () => onFinish(id, outcome))
  const remove = (id) => animateOut(id, 'wasted', () => onDelete(id))

  const useFirst = useMemo(() => items.filter((i) => daysLeft(i) <= 3).sort(SORTS.expiry.fn), [items])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter((i) => category === 'all' || i.category === category)
      .filter((i) => !q || i.name.toLowerCase().includes(q) || i.location.toLowerCase().includes(q))
      .sort(SORTS[sort].fn)
  }, [items, query, category, sort])

  if (!items.length) {
    return (
      <section className="pantry-empty pop">
        <span className="pantry-empty__icon" aria-hidden="true">
          <Refrigerator size={34} />
        </span>
        <h2>The shelves are bare.</h2>
        <p>Add what is in your fridge and cupboards, and ShelfLife will tell you what to use first.</p>
        <button className="btn" onClick={onAdd}>
          <Plus size={18} aria-hidden="true" /> Add your first ingredient
        </button>
      </section>
    )
  }

  return (
    <>
      <section className="lead pop" aria-label="Today">
        <TodayNote items={items} onCook={onCook} />
        <button className="btn btn--dark lead__add" onClick={onAdd}>
          <Plus size={18} aria-hidden="true" /> Add ingredient
        </button>
      </section>

      {useFirst.length > 0 && (
        <section className="first" aria-labelledby="first-title">
          <div className="first__head">
            <h2 id="first-title">Use first</h2>
            <p>Expiring within three days, soonest first.</p>
          </div>
          <ul className="first__grid" ref={spotsRef}>
            {useFirst.map((item, i) => {
              const level = urgency(item)
              return (
                <li key={item.id} data-flip={item.id} className={`spot spot--${level} spot--${item.category} pop`} style={{ '--i': i, '--tilt': `${[-1.5, 1, -0.5, 1.5][i % 4]}deg` }}>
                  <div className="spot__img">
                    <Thumb item={item} width={500} eager />
                    <span className="spot__sticker">{dueLabel(item)}</span>
                  </div>
                  <div className="spot__body">
                    <h3>{item.name}</h3>
                    <p>
                      {item.qty} {item.unit} · {item.location}
                    </p>
                  </div>
                  <div className="spot__actions">
                    <button className="btn spot__used" onClick={() => finish(item.id, 'used')}>
                      <Check size={16} strokeWidth={3} aria-hidden="true" /> Used it
                    </button>
                    <button className="icon-btn icon-btn--waste" onClick={() => finish(item.id, 'wasted')} aria-label={`Throw away ${item.name}`} title="Threw it away">
                      <Ban size={18} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <section className="stock" aria-labelledby="stock-title">
        <div className="stock__head">
          <h2 id="stock-title">Everything in stock</h2>
          <div className="stock__tools">
            <label className="stock__search">
              <Search size={18} aria-hidden="true" />
              <span className="visually-hidden">Search ingredients</span>
              <input type="search" placeholder="Search the pantry" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <label>
              <span className="visually-hidden">Sort</span>
              <select className="input stock__sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([id, s]) => (
                  <option key={id} value={id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="cats" role="tablist" aria-label="Filter by category">
          {CATEGORIES.map((c) => {
            const count = c.id === 'all' ? items.length : items.filter((i) => i.category === c.id).length
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={category === c.id}
                className={`cat cat--${c.id}`}
                onClick={() => setCategory(c.id)}
                disabled={!count && c.id !== category}
              >
                {c.label} <span>{count}</span>
              </button>
            )
          })}
        </div>

        {visible.length ? (
          <ul className="rows" ref={rowsRef}>
            {visible.map((item) => {
              const level = urgency(item)
              const left = daysLeft(item)
              return (
                <li key={item.id} data-flip={item.id} className={`row row--${level}`}>
                  <Ring value={freshness(item)} level={level}>
                    <Thumb item={item} width={120} className="row__thumb" />
                  </Ring>
                  <div className="row__name">
                    <strong>{item.name}</strong>
                    <span>
                      {item.qty} {item.unit} · {item.location}
                    </span>
                  </div>
                  <span className={`row__days row__days--${level}`}>
                    <strong>{left < 0 ? '!' : left > 99 ? '99+' : left}</strong>
                    <small>{left < 0 ? 'expired' : left === 1 ? 'day' : 'days'}</small>
                  </span>
                  <div className="row__due">
                    <span className={`due due--${level}`}>{dueLabel(item)}</span>
                    <time dateTime={item.expiresAt}>{shortDate(item.expiresAt)}</time>
                  </div>
                  <div className="row__actions">
                    <button className="icon-btn icon-btn--used" onClick={() => finish(item.id, 'used')} aria-label={`Mark ${item.name} as used`} title="Used it">
                      <Check size={18} strokeWidth={2.5} />
                    </button>
                    <button className="icon-btn icon-btn--waste" onClick={() => finish(item.id, 'wasted')} aria-label={`Throw away ${item.name}`} title="Threw it away">
                      <Ban size={17} />
                    </button>
                    <button className="icon-btn" onClick={() => onEdit(item)} aria-label={`Edit ${item.name}`} title="Edit">
                      <Pencil size={16} />
                    </button>
                    <button className="icon-btn" onClick={() => remove(item.id)} aria-label={`Delete ${item.name}`} title="Delete (added by mistake)">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="rows-empty pop">
            Nothing matches {query ? `“${query}”` : 'this shelf'}.{' '}
            <button
              className="note__link"
              onClick={() => {
                setQuery('')
                setCategory('all')
              }}
            >
              Show everything
            </button>
          </p>
        )}
      </section>
    </>
  )
}
