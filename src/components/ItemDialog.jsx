import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES, LOCATIONS, UNITS } from '../data/catalog'
import { addDays, toISODate } from '../utils/dates'
import './ItemDialog.css'

const blank = () => ({
  name: '',
  category: 'produce',
  qty: '1',
  unit: 'pcs',
  location: 'Fridge',
  expiresAt: toISODate(addDays(5)),
  price: '',
})

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'What is it called?'
  if (!(Number(v.qty) > 0)) e.qty = 'Enter an amount above zero.'
  if (!v.expiresAt) e.expiresAt = 'Add the use-by or best-before date.'
  if (v.price !== '' && !(Number(v.price) >= 0)) e.price = 'Price must be a positive number.'
  return e
}

/** Add / edit an ingredient. Uses the native <dialog> element for focus trapping and Esc to close. */
export default function ItemDialog({ item, onClose, onSave }) {
  const ref = useRef(null)
  const [values, setValues] = useState(blank)
  const [errors, setErrors] = useState({})
  const editing = Boolean(item?.id)

  useEffect(() => {
    const dialog = ref.current
    if (item) {
      setValues(item.id ? { ...item, qty: String(item.qty), price: item.price ?? '' } : blank())
      setErrors({})
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [item])

  const change = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) return
    onSave({
      ...(editing ? item : { addedAt: toISODate(new Date()) }),
      ...values,
      name: values.name.trim(),
      qty: Number(values.qty),
      price: values.price === '' ? 0 : Number(values.price),
    })
  }

  const field = (name) => ({
    id: `f-${name}`,
    name,
    value: values[name],
    onChange: change,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `f-${name}-err` : undefined,
  })
  const err = (name) =>
    errors[name] && (
      <p className="error" id={`f-${name}-err`}>
        {errors[name]}
      </p>
    )

  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby="sheet-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <form onSubmit={submit} noValidate className="sheet__form">
        <header className="sheet__head">
          <div>
            <p className="kicker">{editing ? 'Edit entry' : 'New entry'}</p>
            <h2 id="sheet-title">{editing ? values.name || 'Ingredient' : 'Add to the pantry'}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>

        <div className="field">
          <label htmlFor="f-name">Ingredient</label>
          <input className="input" placeholder="e.g. Cherry tomatoes" autoComplete="off" {...field('name')} />
          {err('name')}
        </div>

        <div className="sheet__row">
          <div className="field">
            <label htmlFor="f-qty">Amount</label>
            <input className="input" type="number" min="0" step="any" inputMode="decimal" {...field('qty')} />
            {err('qty')}
          </div>
          <div className="field">
            <label htmlFor="f-unit">Unit</label>
            <select className="input" {...field('unit')}>
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="sheet__row">
          <div className="field">
            <label htmlFor="f-category">Category</label>
            <select className="input" {...field('category')}>
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-expiresAt">Use by</label>
            <input className="input" type="date" {...field('expiresAt')} />
            {err('expiresAt')}
          </div>
        </div>

        <fieldset className="field sheet__places">
          <legend>Kept in</legend>
          <div>
            {LOCATIONS.map((l) => (
              <label key={l}>
                <input type="radio" name="location" value={l} checked={values.location === l} onChange={change} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="f-price">Price paid (£, optional)</label>
          <input className="input" type="number" min="0" step="0.01" inputMode="decimal" placeholder="Used to estimate money wasted" {...field('price')} />
          {err('price')}
        </div>

        <footer className="sheet__foot">
          <button type="button" className="btn btn--line" onClick={onClose}>
            Cancel
          </button>
          <button className="btn">{editing ? 'Save changes' : 'Add to pantry'}</button>
        </footer>
      </form>
    </dialog>
  )
}
