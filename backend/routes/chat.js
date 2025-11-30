// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ChatHistory = require('../models/chatHistory');

const plantKnowledge = {
  watering: {
    keywords: ['water', 'watering', 'overwater', 'underwater', 'dry', 'wet', 'soil', 'moist', 'soggy', 'drought', 'drench'],
    responses: [
      "The 'finger test' is reliable: stick your finger 1-2 inches into soil. If dry, water thoroughly until water drains from bottom holes. Most plants prefer this over frequent light watering! 💧",
      "Different plants have different needs: Succulents prefer 'soak and dry' (water deeply, then let soil dry completely). Ferns like consistently moist soil. Pothos are forgiving - water when top inch is dry. 🌵",
      "Overwatering kills more plants than underwatering! Signs: yellowing leaves, musty smell, fungus gnats, soft/brown stems. If this happens, let soil dry out completely before watering again. 🚫💦",
      "Water quality matters! Tap water can contain chlorine and fluoride that sensitive plants (like calatheas) don't like. Let tap water sit 24hrs before using, or use filtered/rainwater. 💧✨",
      "Bottom watering prevents overwatering and encourages strong roots: place pot in water tray for 20-30 minutes, let plant absorb what it needs, then remove. Great for African violets! 🪴"
    ]
  },
  lighting: {
    keywords: ['light', 'lighting', 'sun', 'bright', 'dark', 'window', 'shade', 'indirect', 'direct', 'grow light', 'shadow', 'sunny'],
    responses: [
      "Light categories explained: Direct (6+ hours sun, like cacti), Bright Indirect (bright room but no direct rays, most houseplants), Medium (morning/evening sun, pothos), Low (north windows, snake plants). 🌞",
      "Signs of too little light: leggy/stretched growth, small new leaves, pale color, plant leaning toward light, slow growth, lower leaves dropping. Solution: move closer to window or add grow light! 📉",
      "Signs of too much light: scorched brown spots on leaves, fading colors, crispy leaf edges, wilting despite moist soil. Solution: move away from window or add sheer curtain! ☀️🔥",
      "South-facing windows get the most intense light (best for cacti, succulents). East windows get gentle morning sun (perfect for most plants). West gets hot afternoon sun. North gets the least light. 🧭",
      "Grow lights work great! Use full-spectrum LED lights 12-18 inches above plants for 12-16 hours daily. They're especially helpful in winter when days are short. Look for 2000-3000 lumens minimum. 💡"
    ]
  },
  problems: {
    keywords: ['yellow', 'brown', 'dying', 'droopy', 'wilting', 'spots', 'disease', 'sick', 'unhealthy', 'crispy', 'curling', 'dropping', 'falling'],
    responses: [
      "Yellow leaves can mean: overwatering (most common - check if soil is soggy), underwatering (soil bone dry?), natural aging (bottom leaves only), nutrient deficiency (feed monthly), or root rot (smells bad?). 🟡",
      "Brown leaf tips usually indicate: low humidity (mist or use humidifier), fluoride/chlorine in water (use filtered), over-fertilizing (flush soil with water), or inconsistent watering (stick to schedule). 🟤",
      "Droopy/wilting leaves: First, check soil! If wet = overwatering or root rot. If dry = underwatering. Could also be temperature shock from cold drafts or sudden temp changes. 🥀",
      "Black or brown spots often mean fungal/bacterial disease from: overwatering, poor air circulation, water sitting on leaves, or cold temps. Remove affected leaves, improve airflow, water soil only. 🦠",
      "Curling leaves indicate: underwatering (edges curl up), low humidity (prayer plants especially), heat stress (move away from heat vents), or pest damage (check undersides for bugs). 🌀"
    ]
  },
  pests: {
    keywords: ['pest', 'bug', 'insect', 'aphid', 'spider mite', 'scale', 'mealybug', 'thrip', 'fungus gnat', 'white', 'flies', 'crawling'],
    responses: [
      "Spider mites create tiny webs and stippled/speckled leaves. Solution: spray plant with water in shower, increase humidity, use insecticidal soap or neem oil spray weekly until gone. 🕷️",
      "Aphids are small green/black insects clustering on new growth. Solution: blast off with water spray, release ladybugs (natural predators), or use neem oil. They multiply fast so act quickly! 🐛",
      "Mealybugs look like white cotton on stems/leaves. Solution: dab each bug with rubbing alcohol on cotton swab, spray with insecticidal soap, check weekly as eggs can hatch later. 🦟",
      "Scale insects appear as brown/tan bumps stuck to stems/leaves. They're hard to remove! Solution: scrape off with fingernail, use rubbing alcohol, or apply systemic insecticide for bad infestations. 🪲",
      "Fungus gnats are tiny flies around soil (larvae eat roots). Solution: let soil dry out between waterings, use yellow sticky traps, add sand layer on soil surface, or beneficial nematodes. 🪰"
    ]
  },
  humidity: {
    keywords: ['humidity', 'humid', 'mist', 'misting', 'dry air', 'moisture'],
    responses: [
      "Increase humidity easily: group plants together (they create micro-climate), place on pebble tray with water (pot sits above water), run humidifier (best for tropical plants), or keep in bathroom! 💦",
      "Most houseplants prefer 40-60% humidity. Tropical plants (calatheas, ferns, orchids) want 60%+. Succulents and cacti are fine with lower humidity. You can buy a hygrometer to measure it! 📊",
      "Misting provides only temporary humidity boost (minutes). It's better for cleaning leaves! For real humidity increase, use humidifier or pebble trays. Don't mist fuzzy-leaved plants (causes rot). 💨",
      "Signs of low humidity: brown crispy leaf tips/edges, leaves curling, slow growth, buds dropping before opening. Common in winter when heating dries indoor air! 🍂"
    ]
  },
  specific_plants: {
    keywords: ['pothos', 'monstera', 'fiddle leaf fig', 'snake plant', 'spider plant', 'rubber plant', 'peace lily', 'philodendron', 'zz plant', 'aloe', 'succulent', 'cactus', 'fern', 'calathea'],
    responses: [
      "Pothos (Devil's Ivy): Super easy! Tolerates low light (but grows faster in bright indirect), water when top inch dry, propagates easily in water. Toxic to pets. Golden pothos is most common variety. 🌿",
      "Monstera Deliciosa: Loves bright indirect light (develops more splits/fenestrations), needs moss pole for climbing, likes humidity 60%+, water when top 2 inches dry. Wipe large leaves monthly! 🌱",
      "Snake Plant (Sansevieria): Nearly indestructible! Tolerates low to bright light, drought-tolerant (water every 2-3 weeks), excellent air purifier. Can survive weeks of neglect - perfect for beginners! 🐍",
      "Spider Plant: Easy care, bright indirect light, keep soil evenly moist (not soggy), produces baby plantlets you can propagate, removes toxins from air. Brown tips mean fluoride in tap water. 🕷️",
      "ZZ Plant: Very low maintenance! Tolerates low light, extremely drought-tolerant (water monthly), glossy leaves stay shiny. Perfect for offices or dark corners. Rhizomes store water underground. ✨",
      "Fiddle Leaf Fig: Needs bright indirect light, consistent watering (top 2 inches dry), wipe leaves weekly, hates being moved. Dramatic but worth it! Rotate quarterly for even growth. 🎻",
      "Peace Lily: Tolerates low light, droops dramatically when thirsty (bounces back after watering!), beautiful white flowers, removes air toxins. Prefers filtered water. Toxic to pets. 🕊️",
      "Succulents: Need bright light (6+ hours), well-draining soil (add perlite/sand), water deeply but infrequently (wait until soil completely dry), sensitive to overwatering. 🌵",
      "Ferns: Love humidity (60%+), bright indirect light, keep soil consistently moist (not soggy), mist regularly or use humidifier. Boston ferns are popular but high-maintenance! 🌿"
    ]
  },
  repotting: {
    keywords: ['repot', 'pot', 'container', 'transplant', 'root bound', 'roots'],
    responses: [
      "Repot when: roots grow out drainage holes, water runs straight through (soil depleted), growth slows, or plant becomes top-heavy. Spring is best time - plants are actively growing! 🪴",
      "Choose pot only 1-2 inches larger in diameter. Too-large pots hold excess water causing root rot. Always use pot with drainage holes! Terracotta breathes better than plastic. 🏺",
      "Repotting steps: water day before, gently remove plant, loosen roots, remove old soil, place in new pot with fresh soil, water thoroughly, keep in shade for few days to recover. 📋",
      "Use appropriate soil: cacti/succulents need well-draining (add sand/perlite), tropical plants like moisture-retaining (add peat/coco coir), most houseplants do well with standard potting mix. 🌱"
    ]
  },
  fertilizer: {
    keywords: ['fertilizer', 'fertilize', 'feed', 'nutrients', 'food', 'nitrogen'],
    responses: [
      "Fertilize during growing season (spring/summer) monthly with balanced liquid fertilizer diluted to half-strength. Don't fertilize in winter - plants rest and can't use nutrients! 🌱",
      "Signs of nutrient deficiency: pale/yellow leaves, slow growth, small leaves, weak stems. Signs of over-fertilizing: brown crispy tips, white crust on soil, burnt roots. Less is more! ⚗️",
      "Use balanced fertilizer (like 10-10-10 or 20-20-20). Blooming plants need higher phosphorus (middle number). Always water before fertilizing to prevent root burn! 💊",
      "Organic options: compost tea, worm castings, fish emulsion (stinks but works!), or slow-release pellets. These are gentler and improve soil health over time. 🌿"
    ]
  },
  fertilizer: {
    keywords: ['benefits', 'advantage', 'uses', 'applications'],
    responses: [
      "we get lot of benefits by planting green plant at our home"
      
    ]
  },
  propagation: {
    keywords: ['propagate', 'propagation', 'cutting', 'grow new', 'multiply', 'babies'],
    responses: [
      "Easy plants to propagate: pothos, philodendron, spider plant, snake plant, succulents. Take 4-6 inch stem cutting below node, remove lower leaves, place in water or soil. Roots in 2-4 weeks! ✂️",
      "Water propagation: use clear glass to monitor roots, change water weekly (prevents rot), wait for roots 2+ inches long before planting. Rooting hormone helps but isn't necessary. 💧",
      "Spider plant babies: let plantlets develop small roots while still attached, then cut and plant in soil. Or cut and root in water first. Each plant produces dozens of babies! 👶",
      "Succulent propagation: gently twist off healthy leaf, let callus over for 2-3 days, place on top of soil (don't bury), mist occasionally. Tiny plant grows from base in few weeks! 🌵"
    ]
  }
};

const getBotResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Greeting
  if (message.match(/\b(hi|hello|hey|howdy|greetings)\b/)) {
    return "Hello! I'm your Plant Care Assistant. I can help you with watering, lighting, pest problems, plant diseases, humidity, repotting, fertilizing, and care for specific plants. What's on your mind today? 🌱";
  }

  // Thank you
  if (message.match(/\b(thank|thanks|thx|appreciate)\b/)) {
    return "You're very welcome! Happy to help your plants thrive! Feel free to ask more questions anytime. Remember: healthy plants = happy plants! 🌿✨";
  }

  // Search knowledge base
  let foundResponses = [];
  
  for (const [category, data] of Object.entries(plantKnowledge)) {
    if (data.keywords.some(keyword => message.includes(keyword))) {
      foundResponses.push(...data.responses);
    }
  }

  if (foundResponses.length > 0) {
    const randomResponse = foundResponses[Math.floor(Math.random() * foundResponses.length)];
    return randomResponse;
  }

  // General fallback
  return "I'd love to help! 🌿 I can answer questions about: watering schedules, lighting requirements, common problems (yellow/brown leaves), pest control, humidity, repotting, fertilizing, and specific plants like pothos, monstera, snake plants, and more. What would you like to know?";
};

// Send message endpoint
router.post('/send', auth, async (req, res) => {
  try {
    const { message } = req.body;

    console.log('🌱 Processing message:', message);

    const botResponse = getBotResponse(message);

    let chatHistory = await ChatHistory.findOne({ userId: req.user._id });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId: req.user._id,
        messages: []
      });
    }

    chatHistory.messages.push(
      { text: message, sender: 'user', timestamp: new Date() },
      { text: botResponse, sender: 'bot', timestamp: new Date() }
    );

    await chatHistory.save();

    console.log('Response sent successfully');

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      message: 'Error processing chat', 
      error: error.message 
    });
  }
});

module.exports = router;