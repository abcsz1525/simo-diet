/**
 * SIMO DIET — Phase 1 (Eliminación)
 * Полная адаптация на русский на основе оригинальных материалов.
 */

export type FoodStatus = "allowed" | "forbidden";
export type FoodCategory =
  | "protein"
  | "fat"
  | "carb"
  | "vegetable"
  | "fruit"
  | "drink"
  | "spice"
  | "dairy"
  | "grain"
  | "legume"
  | "sweetener"
  | "nut"
  | "seafood";

export interface Food {
  id: string;
  name: string;
  emoji: string;
  status: FoodStatus;
  category: FoodCategory;
  reason?: string;
  meal?: ("morning_water" | "first" | "second" | "third" | "before_bed")[];
  aliases?: string[];
}

/* ----------------------------------------------------------------------------
 * 10 ПРАВИЛ
 * -------------------------------------------------------------------------- */
export const RULES: { n: number; title: string; detail?: string }[] = [
  { n: 1, title: "Ешь только когда голоден" },
  { n: 2, title: "Не делай по-своему — следуй плану" },
  { n: 3, title: "Перекусы запрещены" },
  { n: 4, title: "Не меняй порядок приёмов пищи" },
  { n: 5, title: "Никаких обработанных приправ" },
  {
    n: 6,
    title: "Никаких рафинированных растительных масел, муки, сахара и молочных продуктов",
  },
  {
    n: 7,
    title: "На Фазе 1 — никаких подсластителей и мёда. Только чёрный кофе",
  },
  {
    n: 8,
    title: "Никаких колбас и салями, кроме строго ремесленных",
  },
  { n: 9, title: "Никаких овощей с лектином" },
  {
    n: 10,
    title: "Не тренируйся два дня подряд и никаких добавок",
  },
];

/* ----------------------------------------------------------------------------
 * СОВЕТЫ
 * -------------------------------------------------------------------------- */
export const TIPS: string[] = [
  "Если есть тревога — добавь больше жиров утром и больше углеводов вечером.",
  "НИКОГДА не клади мёд в кофе. Мёд — это углевод. Только вечером с фруктом.",
  "Единственный разрешённый орех — макадамия. Никаких миндаля, кешью, арахиса.",
  "Все клубни разрешены, кроме картофеля (высокий лектин).",
  "Бариатрическим пациентам — есть строго по плану, в том же порядке, только когда голоден.",
  "Подсластители Monkfruit и Lakanto — только для Фазы 2. На Фазе 1 — НЕТ.",
];

/* ----------------------------------------------------------------------------
 * СТРУКТУРА ДНЯ
 * -------------------------------------------------------------------------- */
export const DAY_STRUCTURE = [
  {
    id: "morning_water" as const,
    order: 0,
    title: "Утренняя вода",
    subtitle: "Сразу после пробуждения",
    instruction: "2–3 стакана тёплой воды + щепотка гималайской соли + сок лимона",
    optional: false,
    icon: "droplet",
  },
  {
    id: "first" as const,
    order: 1,
    title: "Первый приём пищи",
    subtitle: "Завтрак",
    instruction: "Белок + жир. Ешь до сытости. Не считай порции и калории.",
    optional: false,
    icon: "egg",
  },
  {
    id: "second" as const,
    order: 2,
    title: "Второй приём пищи",
    subtitle: "Обед (опционально)",
    instruction:
      "Белок + неограниченно зелёных овощей. Заправка: лимон + оливковое масло + яблочный уксус + соль.",
    optional: true,
    icon: "salad",
  },
  {
    id: "third" as const,
    order: 3,
    title: "Третий приём пищи",
    subtitle: "Ужин",
    instruction:
      "Белок + углеводы (белый рис, безглютеновая паста, корнеплоды кроме картофеля).",
    optional: false,
    icon: "utensils-crossed",
  },
  {
    id: "before_bed" as const,
    order: 4,
    title: "Фрукт перед сном",
    subtitle: "Опционально",
    instruction: "Один тропический фрукт: ананас, манго, дыня, кокос, банан.",
    optional: true,
    icon: "banana",
  },
];

/* ----------------------------------------------------------------------------
 * РАЗРЕШЁННЫЕ ПРОДУКТЫ
 * -------------------------------------------------------------------------- */
const ALLOWED: Food[] = [
  // Белки (для всех приёмов)
  { id: "beef",      name: "Говядина",      emoji: "🥩", status: "allowed", category: "protein", meal: ["first","second","third"] },
  { id: "poultry",   name: "Птица",         emoji: "🍗", status: "allowed", category: "protein", meal: ["first","second","third"], aliases:["курица","индейка"] },
  { id: "fish",      name: "Рыба",          emoji: "🐟", status: "allowed", category: "protein", meal: ["first","second","third"] },
  { id: "duck",      name: "Утка",          emoji: "🦆", status: "allowed", category: "protein", meal: ["first","second","third"] },
  { id: "pork",      name: "Свинина",       emoji: "🥓", status: "allowed", category: "protein", meal: ["first","second","third"] },
  { id: "liver",     name: "Печень",        emoji: "🫀", status: "allowed", category: "protein", meal: ["first","second","third"] },
  { id: "sardines",  name: "Сардины",       emoji: "🐟", status: "allowed", category: "protein", reason:"в оливковом масле или воде", meal:["first","second","third"] },
  { id: "eggs",      name: "Цельные яйца",  emoji: "🥚", status: "allowed", category: "protein", meal:["first","second","third"], aliases:["яйца"] },
  { id: "salmon",    name: "Лосось",        emoji: "🍣", status: "allowed", category: "protein", meal:["first","second","third"] },
  { id: "lamb",      name: "Ягнёнок",       emoji: "🍖", status: "allowed", category: "protein", meal:["first","second","third"], aliases:["баранина"] },
  { id: "sausage",   name: "Колбаса (только ремесленная)", emoji:"🌭", status:"allowed", category:"protein", reason:"только ручного производства, без сахара и крахмала", meal:["first","second","third"] },
  { id: "salami",    name: "Салями (только ремесленная)",  emoji:"🥩", status:"allowed", category:"protein", reason:"только ручного производства", meal:["first","second","third"] },
  { id: "bacon",     name: "Бекон (только ремесленный)",   emoji:"🥓", status:"allowed", category:"protein", meal:["first","second","third"] },

  // Жиры (для первого приёма)
  { id: "olive-oil",       name: "Оливковое масло Extra Virgin", emoji:"🫒", status:"allowed", category:"fat",  meal:["first","second","third"] },
  { id: "olive-pomace",    name: "Оливковый жмых",               emoji:"🫒", status:"allowed", category:"fat",  meal:["first","second","third"] },
  { id: "coconut-oil",     name: "Кокосовое масло (нерафинированное)", emoji:"🥥", status:"allowed", category:"fat", meal:["first","second","third"] },
  { id: "ghee",            name: "Гхи (топлёное масло)",         emoji:"🧈", status:"allowed", category:"fat",  meal:["first","second","third"] },
  { id: "butter",          name: "Сливочное масло",              emoji:"🧈", status:"allowed", category:"fat",  reason:"можно вместо гхи", meal:["first","second","third"] },
  { id: "avocado-oil",     name: "Масло авокадо",                emoji:"🥑", status:"allowed", category:"fat",  meal:["first","second","third"] },
  { id: "macadamia-oil",   name: "Масло макадамии",              emoji:"🥜", status:"allowed", category:"fat",  meal:["first","second","third"] },
  { id: "lard",            name: "Сало",                         emoji:"🥓", status:"allowed", category:"fat",  meal:["first","second","third"] },
  { id: "avocado",         name: "Авокадо",                      emoji:"🥑", status:"allowed", category:"fat",  meal:["first","second","third"] },
  { id: "macadamia",       name: "Орех макадамия",               emoji:"🥜", status:"allowed", category:"nut",  reason:"единственный разрешённый орех", meal:["first","second","third"] },
  { id: "olives",          name: "Оливки",                       emoji:"🫒", status:"allowed", category:"fat",  meal:["first","second","third"] },

  // Зелёные овощи (для второго приёма)
  { id: "spinach",     name: "Шпинат",        emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "chard",       name: "Мангольд",      emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "celery",      name: "Сельдерей",     emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "broccoli",    name: "Брокколи",      emoji:"🥦", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "cauliflower", name: "Цветная капуста",emoji:"🥦", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "arugula",     name: "Руккола",       emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "carrot",      name: "Морковь",       emoji:"🥕", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "beet",        name: "Свёкла",        emoji:"🫛", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "watercress",  name: "Кресс-салат",   emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "cabbage",     name: "Капуста",       emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "mushrooms",   name: "Грибы",         emoji:"🍄", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "lettuce",     name: "Салат листовой",emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "asparagus",   name: "Спаржа",        emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },

  // Углеводы (для третьего приёма)
  { id: "white-rice",     name: "Белый рис",                emoji:"🍚", status:"allowed", category:"carb", meal:["third"] },
  { id: "gluten-free-pasta",name:"Безглютеновая паста",     emoji:"🍝", status:"allowed", category:"carb", reason:"например, рисовая или из тапиоки", meal:["third"] },
  { id: "yam",            name: "Батат / ямс",              emoji:"🍠", status:"allowed", category:"carb", reason:"любые корнеплоды, КРОМЕ картофеля", meal:["third"], aliases:["сладкий картофель"] },
  { id: "cassava",        name: "Маниока (юкка)",           emoji:"🍠", status:"allowed", category:"carb", meal:["third"] },
  { id: "taro",           name: "Таро",                     emoji:"🍠", status:"allowed", category:"carb", meal:["third"] },

  // Фрукты перед сном
  { id: "pineapple", name: "Ананас",  emoji:"🍍", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "mango",     name: "Манго",   emoji:"🥭", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "melon",     name: "Дыня",    emoji:"🍈", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "coconut",   name: "Кокос",   emoji:"🥥", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "banana",    name: "Банан",   emoji:"🍌", status:"allowed", category:"fruit", meal:["before_bed"] },

  // Напитки и приправы
  { id: "water",        name: "Вода",                emoji:"💧", status:"allowed", category:"drink",  meal:["morning_water","first","second","third"] },
  { id: "himalayan-salt",name:"Гималайская соль",    emoji:"🧂", status:"allowed", category:"spice",  meal:["morning_water","first","second","third"] },
  { id: "lemon",        name: "Лимон",               emoji:"🍋", status:"allowed", category:"spice",  meal:["morning_water","second","third"] },
  { id: "apple-cider-vinegar",name:"Яблочный уксус", emoji:"🧴", status:"allowed", category:"spice",  reason:"для заправки салата", meal:["second"] },
  { id: "black-coffee", name:"Чёрный кофе",          emoji:"☕", status:"allowed", category:"drink",  reason:"только без сахара, мёда и подсластителей", meal:["first","second","third"] },

  // --- Расширенный список белков: мясо, птица, дичь ---
  { id: "veal",        name:"Телятина",        emoji:"🥩", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "horse-meat",  name:"Конина",          emoji:"🐴", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "venison",     name:"Оленина",         emoji:"🦌", status:"allowed", category:"protein", meal:["first","second","third"], aliases:["олень"] },
  { id: "rabbit",      name:"Кролик",          emoji:"🐇", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "goose",       name:"Гусь",            emoji:"🦢", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "chicken",     name:"Курица",          emoji:"🍗", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "turkey",      name:"Индейка",         emoji:"🦃", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "quail",       name:"Перепел",         emoji:"🐦", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "pheasant",    name:"Фазан",           emoji:"🐦", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "guinea-fowl", name:"Цесарка",         emoji:"🐦", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "boar",        name:"Кабан",           emoji:"🐗", status:"allowed", category:"protein", meal:["first","second","third"], aliases:["дикий кабан"] },
  { id: "goat",        name:"Козлятина",       emoji:"🐐", status:"allowed", category:"protein", meal:["first","second","third"] },

  // --- Субпродукты ---
  { id: "heart",          name:"Сердце",            emoji:"🫀", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "kidneys",        name:"Почки",             emoji:"🫘", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "tongue",         name:"Язык",              emoji:"👅", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "brain",          name:"Мозги",             emoji:"🧠", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "chicken-stomach",name:"Куриные желудки",   emoji:"🍗", status:"allowed", category:"protein", meal:["first","second","third"], aliases:["желудки","пупки"] },
  { id: "marrow",         name:"Костный мозг",      emoji:"🦴", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "bone-broth",     name:"Костный бульон",    emoji:"🍲", status:"allowed", category:"protein", reason:"без кубиков и приправ", meal:["first","second","third"] },

  // --- Расширенный список рыбы ---
  { id: "trout",       name:"Форель",          emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "tuna",        name:"Тунец",           emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "mackerel",    name:"Скумбрия",        emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "herring",     name:"Сельдь",          emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"], aliases:["селёдка"] },
  { id: "cod",         name:"Треска",          emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "perch",       name:"Окунь",           emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "pike-perch",  name:"Судак",           emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "pike",        name:"Щука",            emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "dorade",      name:"Дорадо",          emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "seabass",     name:"Сибас",           emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "halibut",     name:"Палтус",          emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "pollock",     name:"Минтай",          emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "hake",        name:"Хек",             emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "anchovies",   name:"Анчоусы",         emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "carp",        name:"Карп",            emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "flounder",    name:"Камбала",         emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "sturgeon",    name:"Осётр",           emoji:"🐟", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "caviar",      name:"Икра",            emoji:"🐟", status:"allowed", category:"protein", reason:"натуральная, без добавок", meal:["first","second","third"] },

  // --- Морепродукты ---
  { id: "shrimp",      name:"Креветки",        emoji:"🦐", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "squid",       name:"Кальмары",        emoji:"🦑", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "octopus",     name:"Осьминог",        emoji:"🐙", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "mussels",     name:"Мидии",           emoji:"🦪", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "oysters",     name:"Устрицы",         emoji:"🦪", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "scallops",    name:"Гребешки",        emoji:"🦪", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "crab",        name:"Краб",            emoji:"🦀", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "lobster",     name:"Омар",            emoji:"🦞", status:"allowed", category:"seafood", meal:["first","second","third"], aliases:["лобстер"] },
  { id: "langoustine", name:"Лангустин",       emoji:"🦞", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "sea-urchin",  name:"Морской ёж",      emoji:"🦔", status:"allowed", category:"seafood", meal:["first","second","third"] },
  { id: "crayfish",    name:"Раки",            emoji:"🦞", status:"allowed", category:"seafood", meal:["first","second","third"] },

  // --- Яйца ---
  { id: "quail-eggs",  name:"Перепелиные яйца", emoji:"🥚", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "duck-eggs",   name:"Утиные яйца",      emoji:"🥚", status:"allowed", category:"protein", meal:["first","second","third"] },
  { id: "goose-eggs",  name:"Гусиные яйца",     emoji:"🥚", status:"allowed", category:"protein", meal:["first","second","third"] },

  // --- Ремесленные мясные изделия ---
  { id: "prosciutto",  name:"Прошутто",        emoji:"🥩", status:"allowed", category:"protein", reason:"только ремесленный, без сахара и нитратов", meal:["first","second","third"] },
  { id: "jamon",       name:"Хамон",           emoji:"🥩", status:"allowed", category:"protein", reason:"только ремесленный, без сахара и нитратов", meal:["first","second","third"] },
  { id: "coppa",       name:"Коппа",           emoji:"🥩", status:"allowed", category:"protein", reason:"только ремесленная", meal:["first","second","third"] },
  { id: "bresaola",    name:"Брезаола",        emoji:"🥩", status:"allowed", category:"protein", reason:"только ремесленная", meal:["first","second","third"] },
  { id: "pancetta",    name:"Панчетта",        emoji:"🥓", status:"allowed", category:"protein", reason:"только ремесленная", meal:["first","second","third"] },
  { id: "guanciale",   name:"Гуанчале",        emoji:"🥓", status:"allowed", category:"protein", reason:"только ремесленный", meal:["first","second","third"] },
  { id: "chorizo-art", name:"Чоризо (ремесленный)", emoji:"🌭", status:"allowed", category:"protein", reason:"только без сахара и крахмала", meal:["first","second","third"] },

  // --- Дополнительные жиры ---
  { id: "tallow",      name:"Говяжий жир",     emoji:"🧈", status:"allowed", category:"fat", reason:"топлёный, традиционный", meal:["first","second","third"] },
  { id: "duck-fat",    name:"Утиный жир",      emoji:"🦆", status:"allowed", category:"fat", meal:["first","second","third"] },
  { id: "mct-oil",     name:"MCT-масло",       emoji:"🥥", status:"allowed", category:"fat", reason:"из кокоса", meal:["first","second","third"] },
  { id: "olives-green",name:"Оливки зелёные",  emoji:"🫒", status:"allowed", category:"fat", meal:["first","second","third"] },
  { id: "olives-black",name:"Оливки чёрные",   emoji:"🫒", status:"allowed", category:"fat", meal:["first","second","third"] },
  { id: "olives-kalamata", name:"Оливки каламата", emoji:"🫒", status:"allowed", category:"fat", meal:["first","second","third"] },

  // --- Расширенный список зелёных овощей ---
  { id: "kale",        name:"Кейл (кудрявая капуста)", emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"], aliases:["кале","кудрявая капуста"] },
  { id: "red-cabbage", name:"Краснокочанная капуста", emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "savoy-cabbage", name:"Савойская капуста", emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "napa-cabbage",  name:"Пекинская капуста", emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"], aliases:["китайская капуста","бок-чой","пак-чой"] },
  { id: "brussels-sprouts", name:"Брюссельская капуста", emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "zucchini",    name:"Цуккини",         emoji:"🥒", status:"allowed", category:"vegetable", reason:"молодой, без крупных семян", meal:["second"], aliases:["кабачок"] },
  { id: "cucumber",    name:"Огурец",          emoji:"🥒", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "radish",      name:"Редис",           emoji:"🌶️", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "turnip",      name:"Репа",            emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "leek",        name:"Лук-порей",       emoji:"🧅", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "onion",       name:"Лук репчатый",    emoji:"🧅", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "garlic",      name:"Чеснок",          emoji:"🧄", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "ginger",      name:"Имбирь",          emoji:"🫚", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "fennel",      name:"Фенхель",         emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "artichoke",   name:"Артишок",         emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "endive",      name:"Эндивий",         emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "chicory",     name:"Цикорий",         emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "beet-greens", name:"Свекольная ботва", emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "carrot-greens", name:"Морковная ботва", emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "iceberg",     name:"Айсберг",         emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "romaine",     name:"Ромэн",           emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "butterhead",  name:"Латук",           emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "champignons", name:"Шампиньоны",      emoji:"🍄", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "oyster-mushrooms", name:"Вешенки",    emoji:"🍄", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "chanterelles",name:"Лисички",         emoji:"🍄", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "porcini",     name:"Белые грибы",     emoji:"🍄", status:"allowed", category:"vegetable", meal:["second"], aliases:["боровик"] },
  { id: "shiitake",    name:"Шиитаке",         emoji:"🍄", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "kohlrabi",    name:"Кольраби",        emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"] },
  { id: "bok-choy",    name:"Бок-чой",         emoji:"🥬", status:"allowed", category:"vegetable", meal:["second"], aliases:["китайская капуста"] },
  { id: "dandelion",   name:"Одуванчик (листья)", emoji:"🌿", status:"allowed", category:"vegetable", meal:["second"] },

  // --- Травы и зелень ---
  { id: "parsley",     name:"Петрушка",        emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "dill",        name:"Укроп",           emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "cilantro",    name:"Кинза",           emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"], aliases:["кориандр зелень"] },
  { id: "basil",       name:"Базилик",         emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "thyme",       name:"Тимьян",          emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"], aliases:["чабрец"] },
  { id: "rosemary",    name:"Розмарин",        emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "oregano",     name:"Орегано",         emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"], aliases:["душица"] },
  { id: "mint",        name:"Мята",            emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "sage",        name:"Шалфей",          emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "tarragon",    name:"Эстрагон",        emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"], aliases:["тархун"] },
  { id: "chives",      name:"Зелёный лук",     emoji:"🌿", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "bay-leaf",    name:"Лавровый лист",   emoji:"🍃", status:"allowed", category:"spice", meal:["first","second","third"] },

  // --- Специи ---
  { id: "black-pepper",name:"Чёрный перец",    emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "white-pepper",name:"Белый перец",     emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "turmeric",    name:"Куркума",         emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "coriander-seed", name:"Кориандр (семена)", emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "cumin",       name:"Тмин",            emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"], aliases:["зира"] },
  { id: "cloves",      name:"Гвоздика",        emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "cinnamon",    name:"Корица",          emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "cardamom",    name:"Кардамон",        emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "nutmeg",      name:"Мускатный орех",  emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "star-anise",  name:"Бадьян",          emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"], aliases:["звёздчатый анис"] },
  { id: "fenugreek",   name:"Пажитник",        emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "saffron",     name:"Шафран",          emoji:"🧂", status:"allowed", category:"spice", meal:["first","second","third"] },
  { id: "sea-salt",    name:"Морская соль (нерафинированная)", emoji:"🧂", status:"allowed", category:"spice", meal:["morning_water","first","second","third"] },
  { id: "lime",        name:"Лайм",            emoji:"🍋", status:"allowed", category:"spice", meal:["morning_water","second","third"] },

  // --- Углеводы и корнеплоды ---
  { id: "rice-pasta",  name:"Рисовая паста",   emoji:"🍝", status:"allowed", category:"carb", meal:["third"] },
  { id: "corn-pasta",  name:"Кукурузная паста", emoji:"🍝", status:"allowed", category:"carb", reason:"безглютеновая", meal:["third"] },
  { id: "tapioca-pasta", name:"Тапиоковая паста", emoji:"🍝", status:"allowed", category:"carb", meal:["third"] },
  { id: "tapioca",     name:"Тапиока",         emoji:"🍚", status:"allowed", category:"carb", meal:["third"] },
  { id: "jerusalem-artichoke", name:"Топинамбур", emoji:"🍠", status:"allowed", category:"carb", meal:["third"], aliases:["земляная груша"] },
  { id: "parsnip",     name:"Пастернак",       emoji:"🥕", status:"allowed", category:"carb", meal:["third"] },
  { id: "rutabaga",    name:"Брюква",          emoji:"🥕", status:"allowed", category:"carb", meal:["third"] },
  { id: "sweet-potato",name:"Сладкий картофель", emoji:"🍠", status:"allowed", category:"carb", meal:["third"], aliases:["батат"] },
  { id: "yuca",        name:"Юкка",            emoji:"🍠", status:"allowed", category:"carb", reason:"то же, что и маниока", meal:["third"] },
  { id: "basmati",     name:"Рис басмати",     emoji:"🍚", status:"allowed", category:"carb", meal:["third"] },
  { id: "jasmine-rice",name:"Рис жасмин",      emoji:"🍚", status:"allowed", category:"carb", meal:["third"] },

  // --- Тропические фрукты ---
  { id: "papaya",      name:"Папайя",          emoji:"🍈", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "passion-fruit",name:"Маракуйя",       emoji:"🥝", status:"allowed", category:"fruit", meal:["before_bed"], aliases:["пассифлора"] },
  { id: "guava",       name:"Гуава",           emoji:"🍈", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "cantaloupe",  name:"Канталупа",       emoji:"🍈", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "honeydew",    name:"Медовая дыня",    emoji:"🍈", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "galia",       name:"Дыня галия",      emoji:"🍈", status:"allowed", category:"fruit", meal:["before_bed"] },
  { id: "young-coconut", name:"Молодой кокос", emoji:"🥥", status:"allowed", category:"fruit", meal:["before_bed"] },

  // --- Напитки ---
  { id: "mineral-water", name:"Минеральная вода", emoji:"💧", status:"allowed", category:"drink", meal:["morning_water","first","second","third"] },
  { id: "sparkling-water", name:"Газированная вода", emoji:"🫧", status:"allowed", category:"drink", reason:"без сахара и подсластителей", meal:["morning_water","first","second","third"] },
  { id: "herbal-tea",  name:"Травяной чай",    emoji:"🍵", status:"allowed", category:"drink", reason:"без сахара", meal:["first","second","third"] },
  { id: "chamomile-tea", name:"Чай ромашковый", emoji:"🍵", status:"allowed", category:"drink", meal:["first","second","third","before_bed"] },
  { id: "ginger-tea",  name:"Имбирный чай",    emoji:"🍵", status:"allowed", category:"drink", meal:["first","second","third"] },
  { id: "mint-tea",    name:"Мятный чай",      emoji:"🍵", status:"allowed", category:"drink", meal:["first","second","third","before_bed"] },
  { id: "espresso",    name:"Эспрессо",        emoji:"☕", status:"allowed", category:"drink", reason:"без сахара и молока", meal:["first","second","third"] },
  { id: "americano",   name:"Американо",       emoji:"☕", status:"allowed", category:"drink", reason:"без сахара и молока", meal:["first","second","third"] },
  { id: "rooibos",     name:"Ройбуш",          emoji:"🍵", status:"allowed", category:"drink", reason:"без сахара", meal:["first","second","third","before_bed"] },
];

/* ----------------------------------------------------------------------------
 * ЗАПРЕЩЁННЫЕ ПРОДУКТЫ (Фаза 1)
 * -------------------------------------------------------------------------- */
const FORBIDDEN: Food[] = [
  // Рафинированные масла
  { id: "canola-oil",   name:"Рапсовое масло",       emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное растительное масло" },
  { id: "sunflower-oil",name:"Подсолнечное масло",   emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное" },
  { id: "palm-oil",     name:"Пальмовое масло",      emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное" },
  { id: "peanut-oil",   name:"Арахисовое масло",     emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное + лектин" },
  { id: "soybean-oil",  name:"Соевое масло",         emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное + лектин" },

  // Молочные
  { id: "milk",        name:"Молоко",                emoji:"🥛", status:"forbidden", category:"dairy" },
  { id: "cheese",      name:"Сыр",                   emoji:"🧀", status:"forbidden", category:"dairy" },
  { id: "cream",       name:"Сливки",                emoji:"🥛", status:"forbidden", category:"dairy" },
  { id: "yogurt",      name:"Йогурт",                emoji:"🍦", status:"forbidden", category:"dairy" },
  { id: "almond-milk", name:"Миндальное молоко",     emoji:"🥛", status:"forbidden", category:"dairy", reason:"и любые растительные молока" },
  { id: "margarine",   name:"Маргарин",              emoji:"🧈", status:"forbidden", category:"dairy" },

  // Глютен и злаки
  { id: "oats",        name:"Овсянка",               emoji:"🌾", status:"forbidden", category:"grain", reason:"злаки" },
  { id: "granola",     name:"Гранола",               emoji:"🥣", status:"forbidden", category:"grain" },
  { id: "protein-bar", name:"Протеиновые батончики", emoji:"🍫", status:"forbidden", category:"grain" },
  { id: "whole-grains",name:"Цельные злаки",         emoji:"🌾", status:"forbidden", category:"grain" },
  { id: "bread",       name:"Хлеб",                  emoji:"🍞", status:"forbidden", category:"grain" },

  // Сахара и алкоголь
  { id: "artificial-sweeteners", name:"Искусственные подсластители", emoji:"🍬", status:"forbidden", category:"sweetener" },
  { id: "monkfruit",   name:"Monkfruit",             emoji:"🍯", status:"forbidden", category:"sweetener", reason:"только для Фазы 2" },
  { id: "lakanto",     name:"Lakanto",               emoji:"🍯", status:"forbidden", category:"sweetener", reason:"только для Фазы 2" },
  { id: "honey",       name:"Мёд (в кофе)",          emoji:"🍯", status:"forbidden", category:"sweetener", reason:"только вечером с фруктом, никогда в кофе" },
  { id: "cake",        name:"Торты",                 emoji:"🍰", status:"forbidden", category:"sweetener" },
  { id: "cookies",     name:"Печенье",               emoji:"🍪", status:"forbidden", category:"sweetener" },
  { id: "alcohol",     name:"Алкоголь",              emoji:"🍷", status:"forbidden", category:"drink" },

  // Лектиновые
  { id: "beans",       name:"Фасоль",                emoji:"🫘", status:"forbidden", category:"legume", reason:"высокий лектин" },
  { id: "chickpeas",   name:"Нут",                   emoji:"🫘", status:"forbidden", category:"legume", reason:"высокий лектин" },
  { id: "lentils",     name:"Чечевица",              emoji:"🫘", status:"forbidden", category:"legume", reason:"высокий лектин" },
  { id: "eggplant",    name:"Баклажан",              emoji:"🍆", status:"forbidden", category:"vegetable", reason:"семенные овощи — лектин" },
  { id: "pumpkin",     name:"Тыква",                 emoji:"🎃", status:"forbidden", category:"vegetable", reason:"высокий лектин" },
  { id: "tomato",      name:"Помидор",               emoji:"🍅", status:"forbidden", category:"vegetable", reason:"семенные овощи — лектин" },
  { id: "pepper",      name:"Перец",                 emoji:"🫑", status:"forbidden", category:"vegetable", reason:"семенные овощи — лектин" },
  { id: "potato",      name:"Картофель",             emoji:"🥔", status:"forbidden", category:"carb", reason:"высокий лектин" },
  { id: "strawberry",  name:"Клубника",              emoji:"🍓", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "cherry",      name:"Вишня",                 emoji:"🍒", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "grape",       name:"Виноград",              emoji:"🍇", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "apple",       name:"Яблоко",                emoji:"🍎", status:"forbidden", category:"fruit", reason:"тонкая кожура — лектин" },

  // Орехи
  { id: "almond",      name:"Миндаль",               emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "cashew",      name:"Кешью",                 emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "peanut",      name:"Арахис",                emoji:"🥜", status:"forbidden", category:"legume", reason:"бобовое + лектин" },

  // Добавки
  { id: "supplements", name:"Спортивные добавки",    emoji:"💊", status:"forbidden", category:"sweetener", reason:"правило 10: никаких добавок" },

  // --- Дополнительные рафинированные масла ---
  { id: "corn-oil",        name:"Кукурузное масло",         emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное" },
  { id: "safflower-oil",   name:"Сафлоровое масло",         emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное" },
  { id: "rice-bran-oil",   name:"Масло рисовых отрубей",    emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное" },
  { id: "grapeseed-oil",   name:"Масло виноградной косточки", emoji:"🛢️", status:"forbidden", category:"fat", reason:"рафинированное" },
  { id: "flaxseed-oil",    name:"Льняное масло",            emoji:"🛢️", status:"forbidden", category:"fat", reason:"окисляется, нестабильное" },
  { id: "vegetable-spread",name:"Растительный спред",       emoji:"🧈", status:"forbidden", category:"fat", reason:"промышленная переработка" },

  // --- Молочка (расширенный список) ---
  { id: "goat-milk",     name:"Козье молоко",      emoji:"🥛", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "sheep-milk",    name:"Овечье молоко",     emoji:"🥛", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "sour-cream",    name:"Сметана",           emoji:"🥛", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "cottage-cheese",name:"Творог",            emoji:"🧀", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "kefir",         name:"Кефир",             emoji:"🥛", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "ryazhenka",     name:"Ряженка",           emoji:"🥛", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "prostokvasha",  name:"Простокваша",       emoji:"🥛", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "ice-cream",     name:"Мороженое",         emoji:"🍦", status:"forbidden", category:"dairy", reason:"молочка + сахар" },
  { id: "oat-milk",      name:"Овсяное молоко",    emoji:"🥛", status:"forbidden", category:"dairy", reason:"промышленная переработка + злаки" },
  { id: "soy-milk",      name:"Соевое молоко",     emoji:"🥛", status:"forbidden", category:"dairy", reason:"бобовое + промышленная переработка" },
  { id: "rice-milk",     name:"Рисовое молоко",    emoji:"🥛", status:"forbidden", category:"dairy", reason:"промышленная переработка" },
  { id: "coconut-milk-pkg", name:"Кокосовое молоко (в пакете)", emoji:"🥛", status:"forbidden", category:"dairy", reason:"промышленная переработка" },
  { id: "condensed-milk", name:"Сгущёнка",         emoji:"🥛", status:"forbidden", category:"dairy", reason:"молочка + сахар" },
  { id: "feta",          name:"Фета",              emoji:"🧀", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "mozzarella",    name:"Моцарелла",         emoji:"🧀", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "parmesan",      name:"Пармезан",          emoji:"🧀", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "ricotta",       name:"Рикотта",           emoji:"🧀", status:"forbidden", category:"dairy", reason:"молочка" },
  { id: "mascarpone",    name:"Маскарпоне",        emoji:"🧀", status:"forbidden", category:"dairy", reason:"молочка" },

  // --- Глютеновые злаки ---
  { id: "wheat",         name:"Пшеница",           emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "rye",           name:"Рожь",              emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "barley",        name:"Ячмень",            emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "spelt",         name:"Спельта",           emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "kamut",         name:"Камут",             emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "bulgur",        name:"Булгур",            emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "couscous",      name:"Кускус",            emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "semolina",      name:"Манка",             emoji:"🌾", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "muesli",        name:"Мюсли",             emoji:"🥣", status:"forbidden", category:"grain", reason:"злаки + сахар" },
  { id: "pasta-regular", name:"Макароны (обычные)", emoji:"🍝", status:"forbidden", category:"grain", reason:"глютен" },
  { id: "pizza",         name:"Пицца",             emoji:"🍕", status:"forbidden", category:"grain", reason:"глютен + молочка" },
  { id: "tortilla",      name:"Тортилья",          emoji:"🫓", status:"forbidden", category:"grain", reason:"мука + промышленная переработка" },
  { id: "lavash",        name:"Лаваш",             emoji:"🫓", status:"forbidden", category:"grain", reason:"мука" },
  { id: "crackers",      name:"Хлебцы",            emoji:"🍘", status:"forbidden", category:"grain", reason:"мука + промышленная переработка" },
  { id: "croissant",     name:"Круассан",          emoji:"🥐", status:"forbidden", category:"grain", reason:"глютен + сахар" },
  { id: "pastry",        name:"Выпечка",           emoji:"🥐", status:"forbidden", category:"grain", reason:"глютен + сахар" },

  // --- Сахара и сладкое ---
  { id: "white-sugar",   name:"Белый сахар",       emoji:"🍬", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "brown-sugar",   name:"Коричневый сахар",  emoji:"🍬", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "cane-sugar",    name:"Тростниковый сахар", emoji:"🍬", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "maple-syrup",   name:"Кленовый сироп",    emoji:"🍯", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "agave",         name:"Агава",             emoji:"🍯", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "aspartame",     name:"Аспартам",          emoji:"🍬", status:"forbidden", category:"sweetener", reason:"искусственный подсластитель" },
  { id: "saccharin",     name:"Сахарин",           emoji:"🍬", status:"forbidden", category:"sweetener", reason:"искусственный подсластитель" },
  { id: "sucralose",     name:"Сукралоза",         emoji:"🍬", status:"forbidden", category:"sweetener", reason:"искусственный подсластитель" },
  { id: "acesulfame",    name:"Ацесульфам",        emoji:"🍬", status:"forbidden", category:"sweetener", reason:"искусственный подсластитель" },
  { id: "stevia",        name:"Стевия (порошок)",  emoji:"🍬", status:"forbidden", category:"sweetener", reason:"только Фаза 2" },
  { id: "erythritol",    name:"Эритрит",           emoji:"🍬", status:"forbidden", category:"sweetener", reason:"только Фаза 2" },
  { id: "jam",           name:"Варенье",           emoji:"🍯", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "marmalade",     name:"Мармелад",          emoji:"🍬", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "chocolate",     name:"Шоколад с сахаром", emoji:"🍫", status:"forbidden", category:"sweetener", reason:"сахар" },
  { id: "candy",         name:"Конфеты",           emoji:"🍬", status:"forbidden", category:"sweetener", reason:"сахар" },

  // --- Алкоголь ---
  { id: "wine",          name:"Вино",              emoji:"🍷", status:"forbidden", category:"drink", reason:"алкоголь" },
  { id: "beer",          name:"Пиво",              emoji:"🍺", status:"forbidden", category:"drink", reason:"алкоголь + глютен" },
  { id: "vodka",         name:"Водка",             emoji:"🍸", status:"forbidden", category:"drink", reason:"алкоголь" },
  { id: "whiskey",       name:"Виски",             emoji:"🥃", status:"forbidden", category:"drink", reason:"алкоголь" },
  { id: "champagne",     name:"Шампанское",        emoji:"🍾", status:"forbidden", category:"drink", reason:"алкоголь" },
  { id: "cocktails",     name:"Коктейли",          emoji:"🍹", status:"forbidden", category:"drink", reason:"алкоголь + сахар" },

  // --- Бобовые (расширенный) ---
  { id: "peas",          name:"Горох",             emoji:"🟢", status:"forbidden", category:"legume", reason:"лектин" },
  { id: "mung-beans",    name:"Маш",               emoji:"🫘", status:"forbidden", category:"legume", reason:"лектин" },
  { id: "soy",           name:"Соя",               emoji:"🫘", status:"forbidden", category:"legume", reason:"лектин" },
  { id: "tofu",          name:"Тофу",              emoji:"🥡", status:"forbidden", category:"legume", reason:"соя — лектин" },
  { id: "tempeh",        name:"Темпе",             emoji:"🥡", status:"forbidden", category:"legume", reason:"соя — лектин" },
  { id: "edamame",       name:"Эдамаме",           emoji:"🫛", status:"forbidden", category:"legume", reason:"соя — лектин" },
  { id: "green-beans",   name:"Зелёная фасоль",    emoji:"🫛", status:"forbidden", category:"legume", reason:"лектин" },

  // --- Лектиновые овощи (расширенный) ---
  { id: "bell-pepper",   name:"Болгарский перец",  emoji:"🫑", status:"forbidden", category:"vegetable", reason:"лектин" },
  { id: "chili-pepper",  name:"Перец чили",        emoji:"🌶️", status:"forbidden", category:"vegetable", reason:"лектин" },
  { id: "paprika",       name:"Паприка (свежая)",  emoji:"🌶️", status:"forbidden", category:"vegetable", reason:"лектин" },
  { id: "cherry-tomato", name:"Помидоры черри",    emoji:"🍅", status:"forbidden", category:"vegetable", reason:"лектин" },

  // --- Лектиновые фрукты (расширенный) ---
  { id: "pear",          name:"Груша",             emoji:"🍐", status:"forbidden", category:"fruit", reason:"лектин" },
  { id: "plum",          name:"Слива",             emoji:"🍑", status:"forbidden", category:"fruit", reason:"лектин" },
  { id: "apricot",       name:"Абрикос",           emoji:"🍑", status:"forbidden", category:"fruit", reason:"лектин" },
  { id: "peach",         name:"Персик",            emoji:"🍑", status:"forbidden", category:"fruit", reason:"лектин" },
  { id: "nectarine",     name:"Нектарин",          emoji:"🍑", status:"forbidden", category:"fruit", reason:"лектин" },
  { id: "raspberry",     name:"Малина",            emoji:"🫐", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "blackberry",    name:"Ежевика",           emoji:"🫐", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "currant",       name:"Смородина",         emoji:"🫐", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "blueberry",     name:"Черника",           emoji:"🫐", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "bilberry",      name:"Голубика",          emoji:"🫐", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "sweet-cherry",  name:"Черешня",           emoji:"🍒", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "cranberry",     name:"Клюква",            emoji:"🫐", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "pomegranate",   name:"Гранат",            emoji:"🍎", status:"forbidden", category:"fruit", reason:"лектин" },
  { id: "kiwi",          name:"Киви",              emoji:"🥝", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "fig-fresh",     name:"Инжир (свежий)",    emoji:"🍈", status:"forbidden", category:"fruit", reason:"лектин" },

  // --- Орехи и семена (кроме макадамии) ---
  { id: "walnut",        name:"Грецкий орех",      emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "hazelnut",      name:"Фундук",            emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "pistachio",     name:"Фисташки",          emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "pine-nut",      name:"Кедровые орехи",    emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "brazil-nut",    name:"Бразильский орех",  emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "pecan",         name:"Пекан",             emoji:"🥜", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "chestnut",      name:"Каштан",            emoji:"🌰", status:"forbidden", category:"nut", reason:"запрещены все орехи кроме макадамии" },
  { id: "sunflower-seed",name:"Семена подсолнуха", emoji:"🌻", status:"forbidden", category:"nut", reason:"семечки запрещены" },
  { id: "pumpkin-seed",  name:"Семена тыквы",      emoji:"🎃", status:"forbidden", category:"nut", reason:"семечки запрещены" },
  { id: "sesame",        name:"Кунжут",            emoji:"🥜", status:"forbidden", category:"nut", reason:"семечки запрещены" },
  { id: "flax",          name:"Лён (семя)",        emoji:"🥜", status:"forbidden", category:"nut", reason:"семечки запрещены" },
  { id: "chia",          name:"Чиа",               emoji:"🥜", status:"forbidden", category:"nut", reason:"семечки запрещены" },

  // --- Промышленные колбасы и мясные изделия ---
  { id: "industrial-sausage", name:"Сосиски (магазинные)", emoji:"🌭", status:"forbidden", category:"protein", reason:"промышленная переработка" },
  { id: "frankfurters",  name:"Сардельки",         emoji:"🌭", status:"forbidden", category:"protein", reason:"промышленная переработка" },
  { id: "ham-industrial",name:"Ветчина (промышленная)", emoji:"🥓", status:"forbidden", category:"protein", reason:"сахар + нитраты + крахмал" },
  { id: "shpikachki",    name:"Шпикачки",          emoji:"🌭", status:"forbidden", category:"protein", reason:"промышленная переработка" },
  { id: "doctorskaya",   name:"Докторская колбаса", emoji:"🌭", status:"forbidden", category:"protein", reason:"промышленная переработка" },
  { id: "nuggets",       name:"Куриные наггетсы",  emoji:"🍗", status:"forbidden", category:"protein", reason:"промышленная переработка" },

  // --- Соусы и обработанные приправы ---
  { id: "soy-sauce",     name:"Соевый соус",       emoji:"🥢", status:"forbidden", category:"spice", reason:"соя + глютен" },
  { id: "ketchup",       name:"Кетчуп",            emoji:"🍅", status:"forbidden", category:"spice", reason:"сахар + лектин" },
  { id: "mayonnaise",    name:"Майонез (промышленный)", emoji:"🥫", status:"forbidden", category:"spice", reason:"рафинированные масла" },
  { id: "bbq-sauce",     name:"Барбекю-соус",      emoji:"🥫", status:"forbidden", category:"spice", reason:"сахар" },
  { id: "bouillon-cube", name:"Бульонные кубики",  emoji:"🧊", status:"forbidden", category:"spice", reason:"глутамат + промышленная переработка" },
  { id: "msg-spice",     name:"Готовые приправы (с глутаматом)", emoji:"🧂", status:"forbidden", category:"spice", reason:"глутамат" },
  { id: "chicken-spice", name:"Приправа для курицы (магазинная)", emoji:"🧂", status:"forbidden", category:"spice", reason:"сахар + глутамат" },
  { id: "mustard-prep",  name:"Горчица (готовая)", emoji:"🥫", status:"forbidden", category:"spice", reason:"сахар + добавки" },
  { id: "balsamic",      name:"Бальзамический уксус", emoji:"🧴", status:"forbidden", category:"spice", reason:"сахар" },

  // --- Полуфабрикаты и фастфуд ---
  { id: "kombucha",      name:"Комбуча (промышленная)", emoji:"🍶", status:"forbidden", category:"drink", reason:"сахар + промышленная переработка" },
  { id: "soda",          name:"Газировка (сладкая)", emoji:"🥤", status:"forbidden", category:"drink", reason:"сахар" },
  { id: "juice",         name:"Соки магазинные",   emoji:"🧃", status:"forbidden", category:"drink", reason:"сахар + промышленная переработка" },
  { id: "energy-drink",  name:"Энергетики",        emoji:"🥤", status:"forbidden", category:"drink", reason:"сахар + добавки" },
  { id: "fast-food",     name:"Фастфуд",           emoji:"🍔", status:"forbidden", category:"grain", reason:"промышленная переработка" },
  { id: "ready-meals",   name:"Готовая еда (полуфабрикаты)", emoji:"🍱", status:"forbidden", category:"grain", reason:"промышленная переработка" },
  { id: "chips",         name:"Чипсы",             emoji:"🍟", status:"forbidden", category:"grain", reason:"рафинированные масла + промышленная переработка" },
  { id: "fries",         name:"Картофель фри",     emoji:"🍟", status:"forbidden", category:"carb", reason:"картофель + рафинированное масло" },

  // --- Прочее ---
  { id: "corn",          name:"Кукуруза",          emoji:"🌽", status:"forbidden", category:"grain", reason:"лектин + злак" },
  { id: "popcorn",       name:"Попкорн",           emoji:"🍿", status:"forbidden", category:"grain", reason:"кукуруза — лектин" },
  { id: "watermelon",    name:"Арбуз",             emoji:"🍉", status:"forbidden", category:"fruit", reason:"мелкие семена — лектин" },
  { id: "orange",        name:"Апельсин",          emoji:"🍊", status:"forbidden", category:"fruit", reason:"не входит в список разрешённых тропических" },
  { id: "tangerine",     name:"Мандарин",          emoji:"🍊", status:"forbidden", category:"fruit", reason:"не входит в список разрешённых тропических" },
  { id: "grapefruit",    name:"Грейпфрут",         emoji:"🍊", status:"forbidden", category:"fruit", reason:"не входит в список разрешённых тропических" },
];

export const ALL_FOODS: Food[] = [...ALLOWED, ...FORBIDDEN];

export const ALLOWED_FOODS: Food[] = ALLOWED;
export const FORBIDDEN_FOODS: Food[] = FORBIDDEN;

/* ----------------------------------------------------------------------------
 * ЧЕЛЛЕНДЖ
 * -------------------------------------------------------------------------- */
export const CHALLENGE_DURATION_DAYS = 30;
export const CHALLENGE_START_DATE = "2026-05-08"; // 8 мая 2026

export const MILESTONES: { day: number; title: string; quote: string; emoji: string }[] = [
  { day: 1,  emoji: "🚀", title: "Старт",      quote: "Самый важный день — сегодня. Начало." },
  { day: 3,  emoji: "🔥", title: "3 дня",      quote: "Тело уже перестраивается. Гликоген падает, жир встаёт в очередь." },
  { day: 7,  emoji: "💪", title: "Неделя",     quote: "Первая неделя — это победа. Уже не диета, уже привычка." },
  { day: 14, emoji: "🏆", title: "Полпути",    quote: "Половина позади. Назад дороги нет." },
  { day: 21, emoji: "⚡", title: "21 день",    quote: "Говорят, привычка формируется за 21 день. Сегодня доказано." },
  { day: 30, emoji: "👑", title: "Финал",      quote: "30 дней. Фаза 1 завершена. Ты другой человек." },
];

export const MOTIVATIONAL_QUOTES: string[] = [
  "Ешь только когда голоден. Это твоя сверхспособность.",
  "Голод — не враг. Это сигнал, что система работает.",
  "Один день — одна победа. Не больше, не меньше.",
  "Перекусы не нужны. Тело знает, что делает.",
  "Чёрный кофе. Чистый разум.",
  "Жиры утром, углеводы вечером. Если тревога — больше жиров.",
  "Не считай калории. Считай дни.",
  "Тренировка не каждый день. Восстановление — это часть плана.",
  "Картофель — нет. Батат — да. Тонкая разница, большой эффект.",
  "Лектин коварен. Но ты предупреждён.",
];

/* ----------------------------------------------------------------------------
 * ФАЗЫ ДИЕТЫ
 * -------------------------------------------------------------------------- */
export const PHASES = [
  {
    n: 1,
    name: "ELIMINACIÓN",
    nameRu: "Элиминация",
    days: "1–30",
    description:
      "Убираем триггеры воспаления: сахар, молочку, глютен, лектин, рафинированные масла.",
  },
  {
    n: 2,
    name: "REPARACIÓN",
    nameRu: "Восстановление",
    days: "31–60",
    description: "Восстановление микробиоты. Постепенный возврат продуктов.",
  },
  {
    n: 3,
    name: "LIBERACIÓN",
    nameRu: "Свобода",
    days: "61+",
    description: "Свободный режим с осознанным выбором.",
  },
];
