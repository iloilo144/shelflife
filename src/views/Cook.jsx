import { useMemo, useState } from 'react'
import { Clock, Users } from 'lucide-react'
import { photo } from '../data/catalog'
import { suggestRecipes } from '../utils/recipes'
import RecipeDialog from '../components/RecipeDialog'
import './Cook.css'

function Ingredients({ recipe }) {
  return (
    <ul className="chips" aria-label="Ingredients">
      {recipe.needs.map((need) => {
        const have = recipe.have.find((i) => i.name.toLowerCase().includes(need))
        const rescue = have && recipe.rescues.includes(have)
        return (
          <li key={need} className={have ? (rescue ? 'is-rescue' : 'is-have') : 'is-missing'}>
            {need}
            <span className="visually-hidden">{have ? (rescue ? ' (in stock, expiring soon)' : ' (in stock)') : ' (missing)'}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default function Cook({ items, onFinish }) {
  const [onlyReady, setOnlyReady] = useState(false)
  const [open, setOpen] = useState(null)
  const ranked = useMemo(() => suggestRecipes(items), [items])
  const list = onlyReady ? ranked.filter((r) => !r.missing.length) : ranked
  const [lead, ...rest] = list

  return (
    <div className="cook">
      <header className="cook__head">
        <div>
          <p className="kicker">Suggested from your shelves</p>
          <h2>What to cook tonight</h2>
          <p className="cook__intro">
            Recipes are ranked by how much of each one you already have, and by how much food they rescue before it
            turns.
          </p>
        </div>
        <label className="toggle">
          <input type="checkbox" checked={onlyReady} onChange={(e) => setOnlyReady(e.target.checked)} />
          <span className="toggle__track" aria-hidden="true" />
          Only what I can make now
        </label>
      </header>

      {!lead ? (
        <p className="cook__empty">
          Nothing can be made entirely from what is in stock. Switch the filter off to see near-misses.
        </p>
      ) : (
        <>
          <article className="feature">
            <button className="feature__img" onClick={() => setOpen(lead)} aria-label={`Open recipe: ${lead.title}`}>
              <img src={photo(lead.image, 1100)} alt="" />
            </button>
            <div className="feature__body">
              <p className="kicker">Top pick · {Math.round(lead.coverage * 100)}% in stock</p>
              <h3>{lead.title}</h3>
              <p className="feature__note">{lead.note}</p>
              {lead.rescues.length > 0 && (
                <p className="rescue">
                  Rescues {lead.rescues.map((i) => i.name.toLowerCase()).join(', ')}
                </p>
              )}
              <Ingredients recipe={lead} />
              <p className="meta">
                <span>
                  <Clock size={15} aria-hidden="true" /> {lead.minutes} min
                </span>
                <span>
                  <Users size={15} aria-hidden="true" /> Serves {lead.serves}
                </span>
              </p>
              <button className="btn" onClick={() => setOpen(lead)}>
                Read the recipe
              </button>
            </div>
          </article>

          <ul className="recipes">
            {rest.map((r) => (
              <li key={r.id} className="recipe">
                <div className="recipe__img">
                  <img src={photo(r.image, 600)} alt="" loading="lazy" />
                  <span className="recipe__score">
                    {r.have.length}/{r.needs.length}
                  </span>
                </div>
                <h3>
                  <button onClick={() => setOpen(r)}>{r.title}</button>
                </h3>
                <p className="meta">
                  <span>
                    <Clock size={14} aria-hidden="true" /> {r.minutes} min
                  </span>
                  {r.rescues.length > 0 && <span className="rescue rescue--small">Rescues {r.rescues.length}</span>}
                </p>
                <Ingredients recipe={r} />
              </li>
            ))}
          </ul>
        </>
      )}

      <RecipeDialog
        recipe={open}
        onClose={() => setOpen(null)}
        onCooked={(ids) => {
          onFinish(ids, 'used')
          setOpen(null)
        }}
      />
    </div>
  )
}
