import { ChefHat, ChartColumn, Refrigerator } from 'lucide-react'
import { daysLeft } from '../utils/dates'
import './Masthead.css'

const SECTIONS = [
  { id: 'pantry', label: 'Pantry', icon: Refrigerator },
  { id: 'cook', label: 'Cook', icon: ChefHat },
  { id: 'insights', label: 'Waste log', icon: ChartColumn },
]

export default function Masthead({ items, tab, onTab }) {
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const soon = items.filter((i) => daysLeft(i) <= 3).length
  const index = SECTIONS.findIndex((s) => s.id === tab)

  return (
    <header className="appbar">
      <div className="appbar__inner wrap">
        <a href="#pantry" className="brand" onClick={(e) => (e.preventDefault(), onTab('pantry'))}>
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="34" height="34">
              <circle cx="16" cy="18" r="10" fill="#E5482E" stroke="#2B1D14" strokeWidth="2" />
              <path d="M16 8c1.5-3.5 5-4.5 7.5-3.2-1.2 2.6-3.8 3.6-7.5 3.2z" fill="#3F8F4E" stroke="#2B1D14" strokeWidth="1.6" />
              <ellipse cx="12.5" cy="15" rx="2.2" ry="1.4" fill="#fff" opacity="0.6" />
            </svg>
          </span>
          <span className="brand__name">shelflife</span>
        </a>

        {/* segmented tabs; the highlight springs to the active one */}
        <nav className="tabs" aria-label="Sections" style={{ '--index': index, '--count': SECTIONS.length }}>
          <span className="tabs__blob" aria-hidden="true" />
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={tab === s.id ? 'page' : undefined}
              onClick={(e) => {
                e.preventDefault()
                onTab(s.id)
              }}
            >
              <s.icon size={18} aria-hidden="true" />
              <span>{s.label}</span>
              {s.id === 'pantry' && soon > 0 && (
                <span className="tabs__badge" aria-label={`${soon} expiring soon`}>
                  {soon}
                </span>
              )}
            </a>
          ))}
        </nav>

        <p className="appbar__date">{today}</p>
      </div>
    </header>
  )
}
