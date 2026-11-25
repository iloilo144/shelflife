export const photo = (id, width = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=72`

export const CATEGORIES = [
  { id: 'all', label: 'Everything' },
  { id: 'produce', label: 'Fruit & veg' },
  { id: 'dairy', label: 'Dairy & eggs' },
  { id: 'meat', label: 'Meat & fish' },
  { id: 'grains', label: 'Grains & pasta' },
  { id: 'bakery', label: 'Bakery' },
  { id: 'pantry', label: 'Cupboard' },
]

export const LOCATIONS = ['Fridge', 'Freezer', 'Cupboard']
export const UNITS = ['pcs', 'g', 'kg', 'ml', 'L', 'pack', 'loaf', 'head']

/** Ingredient photography, matched by keyword in the ingredient name. */
export const INGREDIENT_PHOTOS = {
  milk: '1563636619-e9143da7973b',
  egg: '1582722872445-44dc5f7e3c8f',
  tomato: '1592924357228-91a4daadcfea',
  spinach: '1576045057995-568f588f82fb',
  rice: '1586201375761-83865001e31c',
  cheddar: '1486297678162-eb2a19b0a32d',
  cheese: '1486297678162-eb2a19b0a32d',
  chicken: '1604503468506-a8da13d82791',
  potato: '1518977676601-b53f82aba655',
  carrot: '1598170845058-32b9d6a5da37',
  broccoli: '1615485290382-441e4d049cb5',
  bread: '1608198093002-ad4e005484ec',
  sourdough: '1608198093002-ad4e005484ec',
  mango: '1601493700631-2b16ec4b4716',
}

export function photoFor(name) {
  const key = Object.keys(INGREDIENT_PHOTOS).find((k) => name.toLowerCase().includes(k))
  return key ? INGREDIENT_PHOTOS[key] : null
}

/**
 * Recipes are matched against the pantry by keyword. `needs` are the ingredients
 * that matter; salt, pepper and oil are assumed to be in every kitchen.
 */
export const RECIPES = [
  {
    id: 'eggs-on-toast',
    title: 'Eggs on toast with wilted spinach',
    image: '1525351484163-7529414344d8',
    minutes: 10,
    serves: 1,
    needs: ['egg', 'bread', 'spinach', 'butter'],
    note: 'The fastest way to rescue a bag of spinach before it turns.',
    steps: [
      'Toast two thick slices of bread and butter them while hot.',
      'Wilt the spinach in a dry pan for one minute and season well.',
      'Fry or poach the eggs to your liking.',
      'Pile the spinach on the toast and top with the eggs and black pepper.',
    ],
  },
  {
    id: 'egg-fried-rice',
    title: 'Egg fried rice with carrot',
    image: '1603133872878-684f208fb84b',
    minutes: 20,
    serves: 2,
    needs: ['rice', 'egg', 'carrot', 'onion'],
    note: 'Best with cold, day-old rice. A good home for leftovers.',
    steps: [
      'Cook the rice and spread it out to cool (or use leftovers).',
      'Fry diced onion and carrot in a hot pan for 4 minutes.',
      'Push to the side, scramble the eggs, then stir everything together.',
      'Add the rice and fry until hot and slightly crisp. Season with soy sauce.',
    ],
  },
  {
    id: 'chicken-curry',
    title: 'Chicken, tomato & spinach curry',
    image: '1588166524941-3bf61a9c41db',
    minutes: 40,
    serves: 4,
    needs: ['chicken', 'tomato', 'onion', 'spinach', 'rice'],
    note: 'Uses up soft tomatoes beautifully. They melt into the sauce.',
    steps: [
      'Soften a sliced onion with garlic, ginger and curry spices.',
      'Brown the diced chicken, then add chopped tomatoes and a splash of water.',
      'Simmer for 20 minutes until thick. Stir through the spinach at the end.',
      'Serve with rice and a spoon of yoghurt if you have it.',
    ],
  },
  {
    id: 'penne-arrabbiata',
    title: 'Penne all’arrabbiata',
    image: '1621996346565-e3dbc646d9a9',
    minutes: 25,
    serves: 2,
    needs: ['penne', 'tomato', 'garlic'],
    note: 'Three ingredients and a pinch of chilli.',
    steps: [
      'Cook the penne in well-salted water.',
      'Gently fry sliced garlic and chilli flakes in olive oil.',
      'Add chopped tomatoes and cook down for 10 minutes.',
      'Toss with the pasta and a splash of pasta water.',
    ],
  },
  {
    id: 'cheesy-spaghetti',
    title: 'Black pepper & cheddar spaghetti',
    image: '1588013273468-315fd88ea34c',
    minutes: 15,
    serves: 2,
    needs: ['spaghetti', 'cheddar', 'butter'],
    note: 'A fridge-raid take on cacio e pepe.',
    steps: [
      'Cook the spaghetti and keep a mug of the cooking water.',
      'Toast plenty of black pepper in butter.',
      'Off the heat, toss the pasta with the butter, finely grated cheddar and splashes of water until glossy.',
    ],
  },
  {
    id: 'carrot-potato-soup',
    title: 'Roasted carrot & potato soup',
    image: '1476718406336-bb5a9690ee2a',
    minutes: 45,
    serves: 4,
    needs: ['carrot', 'potato', 'onion', 'milk'],
    note: 'Bendy carrots welcome. Freezes well for later.',
    steps: [
      'Roast chopped carrots, potatoes and onion at 200°C for 30 minutes.',
      'Blend with hot stock until smooth.',
      'Stir in a splash of milk, season and reheat gently.',
    ],
  },
  {
    id: 'spaghetti-sugo',
    title: 'Slow tomato spaghetti',
    image: '1572441713132-c542fc4fe282',
    minutes: 50,
    serves: 4,
    needs: ['spaghetti', 'tomato', 'onion', 'carrot', 'garlic'],
    note: 'Grated carrot adds sweetness to the sauce.',
    steps: [
      'Gently cook finely chopped onion, carrot and garlic for 10 minutes.',
      'Add chopped tomatoes and simmer for 30 minutes.',
      'Toss with spaghetti and finish with cheese if you have it.',
    ],
  },
  {
    id: 'chicken-rice-bowl',
    title: 'Chicken & greens rice bowl',
    image: '1546069901-ba9599a7e63c',
    minutes: 30,
    serves: 2,
    needs: ['chicken', 'rice', 'broccoli', 'spinach'],
    note: 'Cook once, eat twice. It makes a good lunch box.',
    steps: [
      'Season and pan-fry the chicken until golden and cooked through.',
      'Steam the broccoli for 4 minutes and wilt the spinach.',
      'Serve over rice with a squeeze of lemon.',
    ],
  },
  {
    id: 'mango-lassi',
    title: 'Mango lassi',
    image: '1585515320310-259814833e62',
    minutes: 5,
    serves: 2,
    needs: ['mango', 'yoghurt', 'milk'],
    note: 'Very ripe mangoes make the best lassi.',
    steps: ['Blend the mango flesh with yoghurt, milk and a pinch of cardamom.', 'Serve cold.'],
  },
  {
    id: 'potato-egg-skillet',
    title: 'Crispy potato & egg skillet',
    image: '1512058564366-18510be2db19',
    minutes: 35,
    serves: 2,
    needs: ['potato', 'egg', 'onion', 'spinach'],
    note: 'A weekend breakfast that clears out the veg drawer.',
    steps: [
      'Parboil diced potatoes for 6 minutes, then drain.',
      'Fry with sliced onion until crisp.',
      'Stir in the spinach, make wells and crack in the eggs.',
      'Cover and cook until the whites are set.',
    ],
  },
  {
    id: 'panzanella',
    title: 'Tomato & bread salad',
    image: '1512621776951-a57141f2eefd',
    minutes: 15,
    serves: 2,
    needs: ['bread', 'tomato', 'onion'],
    note: 'Stale bread is the point here, not a problem.',
    steps: [
      'Tear the bread into chunks and toast in olive oil.',
      'Chop the tomatoes and slice the onion thinly. Salt them and leave for 5 minutes.',
      'Toss everything with vinegar and olive oil and leave to soak for 10 minutes.',
    ],
  },
]
