// ============================================================
// 💕 CUSTOMIZE YOUR DATE PICKER HERE!
// Edit her name, your name, WhatsApp number, or any options.
// ============================================================

window.DATE_CONFIG = {
  // Her name or nickname (shown on the welcome screen & ticket)
  girlfriendName: "Dodo",

  // Your name (shown on the date ticket)
  yourName: "Me",

  // Optional: Your WhatsApp number with country code, digits only (no +, spaces, or dashes)
  // Example: "201012345678" or "15551234567"
  // Leave empty "" and WhatsApp will simply let her pick your chat!
  whatsappNumber: "",

  // Cute messages that cycle when she tries to click "No"
  noButtonMessages: [
    "No",
    "Are you sure? 🥺",
    "Really sure?!",
    "Think again! 🍓",
    "Pretty please? 💕",
    "Don't break my heart 💔",
    "You meant Yes, right?",
    "Nice try! 😜",
    "Can't catch me! ✨",
    "Just click Yes! 🎀"
  ],

  // Food options
  foods: [
    { id: "sushi", label: "Sushi Date", emoji: "🍣", tag: "Fresh & cute" },
    { id: "pasta", label: "Pasta & Italian", emoji: "🍝", tag: "Cozy romantic" },
    { id: "pizza", label: "Pizza Night", emoji: "🍕", tag: "Cheesy & fun" },
    { id: "burgers", label: "Burgers & Fries", emoji: "🍔", tag: "Classic fave" },
    { id: "tacos", label: "Tacos & Nachos", emoji: "🌮", tag: "Spicy & yummy" },
    { id: "ramen", label: "Ramen / Asian", emoji: "🍜", tag: "Warm & cozy" },
    { id: "brunch", label: "Cafe Brunch", emoji: "🥐", tag: "Aesthetic vibe" },
    { id: "surprise-food", label: "Surprise Me!", emoji: "✨", tag: "Dealer's choice" }
  ],

  // Dessert & Drinks options
  desserts: [
    { id: "boba", label: "Boba Tea", emoji: "🧋", tag: "Sweet & chewy" },
    { id: "icecream", label: "Ice Cream / Gelato", emoji: "🍨", tag: "Always a yes" },
    { id: "matcha", label: "Matcha & Pastries", emoji: "🍵", tag: "Cute cafe" },
    { id: "cake", label: "Cheesecake / Cake", emoji: "🍰", tag: "Sweet tooth" },
    { id: "waffles", label: "Waffles / Crepes", emoji: "🧇", tag: "Warm & gooey" },
    { id: "coffee", label: "Iced Coffee", emoji: "☕", tag: "Cozy chat" },
    { id: "chocolate", label: "Chocolate / Churros", emoji: "🍫", tag: "Extra sweet" },
    { id: "surprise-dessert", label: "Surprise Me!", emoji: "🍓", tag: "You pick!" }
  ],

  // Activity options
  activities: [
    { id: "padel", label: "Padel", emoji: "🎾", tag: "Fun match!" },
    { id: "walk", label: "Walking", emoji: "🚶‍♀️", tag: "Cute stroll & chat" },
    { id: "movie", label: "Movie Night", emoji: "🎬", tag: "Popcorn & cuddles" },
    { id: "arcade", label: "Arcade & Games", emoji: "🕹️", tag: "Playful vibes" },
    { id: "picnic", label: "Sunset Picnic", emoji: "🌸", tag: "Golden hour" },
    { id: "bowling", label: "Bowling", emoji: "🎳", tag: "Friendly rivalry" },
    { id: "shopping", label: "Shopping & Stroll", emoji: "🛍️", tag: "Window shopping" },
    { id: "art", label: "Painting / Pottery", emoji: "🎨", tag: "Creative date" },
    { id: "drive", label: "Late Night Drive", emoji: "🌙", tag: "Music & stars" },
    { id: "surprise-activity", label: "Surprise Me!", emoji: "✨", tag: "You pick!" }
  ],

  // Time slots
  timeSlots: [
    { id: "morning", label: "Morning Date", time: "10:30 AM", emoji: "☀️" },
    { id: "lunch", label: "Lunch Time", time: "1:30 PM", emoji: "🌤️" },
    { id: "sunset", label: "Golden Hour", time: "5:00 PM", emoji: "🌅" },
    { id: "dinner", label: "Dinner Night", time: "7:30 PM", emoji: "🌙" }
  ]
};
