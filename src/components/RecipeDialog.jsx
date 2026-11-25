import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { photo } from '../data/catalog'
import { dueLabel, urgency } from '../utils/dates'

export default function RecipeDialog({ recipe, onClose, onCooked }) {
  const ref = useRef(null)
  const [selected, setSelected] = useState([])

  useEffect(() => {
    const dialog = ref.current
    if (recipe) {
      setSelected(recipe.have.map((i) => i.id))
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [recipe])

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <dialog
      ref={ref}
      className="sheet recipe-sheet"
      aria-labelledby="recipe-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {recipe && (
        <article>
          <div className="recipe-sheet__img">
            <img src={photo(recipe.image, 1000)} alt={recipe.title} />
            <button className="icon-btn recipe-sheet__close" onClick={onClose} aria-label="Close recipe">
              <X size={20} />
            </button>
          </div>
          <div className="recipe-sheet__body">
            <p className="kicker">
              {recipe.minutes} minutes · serves {recipe.serves}
            </p>
            <h2 id="recipe-title">{recipe.title}</h2>
            <p className="recipe-sheet__note">{recipe.note}</p>

            <div className="recipe-sheet__cols">
              <section>
                <h3>From your pantry</h3>
                {recipe.have.length ? (
                  <ul className="usecheck">
                    {recipe.have.map((i) => (
                      <li key={i.id}>
                        <label>
                          <input type="checkbox" checked={selected.includes(i.id)} onChange={() => toggle(i.id)} />
                          <span>
                            {i.name}
                            <small className={`due due--${urgency(i)}`}>{dueLabel(i)}</small>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">None of the key ingredients are in stock.</p>
                )}
                {recipe.missing.length > 0 && (
                  <p className="muted">
                    You’ll also need: <strong>{recipe.missing.join(', ')}</strong>
                  </p>
                )}
              </section>
              <section>
                <h3>Method</h3>
                <ol className="steps">
                  {recipe.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </section>
            </div>

            <footer className="recipe-sheet__foot">
              <p className="muted">Cooked it? Ticked items leave the pantry and count as used, not wasted.</p>
              <button className="btn" disabled={!selected.length} onClick={() => onCooked(selected)}>
                I cooked this{selected.length ? `: use ${selected.length} item${selected.length > 1 ? 's' : ''}` : ''}
              </button>
            </footer>
          </div>
        </article>
      )}
    </dialog>
  )
}
