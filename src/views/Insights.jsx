import { useMemo } from 'react'
import { CATEGORIES } from '../data/catalog'
import { startOfToday } from '../utils/dates'
import './Insights.css'

const DAY = 86400000
const money = (n) => `£${n.toFixed(2)}`

function within(entries, fromDaysAgo, toDaysAgo) {
  const now = startOfToday().getTime() + DAY
  return entries.filter((e) => {
    const age = (now - new Date(e.at).getTime()) / DAY
    return age > toDaysAgo && age <= fromDaysAgo
  })
}

function summarise(entries) {
  const used = entries.filter((e) => e.action === 'used')
  const wasted = entries.filter((e) => e.action === 'wasted')
  const total = used.length + wasted.length
  return {
    used: used.length,
    wasted: wasted.length,
    rate: total ? Math.round((used.length / total) * 100) : null,
    lost: wasted.reduce((s, e) => s + (e.price || 0), 0),
    saved: used.reduce((s, e) => s + (e.price || 0), 0),
  }
}

function Donut({ value }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className="donut" role="img" aria-label={`${value}% eaten in time`}>
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r={r} className="donut__track" />
        <circle cx="64" cy="64" r={r} className="donut__value" style={{ strokeDasharray: c, '--offset': c * (1 - value / 100), '--full': c }} />
      </svg>
      <span>
        <strong>{value}%</strong>
        <small>in time</small>
      </span>
    </div>
  )
}

export default function Insights({ log, onReset }) {
  const month = useMemo(() => summarise(within(log, 30, 0)), [log])
  const previous = useMemo(() => summarise(within(log, 60, 30)), [log])

  const weeks = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const s = summarise(within(log, (i + 1) * 7, i * 7))
        return { ...s, label: i === 0 ? 'This week' : i === 1 ? 'Last week' : `${i} weeks ago` }
      }).reverse(),
    [log],
  )
  const peak = Math.max(1, ...weeks.map((w) => w.used + w.wasted))

  const byCategory = useMemo(() => {
    const wasted = log.filter((e) => e.action === 'wasted')
    return CATEGORIES.filter((c) => c.id !== 'all')
      .map((c) => ({ ...c, count: wasted.filter((e) => e.category === c.id).length }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count)
  }, [log])
  const topCategory = byCategory[0]
  const maxCat = Math.max(1, ...byCategory.map((c) => c.count))

  const trend = month.rate !== null && previous.rate !== null ? month.rate - previous.rate : null

  if (!log.length) {
    return (
      <section className="insights insights--empty">
        <h2>No history yet.</h2>
        <p>Mark ingredients as used or thrown away, and your waste log will build up here.</p>
      </section>
    )
  }

  return (
    <div className="insights">
      <header className="insights__head">
        <div>
        <p className="kicker">The last 30 days</p>
        <h2 className="insights__headline">
          {month.rate === null ? (
            'Nothing logged this month yet.'
          ) : (
            <>
              You ate <em>{month.rate}%</em> of your food before it went off
              {trend !== null && trend !== 0 && (
                <>
                  , {trend > 0 ? 'up' : 'down'} from {previous.rate}% the month before
                </>
              )}
              .
            </>
          )}
        </h2>
        </div>
        {month.rate !== null && <Donut value={month.rate} />}
      </header>

      <dl className="figures">
        <div>
          <dt>Used in time</dt>
          <dd>{month.used}</dd>
          <p>items, worth about {money(month.saved)}</p>
        </div>
        <div>
          <dt>Thrown away</dt>
          <dd className="is-bad">{month.wasted}</dd>
          <p>items, about {money(month.lost)} in the bin</p>
        </div>
        <div>
          <dt>Most wasted</dt>
          <dd className="figures__word">{topCategory ? topCategory.label : '—'}</dd>
          <p>{topCategory ? `${topCategory.count} items over six weeks` : 'Nothing wasted yet'}</p>
        </div>
      </dl>

      <div className="insights__grid">
        <section aria-labelledby="weeks-title">
          <h3 id="weeks-title" className="insights__sub">
            Week by week
          </h3>
          <div className="legend" aria-hidden="true">
            <span className="legend__used">Used</span>
            <span className="legend__wasted">Wasted</span>
          </div>
          <ol className="bars">
            {weeks.map((w) => (
              <li key={w.label}>
                <div className="bars__col" role="img" aria-label={`${w.label}: ${w.used} used, ${w.wasted} wasted`}>
                  <span className="bars__wasted" style={{ height: `${(w.wasted / peak) * 100}%` }} />
                  <span className="bars__used" style={{ height: `${(w.used / peak) * 100}%` }} />
                </div>
                <span className="bars__label">{w.label}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="cat-title">
          <h3 id="cat-title" className="insights__sub">
            What ends up in the bin
          </h3>
          {byCategory.length ? (
            <ul className="cats-bars">
              {byCategory.map((c) => (
                <li key={c.id}>
                  <span>{c.label}</span>
                  <span className="cats-bars__track">
                    <span style={{ width: `${(c.count / maxCat) * 100}%` }} />
                  </span>
                  <strong>{c.count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Nothing wasted. Impressive.</p>
          )}
          {topCategory?.id === 'produce' && (
            <p className="tip">
              <strong>Tip:</strong> leafy greens last longer wrapped in a dry tea towel inside a container. Buy salad
              on the day you plan to eat it.
            </p>
          )}
        </section>
      </div>

      <section className="logbook" aria-labelledby="log-title">
        <h3 id="log-title" className="insights__sub">
          Logbook
        </h3>
        <ol>
          {log.slice(0, 12).map((e) => (
            <li key={e.id}>
              <time dateTime={e.at}>
                {new Date(e.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </time>
              <span>{e.name}</span>
              <span className={`logbook__tag logbook__tag--${e.action}`}>{e.action === 'used' ? 'Used' : 'Binned'}</span>
            </li>
          ))}
        </ol>
      </section>

      <p className="insights__reset">
        Exploring the demo?{' '}
        <button
          className="note__link"
          onClick={() => window.confirm('Restore the sample pantry and history? Your changes will be lost.') && onReset()}
        >
          Restore the sample data
        </button>
      </p>
    </div>
  )
}
