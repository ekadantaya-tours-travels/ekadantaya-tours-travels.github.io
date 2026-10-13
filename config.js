/* =====================================================================
   EKADANTAYA TOURS & TRAVELS — CENTRAL SITE CONFIGURATION
   ---------------------------------------------------------------------
   Edit ONLY this file to update business details, car specs, packages,
   prices, amenities, destinations, gallery, reviews and FAQs.

   RULES
   • `null` means "not provided yet". Anything null is HIDDEN from
     visitors (or shown as an amber [Add …] hint while setupMode is true).
   • Never enter specs, prices or facilities that are not true.
   • Set `setupMode: false` before going live.
   ===================================================================== */

window.SITE_CONFIG = {
  /* true  = shows amber "[Add …]" hints + SAMPLE fare rates so you can preview.
     false = hides every unfilled field (use this for the live website). */
  setupMode: false,

  /* ------------------------------------------------------------------ */
  brand: {
    name: "Ekadantaya Tours & Travels",
    shortName: "Ekadantaya",
    tagline: "Premium Car Rental & Tour Services",
    ownerName: "Yuvraj G. Khatik",           // proprietor
    address: "Mata Mandir Ward, Hinganghat, Wardha, Maharashtra 442301",
    city: "Hinganghat",
    district: "Wardha",
    state: "Maharashtra",
    serviceAreas: ["Hinganghat", "Wardha", "Nagpur", "Yavatmal", "Chandrapur"],

    phone: "+917709045798",                  // used for click-to-call
    phoneDisplay: "+91 77090 45798",
    whatsapp: "917709045798",                // country code + number, digits only
    email: "contactekadantaya@gmail.com",

    googleBusinessUrl: null,                 // your Google Business Profile link
    googleReviewUrl: null,                   // "Write a review" link from Google
    mapLinkUrl: "https://www.google.com/maps/search/?api=1&query=Hinganghat%2C+Wardha%2C+Maharashtra",
    mapEmbedUrl: null,                       // Google Maps "Embed a map" src URL (optional)

    social: {
      instagram: "https://www.instagram.com/ekadantayatours/",
      instagramHandle: "@ekadantayatours",
      facebook: null,          // paste your Facebook page link, e.g. "https://www.facebook.com/yourpage"
      youtube: null
    }
  },

  /* ------------------------------------------------------------------ */
  hero: {
    // Path to a REAL photo of your car, e.g. "images/car/hero.webp".
    // Transparent-background images look best. Set null to show only the animated road scene.
    carImage: "images/car/kia-carens.webp",
    carImageAlt: "Black Kia Carens MH 32 AX 9717 — Ekadantaya Tours & Travels",
    // TRUE 360° SPIN: take 24–36 photos walking around the car (same height & distance),
    // save as images/car/360/01.webp … 36.webp and list them here in order.
    // While empty, the hero shows an interactive drag-to-rotate view of carImage.
    spinFrames: []
  },

  /* ------------------------------------------------------------------
     VEHICLE SPECIFICATIONS — fill only verified facts.
     `counter: true` animates the number (only used when value is a number).
     ------------------------------------------------------------------ */
  vehicle: {
    makeModel: "Kia Carens",                  // add variant if you like, e.g. "Kia Carens Premium"
    registrationYear: null,                   // e.g. 2026
    showcaseImage: "images/car/kia-carens-800.webp",
    showcaseAlt: "Black Kia Carens, front three-quarter view",
    showcaseIsCutout: true,                   // true for transparent-background images
    maxPassengers: 7,                         // used to validate the booking form
    specs: [
      { label: "Seating Capacity",  icon: "users",     value: "7 + 1" },
      { label: "Fuel Type",         icon: "fuel",      value: "Diesel" },
      { label: "Engine",            icon: "zap",       value: "1.5L CRDi Diesel" },
      { label: "Air Conditioning",  icon: "snowflake", value: "Yes, with rear-row AC vents" },
      { label: "Luggage Space",     icon: "briefcase", value: "Spacious boot for family luggage" },
      { label: "Charging",          icon: "smartphone",value: "USB charging points" },
      { label: "Safety Features",   icon: "shield",    value: "6 airbags, ABS with EBD" },
      { label: "Registration",      icon: "car",       value: "MH 32 AX 9717" },
      { label: "Vehicle Condition", icon: "sparkles",  value: "Brand new" },
      { label: "Service Type",      icon: "userCheck", value: "With experienced driver" }
    ]
  },

  /* ------------------------------------------------------------------
     AMENITIES — set enabled:true ONLY for what you really provide.
     ------------------------------------------------------------------ */
  amenities: [
    { title: "Air-Conditioned Cabin",      icon: "snowflake", enabled: true,  desc: "Stay cool and fresh on every journey, whatever the season." },
    { title: "Comfortable Seating",        icon: "armchair",  enabled: true,  desc: "Relaxed seating designed for long drives and family trips." },
    { title: "Clean & Well-Maintained",    icon: "sparkles",  enabled: true,  desc: "A brand-new car, cleaned and checked before every trip." },
    { title: "Flexible Pickup",            icon: "mapPin",    enabled: true,  desc: "Pickup from your home, hotel, station or any agreed point." },
    { title: "Mobile Charging",            icon: "zap",       enabled: true,  desc: "Charging points to keep your devices powered up." },
    { title: "Spacious Luggage Storage",   icon: "briefcase", enabled: true,  desc: "Room for your bags on holidays and outstation trips." },
    { title: "Music System",               icon: "music",     enabled: true,  desc: "Your favourite playlist for the road." },
    { title: "Bottled Water",              icon: "droplet",   enabled: false, desc: "Complimentary drinking water on board." },
    { title: "Child Seat",                 icon: "baby",      enabled: false, desc: "Child seat available on request." },
    { title: "Experienced Driver",         icon: "userCheck", enabled: true,  desc: "A courteous driver who knows the routes well." }
  ],

  /* ------------------------------------------------------------------
     PRICING RULES used by the Fare Estimator (₹).
     Leave perKm null until you decide your rates — the estimator will then
     ask customers to request a manual quote (in live mode).
     `sample` values are ONLY used for preview while setupMode is true.
     ------------------------------------------------------------------ */
  pricing: {
    currency: "₹",
    perKm: null,                 // round trip / outstation rate per km
    oneWayPerKm: null,           // one-way rate per km (falls back to perKm)
    minKmPerDay: null,           // minimum chargeable km per day (outstation)
    localMinKm: null,            // minimum chargeable km for local trips
    oneWayMinKm: null,           // minimum chargeable km for one-way trips
    driverAllowancePerDay: null, // driver bata per day
    extraHourRate: null,         // per extra hour
    perStopCharge: null,         // per additional stop
    sample: {
      perKm: 12, oneWayPerKm: 14, minKmPerDay: 250, localMinKm: 80, oneWayMinKm: 100,
      driverAllowancePerDay: 300, extraHourRate: 150, perStopCharge: 100
    }
  },

  /* ------------------------------------------------------------------
     TOUR PACKAGES
     startingPrice: number or null (null shows "Get a Quote")
     distance: verified text like "≈ 160 km round trip" or null
     tripType must match a booking-form option:
       "Local" | "One-Way" | "Round Trip" | "Outstation" | "Airport Transfer" | "Customized Tour"
     duration group (for the filter): "Half / Full Day" | "1 Day" | "2–3 Days" | "Multi-Day" | "Flexible"
     ------------------------------------------------------------------ */
  packages: [
    {
      id: "local-city", name: "Local City Tour", category: "Local",
      route: "Hinganghat & nearby city sightseeing", destination: "Hinganghat",
      duration: "4 or 8 hours", durationGroup: "Half / Full Day", tripType: "Local",
      icon: "compass", image: null, distance: null, startingPrice: null,
      description: "Explore temples, markets and local attractions at your own pace with a car at your disposal.",
      includes: ["Pickup & drop at your location", "Stops as per your plan"],
      excludes: ["Parking charges", "Entry tickets"],
      extraCharges: null          // e.g. "₹X per extra hour / ₹Y per extra km"
    },
    {
      id: "family-day", name: "One-Day Family Trip", category: "Day Trip",
      route: "Choose any nearby destination", destination: "Wardha",
      duration: "1 Day", durationGroup: "1 Day", tripType: "Round Trip",
      icon: "heart", image: null, distance: null, startingPrice: null,
      description: "A relaxed day out with the family — temples, picnic spots or a city visit, back home by night.",
      includes: ["Pickup & drop at your location", "Flexible halts for meals & photos"],
      excludes: ["Toll taxes", "Parking charges", "Entry tickets & meals"],
      extraCharges: null
    },
    {
      id: "weekend", name: "Weekend & Nature Tour", category: "Weekend",
      route: "Tadoba, Chikhaldara or a hill / jungle retreat", destination: "Tadoba",
      duration: "2 Days / 1 Night or more", durationGroup: "2–3 Days", tripType: "Outstation",
      icon: "sun", image: null, distance: null, startingPrice: null,
      description: "Escape the routine for a weekend of nature, wildlife or hills — we handle the driving.",
      includes: ["Pickup & drop at your location", "Car stays with you for the trip"],
      excludes: ["Toll taxes", "Parking charges", "Hotel & safari bookings", "Driver night stay (if applicable)"],
      extraCharges: null
    },
    {
      id: "outstation-round", name: "Outstation Round Trip", category: "Outstation",
      route: "Hinganghat ⇄ any city of your choice", destination: "Nagpur",
      duration: "1 Day or more", durationGroup: "Flexible", tripType: "Round Trip",
      icon: "route", image: null, distance: null, startingPrice: null,
      description: "Business meeting, family function or hospital visit — go and come back comfortably.",
      includes: ["Pickup & drop at your location", "Waiting time as agreed"],
      excludes: ["Toll taxes", "Parking charges", "State permit / entry tax (if applicable)"],
      extraCharges: null
    },
    {
      id: "one-way", name: "One-Way Intercity Travel", category: "One-Way",
      route: "Hinganghat → Nagpur, Wardha, Chandrapur, Yavatmal & more", destination: "Nagpur",
      duration: "As per route", durationGroup: "Flexible", tripType: "One-Way",
      icon: "arrowRight", image: null, distance: null, startingPrice: null,
      description: "Pay only for a single journey when you don't need the car to return with you.",
      includes: ["Doorstep pickup", "Drop at your destination address"],
      excludes: ["Toll taxes", "Parking charges"],
      extraCharges: null
    },
    {
      id: "airport-transfer", name: "Airport / Railway Station Transfer", category: "Transfer",
      route: "Nagpur Airport, Nagpur / Wardha / Hinganghat stations", destination: "Nagpur",
      duration: "As per route", durationGroup: "Flexible", tripType: "Airport Transfer",
      icon: "plane", image: null, distance: null, startingPrice: null,
      description: "On-time pickups and drops for your flight or train, with room for your luggage.",
      includes: ["Pickup / drop at terminal or station", "Flight / train timing coordinated"],
      excludes: ["Toll taxes", "Airport / station parking charges"],
      extraCharges: null
    },
    {
      id: "pilgrimage", name: "Pilgrimage Tour", category: "Pilgrimage",
      route: "Shegaon, Pandharpur, Mahur, Ramtek & other holy places", destination: "Shegaon",
      duration: "1–3 Days", durationGroup: "2–3 Days", tripType: "Outstation",
      icon: "landmark", image: null, distance: null, startingPrice: null,
      description: "Peaceful darshan journeys for elders and families, planned around temple timings.",
      includes: ["Pickup & drop at your location", "Halts planned around darshan timings"],
      excludes: ["Toll taxes", "Parking charges", "Accommodation & meals", "Driver night stay (if applicable)"],
      extraCharges: null
    },
    {
      id: "custom-multi", name: "Customized Multi-Day Tour", category: "Custom",
      route: "Your route, your stops, your schedule", destination: "Custom",
      duration: "3+ Days", durationGroup: "Multi-Day", tripType: "Customized Tour",
      icon: "sparkles", image: null, distance: null, startingPrice: null,
      description: "Tell us where you want to go — we'll plan a road trip itinerary that suits your family.",
      includes: ["Itinerary planning help", "Car at your disposal for the tour"],
      excludes: ["Toll taxes", "Parking charges", "Hotels, meals & tickets", "State permit / entry tax (if applicable)"],
      extraCharges: null
    }
  ],

  /* ------------------------------------------------------------------
     SERVICES — cards in the "Our Services" section.
     tripType must be one of the booking-form trip types.
     ------------------------------------------------------------------ */
  services: [
    { title: "Wedding Car for the Groom", subtitle: "दूल्हे की गाड़ी", icon: "heart", tripType: "Local", highlight: true,
      text: "Make a grand entry on your big day. Our brand-new Kia Carens for the groom's arrival, baraat and family pick-ups — clean, punctual and ready on time. Ask us about decoration.",
      tags: ["Groom's entry", "Baraat", "Family transfers"] },
    { title: "Maharashtra Darshan", subtitle: "महाराष्ट्र दर्शन", icon: "compass", tripType: "Customized Tour",
      text: "Multi-day family tours to Maharashtra's most loved places, planned around your pace, comfort and darshan timings.",
      tags: ["Shirdi", "Shani Shingnapur", "Ajanta–Ellora", "Lonavala", "Mahabaleshwar"] },
    { title: "Ujjain Mahakal Darshan", subtitle: "उज्जैन महाकाल", icon: "landmark", tripType: "Outstation",
      text: "A comfortable road trip to Shri Mahakaleshwar Jyotirlinga, with Omkareshwar and Indore on the way if you wish.",
      tags: ["Mahakaleshwar", "Omkareshwar", "Indore"] },
    { title: "Pilgrimage & Jyotirlinga Tours", subtitle: "तीर्थ यात्रा", icon: "sparkles", tripType: "Outstation",
      text: "Peaceful temple journeys for the whole family, with halts planned around aarti and darshan.",
      tags: ["Shegaon", "Pandharpur", "Trimbakeshwar", "Grishneshwar", "Mahur", "Ramtek"] },
    { title: "Nature & Weekend Getaways", subtitle: "वीकेंड ट्रिप", icon: "mountain", tripType: "Outstation",
      text: "Escape to hills, forests and wildlife — we handle the driving while you enjoy the views.",
      tags: ["Tadoba", "Chikhaldara", "Lonar Crater", "Pench", "Bor Tiger Reserve"] },
    { title: "Airport & Railway Transfers", subtitle: "एयरपोर्ट / स्टेशन", icon: "plane", tripType: "Airport Transfer",
      text: "On-time pickups and drops for flights and trains, with space for your luggage.",
      tags: ["Nagpur Airport", "Nagpur Station", "Wardha", "Hinganghat"] },
    { title: "Outstation & One-Way Trips", subtitle: "आउटस्टेशन", icon: "route", tripType: "Round Trip",
      text: "City-to-city travel for business, family visits or medical appointments — round trip or one-way.",
      tags: ["Nagpur", "Chandrapur", "Yavatmal", "Amravati", "Hyderabad"] },
    { title: "Local Trips & Family Functions", subtitle: "लोकल सफ़र", icon: "users", tripType: "Local",
      text: "Hourly car hire for functions, hospital visits, shopping and everyday errands in and around Hinganghat.",
      tags: ["4 / 8 / 12 hours", "Functions", "Hospital visits"] }
  ],

  /* ------------------------------------------------------------------
     POPULAR DESTINATIONS
     ------------------------------------------------------------------ */
  destinations: [
    // Photos: Wikimedia Commons, used under their free licences — keep the credit lines.
    { name: "Nagpur", image: "images/destinations/nagpur-deekshabhoomi.webp", alt: "Deekshabhoomi stupa, Nagpur",
      icon: "landmark", suggested: "1 Day", startingPrice: null, tripType: "Round Trip",
      description: "The Orange City — Deekshabhoomi, Futala Lake, shopping, airport and railway connections.",
      credit: { by: "Prakash Lokhande", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Deekshabhoomi,_Nagpur_in_India.jpg" } },
    { name: "Sevagram", image: "images/destinations/sevagram-bapu-kuti.webp", alt: "Bapu Kuti at Sevagram Ashram",
      icon: "leaf", suggested: "Half Day", startingPrice: null, tripType: "Round Trip",
      description: "Bapu Kuti at Mahatma Gandhi's Sevagram Ashram — a peaceful place of history and reflection.",
      credit: { by: "Subodh Kulkarni", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bapu_Kuti_in_Sevagram_Ashram1-Wardha-Maharashtra.jpg" } },
    { name: "Wardha", image: "images/destinations/wardha-vishwa-shanti-stupa.webp", alt: "Vishwa Shanti Stupa, Wardha",
      icon: "compass", suggested: "Half Day", startingPrice: null, tripType: "Round Trip",
      description: "District headquarters with Gandhian heritage sites, Magan Sangrahalaya and Vishwa Shanti Stupa.",
      credit: { by: "Prasannakamble25", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Front_view_of_Vishwa_Shanti_Stupa,_Wardha.jpg" } },
    { name: "Tadoba", image: "images/destinations/tadoba-tiger.webp", alt: "Bengal tiger at Tadoba Andhari Tiger Reserve",
      icon: "mountain", suggested: "1–2 Days", startingPrice: null, tripType: "Outstation",
      description: "Tadoba-Andhari Tiger Reserve — Maharashtra's famous jungle safari destination.",
      credit: { by: "Rohit Sharma", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Bengal_tiger_at_Tadoba_Andhari_Tiger_Reserve,_Maharashtra,_India.jpg" } },
    { name: "Chandrapur", image: "images/destinations/chandrapur-mahakali-temple.webp", alt: "Mahakali Temple, Chandrapur",
      icon: "landmark", suggested: "1 Day", startingPrice: null, tripType: "Round Trip",
      description: "Mahakali Temple, historic fort walls and the gateway to Tadoba.",
      credit: { by: "Ccmarathe", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Mahakali_temple.JPG" } },
    { name: "Yavatmal", image: "images/destinations/yavatmal-borgaon-dam.webp", alt: "Borgaon Dam, Yavatmal",
      icon: "route", suggested: "1 Day", startingPrice: null, tripType: "Round Trip",
      description: "Borgaon Dam, Kalamb's Chintamani Ganesh temple, family visits and business trips across Yavatmal district.",
      credit: { by: "Nitin Bhagwate", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Borgaon_dam_,_yavatmal_-_panoramio.jpg" } }
  ],

  /* ------------------------------------------------------------------
     GALLERY — replace `src: null` with real photos, e.g. "images/car/front.webp"
     ------------------------------------------------------------------ */
  gallery: [
    { src: "images/car/kia-carens-800.webp", cutout: true, label: "Exterior – Front View", alt: "Black Kia Carens, front three-quarter view" },
    { src: null, label: "Exterior – Rear View",    alt: "Rear view of our car" },
    { src: null, label: "Side Profile",            alt: "Side profile of our car" },
    { src: null, label: "Interior Seating",        alt: "Interior seating of our car" },
    { src: null, label: "Dashboard",               alt: "Dashboard of our car" },
    { src: null, label: "Boot Space",              alt: "Boot space of our car" },
    { src: null, label: "On the Open Road",        alt: "Our car on a scenic road" },
    { src: null, label: "Travel Moments",          alt: "Travel and destination photograph" }
  ],

  /* ------------------------------------------------------------------
     REVIEWS — genuine customer reviews shown in the swiper.
     New reviews submitted through the website arrive on your WhatsApp;
     add them here to publish. Optional fields: rating (1–5), trip, place.
     ------------------------------------------------------------------ */
  reviews: [
    { name: "Akshay K.",  approved: true,
      text: "Had a good experience with Ekadantaya Tours & Travels. The car was clean, the journey was comfortable, and the service was professional. Highly recommended!" },
    { name: "Ganesh M.",  approved: true,
      text: "Excellent travel service! The driver was polite, punctual, and helpful. A comfortable and hassle-free travel experience." },
    { name: "Ram D.",     approved: true,
      text: "Very good service for family trips and outstation travel. The vehicle was well-maintained, and the overall experience was smooth and enjoyable." },
    { name: "Akash G.",   approved: true,
      text: "Reliable and professional travel service. Booking was easy, communication was clear, and the journey was comfortable." },
    { name: "Saurabh S.", approved: true,
      text: "Great experience with Ekadantaya Tours & Travels. Good customer service, a comfortable car, and a smooth journey. Would definitely recommend them." },
    { name: "Mona",       approved: true,
      text: "Had a pleasant experience travelling with Ekadantaya Tours & Travels. The service was friendly, and the journey was comfortable and convenient." },
    { name: "Srusthi",    approved: true,
      text: "Wonderful travel experience! The service was good, the vehicle was clean, and the journey was relaxing. A great choice for comfortable travel." }
  ],

  /* ------------------------------------------------------------------
     FAQ — English (q/a), Marathi (mr) and Hindi (hi). Edit answers to
     match your real policies; keep all three languages in sync.
     ------------------------------------------------------------------ */
  faqTitle: {
    en: ["Frequently asked", "questions"],
    mr: ["नेहमी विचारले जाणारे", "प्रश्न"],
    hi: ["अक्सर पूछे जाने वाले", "प्रश्न"]
  },
  faqs: [
    { q: "How can I book the car?",
      a: "Fill in the booking form on this page, tap “Book on WhatsApp”, or call us directly. We will confirm availability, route and fare with you before the trip.",
      mr: { q: "गाडी कशी बुक करायची?", a: "या पेजवरील बुकिंग फॉर्म भरा, “Book on WhatsApp” बटणावर टॅप करा किंवा आम्हाला थेट कॉल करा. प्रवासापूर्वी आम्ही उपलब्धता, मार्ग आणि भाडे तुमच्याशी निश्चित करू." },
      hi: { q: "कार कैसे बुक करें?", a: "इस पेज पर बुकिंग फ़ॉर्म भरें, “Book on WhatsApp” बटन दबाएँ या हमें सीधे कॉल करें। यात्रा से पहले हम उपलब्धता, रूट और किराया आपके साथ तय करेंगे।" } },
    { q: "Are local and outstation trips available?",
      a: "Yes. We handle local city trips as well as outstation journeys from Hinganghat to destinations across Wardha, Nagpur, Yavatmal, Chandrapur and beyond.",
      mr: { q: "लोकल आणि बाहेरगावचे प्रवास उपलब्ध आहेत का?", a: "हो. आम्ही शहरातील लोकल प्रवास तसेच हिंगणघाटहून वर्धा, नागपूर, यवतमाळ, चंद्रपूर आणि त्यापलीकडील ठिकाणी बाहेरगावचे प्रवास करतो." },
      hi: { q: "क्या लोकल और आउटस्टेशन यात्राएँ उपलब्ध हैं?", a: "हाँ। हम शहर में लोकल यात्रा के साथ-साथ हिंगणघाट से वर्धा, नागपुर, यवतमाल, चंद्रपुर और उससे आगे की आउटस्टेशन यात्राएँ भी करते हैं।" } },
    { q: "Can I book a one-way trip?",
      a: "Yes, one-way intercity drops can be arranged. Share your pickup and drop locations and we will give you a quote.",
      mr: { q: "एकेरी (वन-वे) प्रवास बुक करता येतो का?", a: "हो, एका शहरातून दुसऱ्या शहरात एकेरी ड्रॉपची सोय होऊ शकते. तुमचे पिकअप आणि ड्रॉपचे ठिकाण सांगा, आम्ही तुम्हाला भाडे कळवू." },
      hi: { q: "क्या वन-वे यात्रा बुक की जा सकती है?", a: "हाँ, एक शहर से दूसरे शहर के लिए वन-वे ड्रॉप की व्यवस्था हो सकती है। अपनी पिकअप और ड्रॉप लोकेशन बताएँ, हम आपको किराया बताएँगे।" } },
    { q: "How is the final fare calculated?",
      a: "The fare depends on the actual route and distance, number of days, waiting time, driver allowance (if applicable) and any extra stops. Your final quote is confirmed by us before booking.",
      mr: { q: "अंतिम भाडे कसे ठरते?", a: "भाडे प्रत्यक्ष मार्ग व अंतर, दिवसांची संख्या, थांबण्याचा वेळ, ड्रायव्हर भत्ता (लागू असल्यास) आणि अतिरिक्त थांबे यावर अवलंबून असते. बुकिंगपूर्वी आम्ही अंतिम भाडे निश्चित करून सांगतो." },
      hi: { q: "अंतिम किराया कैसे तय होता है?", a: "किराया वास्तविक रूट और दूरी, दिनों की संख्या, इंतज़ार का समय, ड्राइवर भत्ता (यदि लागू हो) और अतिरिक्त स्टॉप पर निर्भर करता है। बुकिंग से पहले हम अंतिम किराया तय करके बताते हैं।" } },
    { q: "Are tolls and parking included?",
      a: "Unless your quote specifically says otherwise, toll taxes and parking charges are paid separately as actuals.",
      mr: { q: "टोल आणि पार्किंग भाड्यात समाविष्ट आहे का?", a: "तुमच्या कोटेशनमध्ये वेगळे नमूद केले नसल्यास, टोल टॅक्स आणि पार्किंग शुल्क प्रत्यक्ष खर्चानुसार वेगळे द्यावे लागते." },
      hi: { q: "क्या टोल और पार्किंग किराए में शामिल हैं?", a: "जब तक आपके कोटेशन में अलग से न लिखा हो, टोल टैक्स और पार्किंग शुल्क वास्तविक खर्च के अनुसार अलग से देने होते हैं।" } },
    { q: "Can I customize my tour?",
      a: "Absolutely. Tell us the places you want to visit, your dates and preferences, and we will help you plan the route.",
      mr: { q: "टूर माझ्या पद्धतीने ठरवता येईल का?", a: "नक्कीच. तुम्हाला भेट द्यायची ठिकाणे, तारखा आणि आवडी सांगा, आम्ही मार्ग ठरवण्यात मदत करू." },
      hi: { q: "क्या टूर अपने हिसाब से बनाई जा सकती है?", a: "बिल्कुल। आप जिन जगहों पर जाना चाहते हैं, अपनी तारीखें और पसंद बताएँ, हम रूट प्लान करने में मदद करेंगे।" } },
    { q: "How much luggage can the car carry?",
      a: "Luggage space depends on the number of passengers. Please mention your bags in the booking form and we will confirm whether everything fits comfortably.",
      mr: { q: "गाडीत किती सामान बसते?", a: "सामानाची जागा प्रवाशांच्या संख्येवर अवलंबून असते. बुकिंग फॉर्ममध्ये तुमच्या बॅगांची माहिती द्या, सर्व सामान आरामात बसेल का हे आम्ही कळवू." },
      hi: { q: "कार में कितना सामान आ सकता है?", a: "सामान की जगह यात्रियों की संख्या पर निर्भर करती है। बुकिंग फ़ॉर्म में अपने बैग की जानकारी दें, हम बताएँगे कि सारा सामान आराम से आएगा या नहीं।" } },
    { q: "What is the cancellation policy?",
      a: "Cancellation terms are shared and agreed at the time of booking. Please contact us on WhatsApp or phone for the current terms.",
      mr: { q: "बुकिंग रद्द करण्याचे (कॅन्सलेशन) नियम काय आहेत?", a: "कॅन्सलेशनच्या अटी बुकिंगच्या वेळी सांगितल्या व ठरवल्या जातात. सध्याच्या अटींसाठी कृपया WhatsApp किंवा फोनवर संपर्क साधा." },
      hi: { q: "कैंसलेशन पॉलिसी क्या है?", a: "कैंसलेशन की शर्तें बुकिंग के समय बताई और तय की जाती हैं। मौजूदा शर्तों के लिए कृपया WhatsApp या फ़ोन पर संपर्क करें।" } },
    { q: "Is advance payment required?",
      a: "Advance requirements, if any, depend on the trip and are communicated clearly when we confirm your booking.",
      mr: { q: "आगाऊ रक्कम (ॲडव्हान्स) द्यावी लागते का?", a: "ॲडव्हान्सची गरज असल्यास ती प्रवासावर अवलंबून असते आणि बुकिंग निश्चित करताना स्पष्टपणे सांगितली जाते." },
      hi: { q: "क्या एडवांस पेमेंट देना ज़रूरी है?", a: "एडवांस की ज़रूरत, यदि हो, यात्रा पर निर्भर करती है और बुकिंग कन्फ़र्म करते समय साफ़-साफ़ बताई जाती है।" } },
    { q: "Can I book for multiple days?",
      a: "Yes. Multi-day tours and outstation trips can be booked — select “Outstation” or “Customized Tour” in the booking form and add your return date.",
      mr: { q: "अनेक दिवसांसाठी बुकिंग करता येते का?", a: "हो. अनेक दिवसांच्या टूर आणि बाहेरगावचे प्रवास बुक करता येतात — बुकिंग फॉर्ममध्ये “Outstation” किंवा “Customized Tour” निवडा आणि परतीची तारीख टाका." },
      hi: { q: "क्या कई दिनों के लिए बुकिंग हो सकती है?", a: "हाँ। कई दिनों की टूर और आउटस्टेशन यात्राएँ बुक की जा सकती हैं — बुकिंग फ़ॉर्म में “Outstation” या “Customized Tour” चुनें और वापसी की तारीख डालें।" } }
  ],

  /* ------------------------------------------------------------------
     LEGAL TEXT (shown in pop-ups from the footer) — review before launch.
     ------------------------------------------------------------------ */
  legal: {
    privacy: [
      "We collect only the details you choose to share with us — such as your name, mobile number, travel dates and trip requirements — for the purpose of responding to your enquiry and arranging your trip.",
      "When you submit a form on this website, your details are emailed to us using the FormSubmit service, and booking enquiries and reviews are also opened in WhatsApp so you can send them to us directly.",
      "We do not sell or rent your personal information. We may use your number to contact you about your enquiry or booking.",
      "If analytics is enabled, it runs only after you accept cookies. You can ask us to delete your information at any time by contacting us."
    ],
    terms: [
      "Submitting a form on this website is an enquiry only. A booking is confirmed only when we confirm it with you by phone or WhatsApp.",
      "Prices shown on this website are approximate. The final fare is agreed before the trip and may vary with actual route, distance, time and additional requirements.",
      "Toll taxes, parking, state permits/entry taxes and other charges are payable as per the agreed quote.",
      "Passengers are expected to follow traffic laws and vehicle rules, and must not carry illegal or hazardous items.",
      "We are not responsible for delays caused by traffic, weather, road conditions or other circumstances beyond our control."
    ],
    cancellation: [
      "Cancellation and refund terms are shared and agreed at the time of booking confirmation.",
      "Please inform us as early as possible if your plans change so we can reschedule or cancel your trip.",
      "For the current cancellation terms, contact us on WhatsApp or call us."
    ]
  },

  /* ------------------------------------------------------------------
     ANALYTICS — paste your GA4 Measurement ID (e.g. "G-XXXXXXX").
     It loads only after the visitor accepts the cookie notice.
     ------------------------------------------------------------------ */
  forms: {
    // Every booking enquiry, contact message and review is emailed to you.
    //
    // OPTION A (recommended, instant): Web3Forms — free, 250 emails/month.
    //   1. Go to https://web3forms.com, enter contactekadantaya@gmail.com,
    //      click "Create Access Key" and copy the key from the email you get.
    //   2. Paste it below, e.g. web3formsKey: "a1b2c3d4-....". Done.
    //   (This key is designed to be public — it only lets people send TO you.)
    web3formsKey: "e48e0d46-e84e-45e1-a442-7ccc240512a0",
    //
    // OPTION B (used while web3formsKey is null): FormSubmit — free, no signup.
    //   Submit any form once, then click "Activate Form" in the email
    //   FormSubmit sends to this inbox. After that, emails arrive automatically.
    emailEndpoint: "https://formsubmit.co/ajax/contactekadantaya@gmail.com"
  },

  /* ------------------------------------------------------------------ */
  analytics: {
    gaMeasurementId: null
  }
};
