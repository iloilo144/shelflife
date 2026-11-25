import { useState } from 'react'
import { photo, photoFor } from '../data/catalog'

const TINTS = {
  produce: '#dfe6cf',
  dairy: '#f3ead2',
  meat: '#f1d8cf',
  grains: '#efe2c6',
  bakery: '#ead9c0',
  pantry: '#e6e0d4',
}

/** Ingredient photo when we have one, otherwise a tinted monogram. */
export default function Thumb({ item, width = 240, className = '', eager = false }) {
  const [failed, setFailed] = useState(false)
  const id = photoFor(item.name)

  if (!id || failed) {
    return (
      <span className={`thumb thumb--mono ${className}`} style={{ background: TINTS[item.category] }} aria-hidden="true">
        {item.name.charAt(0)}
      </span>
    )
  }
  return (
    <img className={`thumb ${className}`} src={photo(id, width)} alt="" loading={eager ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
  )
}
