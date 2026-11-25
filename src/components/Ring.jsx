/** A freshness ring: a full ring means just bought, an empty one means use it now. */
export default function Ring({ value, level, size = 44, children }) {
  const r = 18
  const c = 2 * Math.PI * r
  return (
    <span className={`ring ring--${level}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={r} className="ring__track" />
        <circle
          cx="22"
          cy="22"
          r={r}
          className="ring__value"
          style={{ strokeDasharray: c, '--offset': c * (1 - Math.max(0.04, value)), '--full': c }}
        />
      </svg>
      <span className="ring__inner">{children}</span>
    </span>
  )
}
