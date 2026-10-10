// Dishes data store with Traditional Ethiopian cuisine, Western cuisine, and Beverages.
// Uses local high-resolution photography in /images/food for instant, reliable loading.

const DISHES = [
  // --- Traditional Ethiopian Cuisine ---
  {
    id: "doro-wat",
    name: "Doro Wat",
    category: "Traditional",
    price: 360,
    spicy: true,
    tag: "National Favorite",
    description: "Slow-simmered tender chicken in rich berbere sauce with hard-boiled egg and fresh injera.",
    image: "/images/food/doro-wat.jpg",
    color: "#7c5cff",
  },
  {
    id: "kitfo",
    name: "Special Kitfo",
    category: "Traditional",
    price: 390,
    spicy: true,
    tag: "Chef Special",
    description: "Hand-minced prime lean beef infused with spiced niter kibbeh and mitmita, served with ayib and gomen.",
    image: "/images/food/kitfo.jpg",
    color: "#5b3fd1",
  },
  {
    id: "tibs",
    name: "Shekla Tibs",
    category: "Traditional",
    price: 340,
    spicy: false,
    tag: "Sizzling Hot",
    description: "Tender sauteed beef cubes tossed with red onions, fresh garlic, rosemary, and jalapeno peppers.",
    image: "/images/food/shekla-tibs.jpg",
    color: "#5b3fd1",
  },
  {
    id: "shiro",
    name: "Shiro Tegabino",
    category: "Traditional",
    price: 240,
    spicy: false,
    tag: "Clay Pot",
    description: "Bubbling seasoned chickpea stew enriched with garlic, ginger, and spiced herbal butter.",
    image: "/images/food/shiro.jpg",
    color: "#7c5cff",
  },
  {
    id: "beyaynetu",
    name: "Beyaynetu Platter",
    category: "Traditional",
    price: 280,
    spicy: false,
    tag: "Vegan Feast",
    description: "Colorful assortment of Misir Wat, Kik Alicha, braised Gomen, and beetroot salad over fresh teff injera.",
    image: "/images/food/beyaynetu.jpg",
    color: "#7c5cff",
  },
  {
    id: "firfir",
    name: "Kuanta Firfir",
    category: "Traditional",
    price: 290,
    spicy: true,
    tag: "Authentic",
    description: "Cured dried beef jerky simmered in spicy berbere broth and folded with torn rolls of injera.",
    image: "/images/food/firfir.jpg",
    color: "#5b3fd1",
  },

  // --- Western Cuisine ---
  {
    id: "cheeseburger",
    name: "Gourmet Cheeseburger",
    category: "Western",
    price: 350,
    spicy: false,
    tag: "Handcrafted",
    description: "Prime beef patty, melted cheddar, crisp lettuce, ripe tomato, and house special sauce on a brioche bun with fries.",
    image: "/images/food/cheeseburger.jpg",
    color: "#e67e22",
  },
  {
    id: "margherita-pizza",
    name: "Wood-Fired Pizza",
    category: "Western",
    price: 380,
    spicy: false,
    tag: "Artisanal",
    description: "Crispy thin crust baked with San Marzano tomato sauce, fresh buffalo mozzarella, olive oil, and sweet basil.",
    image: "/images/food/margherita-pizza.jpg",
    color: "#e74c3c",
  },
  {
    id: "chicken-alfredo",
    name: "Creamy Chicken Alfredo",
    category: "Western",
    price: 360,
    spicy: false,
    tag: "Italian Classic",
    description: "Al dente fettuccine pasta in rich garlic parmesan cream sauce, topped with grilled chicken breast slices.",
    image: "/images/food/chicken-alfredo.jpg",
    color: "#f39c12",
  },
  {
    id: "club-sandwich",
    name: "Classic Club Sandwich",
    category: "Western",
    price: 310,
    spicy: false,
    tag: "Triple Decker",
    description: "Toasted farmhouse bread layered with roasted chicken, crisp beef bacon, cheddar, avocado, and herb mayo with fries.",
    image: "/images/food/club-sandwich.jpg",
    color: "#e67e22",
  },
  {
    id: "ribeye-steak",
    name: "Grilled Ribeye Steak",
    category: "Western",
    price: 490,
    spicy: false,
    tag: "Premium Cut",
    description: "Juicy char-grilled 250g ribeye steak topped with garlic herb butter, served with mashed potatoes and charred vegetables.",
    image: "/images/food/ribeye-steak.jpg",
    color: "#c0392b",
  },

  // --- Beverages & Desserts ---
  {
    id: "buna",
    name: "Traditional Buna Ceremony",
    category: "Drinks",
    price: 80,
    spicy: false,
    tag: "Jebena Brew",
    description: "Freshly roasted highland Ethiopian coffee beans brewed in a traditional clay jebena, served with fresh popcorn.",
    image: "/images/food/buna-ceremony.jpg",
    color: "#8e44ad",
  },
  {
    id: "tej",
    name: "Pure Honey Tej",
    category: "Drinks",
    price: 160,
    spicy: false,
    tag: "Highland Mead",
    description: "Fermented honey wine made from raw highland wild honey and gesho leaves, served in a traditional glass berele flask.",
    image: "/images/food/tej.jpg",
    color: "#f1c40f",
  },
  {
    id: "spris-juice",
    name: "Fresh Spris Juice",
    category: "Drinks",
    price: 120,
    spicy: false,
    tag: "100% Fresh",
    description: "Vibrant layered tropical fruit smoothie with pureed fresh avocado, sweet mango, and papaya with fresh lime.",
    image: "/images/food/spris-juice.jpg",
    color: "#27ae60",
  },
];

export const HERO_IMAGE = "/images/food/hero-feast.jpg";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDishes(category) {
  await delay(150);
  if (category) {
    return DISHES.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }
  return DISHES;
}

export async function getDishById(id) {
  await delay(80);
  return getDishByIdSync(id);
}

export function getDishByIdSync(id) {
  if (!id) return null;
  const key = String(id).toLowerCase().trim();
  const strippedKey = key.replace(/[-_\s]/g, "");
  return (
    DISHES.find((d) => {
      const dId = d.id.toLowerCase();
      const dName = d.name.toLowerCase();
      return (
        dId === key ||
        dName === key ||
        dId.replace(/[-_\s]/g, "") === strippedKey ||
        dName.replace(/[-_\s]/g, "") === strippedKey ||
        key.includes(dId) ||
        dId.includes(key) ||
        key.includes(dName) ||
        dName.includes(key)
      );
    }) ?? null
  );
}

export function getDishByNameSync(name) {
  if (!name) return null;
  return getDishByIdSync(name);
}

export function getAllDishIds() {
  return DISHES.map((d) => d.id);
}

export function getCategories() {
  return [...new Set(DISHES.map((d) => d.category))];
}

