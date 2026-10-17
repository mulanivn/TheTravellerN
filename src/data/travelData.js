/**
 * The Traveller — Core Travel Data & Helper Utilities
 */

export const packages = [
  {
    id: 'kerala-backwaters',
    name: 'Kerala Backwaters & Hills',
    destination: 'Kerala, India',
    category: 'domestic',
    theme: 'family',
    days: 6,
    duration: 'medium',
    price: 42900,
    image: 'package-1.jpg',
    tag: 'Family favourite',
    summary: 'Tea-country mornings, wildlife edges, and a relaxed houseboat finale through Kerala.',
    itinerary: [
      'Arrive Kochi and explore Fort Kochi',
      'Drive to Munnar and tea-country viewpoints',
      'Munnar nature day and local experiences',
      'Thekkady wildlife and spice-country visit',
      'Alleppey houseboat cruise',
      'Departure transfer from Kochi'
    ]
  },
  {
    id: 'bali-slow-escape',
    name: 'Bali Slow Escape',
    destination: 'Bali, Indonesia',
    category: 'international',
    theme: 'honeymoon',
    days: 7,
    duration: 'medium',
    price: 68900,
    image: 'package-2.jpg',
    tag: 'Couples',
    summary: 'A balanced Bali itinerary pairing Ubud culture and rice terraces with a calm coastal stay.',
    itinerary: [
      'Arrival and private transfer to Ubud',
      'Temples, rice terraces and waterfall loop',
      'Free day for spa or café hopping',
      'Transfer to south Bali',
      'Clifftop temple and sunset experience',
      'Beach leisure day',
      'Departure transfer'
    ]
  },
  {
    id: 'himalayan-trails',
    name: 'Himalayan Trails',
    destination: 'Himachal Pradesh, India',
    category: 'group',
    theme: 'adventure',
    days: 8,
    duration: 'medium',
    price: 35900,
    image: 'package-3.jpg',
    tag: 'Small group',
    summary: 'Mountain roads, pine forests, scenic hikes, and social evenings in a guided small-group format.',
    itinerary: [
      'Meet the group in Chandigarh',
      'Drive to Manali',
      'Acclimatisation walk and old-town visit',
      'Solang Valley activity day',
      'Scenic mountain excursion',
      'Local village hike',
      'Leisure and café evening',
      'Return transfer'
    ]
  },
  {
    id: 'rajasthan-royal',
    name: 'Rajasthan Royal Circuit',
    destination: 'Rajasthan, India',
    category: 'domestic',
    theme: 'senior',
    days: 9,
    duration: 'long',
    price: 54900,
    image: 'package-4.jpg',
    tag: 'Comfort pace',
    summary: 'A measured cultural circuit through forts, palaces and lakes with comfortable travel days.',
    itinerary: [
      'Arrive Jaipur',
      'Jaipur forts and old city',
      'Drive to Pushkar',
      'Continue to Jodhpur',
      'Mehrangarh and blue city',
      'Drive to Udaipur',
      'Udaipur lakes and palace',
      'Leisure day',
      'Departure'
    ]
  },
  {
    id: 'dubai-city-desert',
    name: 'Dubai City & Desert',
    destination: 'Dubai, UAE',
    category: 'international',
    theme: 'family',
    days: 5,
    duration: 'medium',
    price: 62900,
    image: 'package-5.jpg',
    tag: 'Easy getaway',
    summary: 'Modern city highlights, a desert evening and plenty of flexible family time.',
    itinerary: [
      'Arrival and marina evening',
      'City highlights tour',
      'Desert safari experience',
      'Free day for theme parks or shopping',
      'Departure transfer'
    ]
  },
  {
    id: 'goa-weekend',
    name: 'Goa Coastal Weekend',
    destination: 'Goa, India',
    category: 'domestic',
    theme: 'honeymoon',
    days: 4,
    duration: 'short',
    price: 24900,
    image: 'package-6.jpg',
    tag: 'Short break',
    summary: 'A compact beach break with relaxed mornings, heritage corners, and sunset time.',
    itinerary: [
      'Arrival and beach sunset',
      'North Goa highlights',
      'Old Goa and Panjim',
      'Departure'
    ]
  },
  {
    id: 'vietnam-discovery',
    name: 'Vietnam Discovery',
    destination: 'Vietnam',
    category: 'international',
    theme: 'adventure',
    days: 10,
    duration: 'long',
    price: 89900,
    image: 'package-7.jpg',
    tag: 'Explorer',
    summary: 'A north-to-central journey combining city energy, limestone scenery, and heritage streets.',
    itinerary: [
      'Arrive Hanoi',
      'Hanoi city discovery',
      'Ninh Binh landscapes',
      'Ha Long Bay cruise',
      'Fly to Da Nang',
      'Hoi An heritage day',
      'Countryside cycling',
      'Ba Na Hills option',
      'Leisure day',
      'Departure'
    ]
  },
  {
    id: 'sikkim-serenity',
    name: 'Sikkim Serenity',
    destination: 'Sikkim, India',
    category: 'group',
    theme: 'senior',
    days: 7,
    duration: 'medium',
    price: 39900,
    image: 'package-8.jpg',
    tag: 'Scenic group',
    summary: 'A gentle group itinerary through mountain towns, monasteries and panoramic viewpoints.',
    itinerary: [
      'Arrive Gangtok',
      'Gangtok local sights',
      'Tsomgo Lake excursion',
      'Transfer to Pelling',
      'Monasteries and viewpoints',
      'Leisure morning',
      'Departure transfer'
    ]
  }
];

export const destinations = [
  {
    name: 'Kerala',
    copy: 'Backwaters, tea hills and tropical coast.',
    image: 'destination-kerala.jpg',
    packageId: 'kerala-backwaters'
  },
  {
    name: 'Bali',
    copy: 'Temple trails, green interiors and warm shores.',
    image: 'destination-bali.jpg',
    packageId: 'bali-slow-escape'
  },
  {
    name: 'Himachal',
    copy: 'Mountain roads, pine forests and highland air.',
    image: 'destination-himachal.jpg',
    packageId: 'himalayan-trails'
  },
  {
    name: 'Vietnam',
    copy: 'Lively cities, limestone bays and heritage towns.',
    image: 'destination-vietnam.jpg',
    packageId: 'vietnam-discovery'
  }
];

export const themes = [
  {
    id: 'family',
    name: 'Family Holidays',
    copy: 'Balanced days, flexible pacing and shared experiences.',
    image: 'theme-family.jpg'
  },
  {
    id: 'honeymoon',
    name: 'Honeymoon',
    copy: 'Private moments, scenic stays and time to slow down.',
    image: 'theme-honeymoon.jpg'
  },
  {
    id: 'adventure',
    name: 'Adventure',
    copy: 'Active days, mountain trails and memorable detours.',
    image: 'theme-adventure.jpg'
  },
  {
    id: 'senior',
    name: 'Senior-Friendly Tours',
    copy: 'Comfort-led pacing with thoughtfully planned transfers.',
    image: 'theme-senior.jpg'
  }
];

export const partners = [
  {
    name: 'Agoda India',
    copy: 'Hotels and stays',
    url: 'https://www.agoda.com/en-in/'
  },
  {
    name: 'Trivago',
    copy: 'Accommodation comparison',
    url: 'https://www.trivago.in/'
  },
  {
    name: 'Skyscanner',
    copy: 'Flight discovery',
    url: 'https://www.skyscanner.co.in/'
  },
  {
    name: 'Tripadvisor',
    copy: 'Traveller reviews',
    url: 'https://www.tripadvisor.in/'
  }
];

export function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

export function imagePath(filename) {
  return `/assets/images/${filename}`;
}
