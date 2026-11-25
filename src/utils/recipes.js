import { RECIPES } from '../data/catalog'
import { daysLeft } from './dates'

/**
 * Scores every recipe against what is in the pantry.
 * - coverage: share of the recipe's key ingredients you already have
 * - rescue:   how many of those are expiring within three days
 * Recipes that rescue food rank above recipes that merely match.
 */
export function suggestRecipes(items) {
  const usable = items.filter((i) => daysLeft(i) >= 0)

  return RECIPES.map((recipe) => {
    const matches = recipe.needs.map((need) => ({
      need,
      item: usable
        .filter((i) => i.name.toLowerCase().includes(need))
        .sort((a, b) => daysLeft(a) - daysLeft(b))[0],
    }))
    const have = matches.filter((m) => m.item)
    const missing = matches.filter((m) => !m.item).map((m) => m.need)
    const rescues = have.filter((m) => daysLeft(m.item) <= 3).map((m) => m.item)
    const coverage = have.length / recipe.needs.length
    return {
      ...recipe,
      have: have.map((m) => m.item),
      missing,
      rescues,
      coverage,
      score: coverage * 10 + rescues.length * 3 - missing.length * 2,
    }
  }).sort((a, b) => b.score - a.score)
}
