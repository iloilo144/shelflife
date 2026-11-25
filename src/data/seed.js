import { addDays, toISODate } from '../utils/dates'

let n = 0
const id = () => `seed-${++n}`

// [name, category, quantity, unit, location, expires in (days), shelf life (days), price £]
const PANTRY = [
  ['Spinach', 'produce', 200, 'g', 'Fridge', 0, 5, 1.5],
  ['Sourdough bread', 'bakery', 1, 'loaf', 'Cupboard', 1, 4, 3.2],
  ['Tomatoes', 'produce', 5, 'pcs', 'Fridge', 1, 7, 1.8],
  ['Whole milk', 'dairy', 1, 'L', 'Fridge', 2, 7, 1.25],
  ['Chicken thighs', 'meat', 500, 'g', 'Fridge', 2, 5, 4.5],
  ['Greek yoghurt', 'dairy', 500, 'g', 'Fridge', -1, 14, 2.1],
  ['Broccoli', 'produce', 1, 'head', 'Fridge', 3, 7, 0.9],
  ['Mangoes', 'produce', 2, 'pcs', 'Cupboard', 4, 6, 2.4],
  ['Carrots', 'produce', 6, 'pcs', 'Fridge', 8, 14, 0.8],
  ['Free-range eggs', 'dairy', 6, 'pcs', 'Fridge', 9, 21, 2.3],
  ['Potatoes', 'produce', 1.5, 'kg', 'Cupboard', 12, 21, 1.6],
  ['Mature cheddar', 'dairy', 250, 'g', 'Fridge', 14, 30, 2.9],
  ['Brown onions', 'produce', 3, 'pcs', 'Cupboard', 18, 30, 0.7],
  ['Salted butter', 'dairy', 250, 'g', 'Fridge', 20, 45, 2.2],
  ['Garlic', 'produce', 1, 'head', 'Cupboard', 25, 40, 0.5],
  ['Basmati rice', 'grains', 1, 'kg', 'Cupboard', 240, 365, 2.5],
  ['Penne', 'grains', 500, 'g', 'Cupboard', 300, 365, 0.95],
  ['Spaghetti', 'grains', 500, 'g', 'Cupboard', 320, 365, 0.95],
]

function seedItems() {
  return PANTRY.map(([name, category, qty, unit, location, expiresIn, shelf, price]) => ({
    id: id(),
    name,
    category,
    qty,
    unit,
    location,
    price,
    addedAt: toISODate(addDays(expiresIn - shelf)),
    expiresAt: toISODate(addDays(expiresIn)),
  }))
}

// A believable six-week history so the Insights view has something to show.
const HISTORY = [
  ['Whole milk', 'dairy', 'used', 2, 1.25],
  ['Bananas', 'produce', 'wasted', 3, 1.1],
  ['Chicken breast', 'meat', 'used', 4, 4.8],
  ['Free-range eggs', 'dairy', 'used', 5, 2.3],
  ['Coriander', 'produce', 'wasted', 6, 0.8],
  ['Sourdough bread', 'bakery', 'used', 7, 3.2],
  ['Tomatoes', 'produce', 'used', 8, 1.8],
  ['Natural yoghurt', 'dairy', 'used', 9, 1.6],
  ['Salmon fillets', 'meat', 'used', 11, 5.5],
  ['Lettuce', 'produce', 'wasted', 12, 0.9],
  ['Mushrooms', 'produce', 'used', 13, 1.3],
  ['Whole milk', 'dairy', 'used', 15, 1.25],
  ['Peppers', 'produce', 'used', 16, 1.5],
  ['Double cream', 'dairy', 'wasted', 18, 1.4],
  ['Minced beef', 'meat', 'used', 19, 3.9],
  ['Courgettes', 'produce', 'used', 20, 1.2],
  ['Bagels', 'bakery', 'wasted', 22, 1.5],
  ['Spinach', 'produce', 'used', 23, 1.5],
  ['Free-range eggs', 'dairy', 'used', 24, 2.3],
  ['Cucumber', 'produce', 'wasted', 26, 0.7],
  ['Feta', 'dairy', 'used', 27, 1.9],
  ['Strawberries', 'produce', 'wasted', 29, 2.5],
  ['Halloumi', 'dairy', 'used', 30, 2.6],
  ['Chicken thighs', 'meat', 'used', 32, 4.5],
  ['Lettuce', 'produce', 'wasted', 33, 0.9],
  ['Bread rolls', 'bakery', 'wasted', 35, 1.2],
  ['Whole milk', 'dairy', 'wasted', 37, 1.25],
  ['Avocados', 'produce', 'wasted', 38, 2.0],
  ['Broccoli', 'produce', 'used', 40, 0.9],
]

function seedLog() {
  return HISTORY.map(([name, category, action, daysAgo, price]) => ({
    id: id(),
    name,
    category,
    action,
    price,
    at: addDays(-daysAgo).toISOString(),
  }))
}

export function createSeed() {
  n = 0
  return { items: seedItems(), log: seedLog() }
}
