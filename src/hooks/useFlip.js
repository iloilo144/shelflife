import { useLayoutEffect, useRef } from 'react'

export const SPRING =
  'linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077, 1.121, 1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1)'

export const reducedMotion = () => document.documentElement.dataset.motion === 'calm'

/**
 * FLIP list animation with the Web Animations API. Children of the container that carry
 * a `data-flip` id glide (with a springy overshoot) from where they were to where they are now
 * whenever the list re-renders. New children pop in.
 */
export function useFlip(containerRef) {
  const previous = useRef(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const next = new Map()
    for (const child of el.children) {
      const id = child.dataset.flip
      if (!id) continue
      const pos = { x: child.offsetLeft, y: child.offsetTop }
      next.set(id, pos)
      const before = previous.current?.get(id)
      if (reducedMotion() || !previous.current) continue
      if (before) {
        const dx = before.x - pos.x
        const dy = before.y - pos.y
        if (dx || dy) {
          child.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 650, easing: SPRING })
        }
      } else {
        child.animate(
          [
            { opacity: 0, transform: 'scale(0.85)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 600, easing: SPRING },
        )
      }
    }
    previous.current = next
  })
}

/** Plays an exit animation on every element for this id, then calls `done`. */
export function animateOut(id, kind, done) {
  const els = [...document.querySelectorAll(`[data-flip="${id}"]`)]
  if (!els.length || reducedMotion()) return done()
  const to =
    kind === 'used'
      ? { transform: 'translateX(60px) rotate(4deg) scale(0.9)', opacity: 0 }
      : { transform: 'translateY(30px) rotate(-10deg) scale(0.7)', opacity: 0 }
  // a little squash before it leaves makes it feel physical
  const animations = els.map((el) =>
    el.animate(
      [{ transform: 'none', opacity: 1 }, { transform: 'scale(1.04, 0.94)', opacity: 1, offset: 0.25 }, to],
      { duration: 380, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' },
    ),
  )
  animations[0].onfinish = done
}
