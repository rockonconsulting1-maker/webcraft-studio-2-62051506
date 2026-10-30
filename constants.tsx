
import { Listing, Testimonial, CommunityData } from './types';

export const BRAND = {
  primary: '#002366',
  accent: '#00A651',
  secondary: '#F5F7FA',
  text: '#333333',
};

export const CONTACT_INFO = {
  name: "Dillon Rochon",
  title: "REALTOR® | 2% Realty",
  phone: "587-328-7355 (SELL)",
  email: "dillon.rochon@2percentrealty.ca",
  brokerage: "2% Realty Lethbridge",
  areas: ["Pincher Creek", "Lethbridge", "Crowsnest Pass", "Fort Macleod", "Waterton"],
  address: "Serving all of Southern Alberta"
};

export const COMMUNITIES: Record<string, CommunityData> = {
  // --- PARENTS ---
  'pincher-creek': {
    id: 'pincher-creek',
    name: 'Pincher Creek',
    description: 'The "Wind Capital of Canada," Pincher Creek is a gateway to the Rockies, offering a perfect blend of prairie charm and mountain adventure.',
    heroImage: 'https://images.unsplash.com/photo-1544161515-4ad6ce6cd692?auto=format&fit=crop&q=80&w=1600',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10284.97014605912!2d-113.9555673!3d49.4847222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e7a1772591693%3A0x6d9f75a6c0c21743!2sPincher%20Creek%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca',
    highlights: ['Windy Skies & Mountain Views', 'Agricultural Hub', 'Gateway to Waterton Lakes'],
    eat: [
      { name: 'Bearberry Creek Guest House', description: 'Fine dining with local ingredients.', link: 'https://bearberrycreek.com', phone: '403-627-4000' },
      { name: 'Harvest Coffeehouse', description: 'The local meeting spot for coffee and fresh baked goods.', phone: '403-627-2114' }
    ],
    do: [
      { name: 'Kootenai Brown Pioneer Village', description: 'A heritage village documenting local history.', link: 'https://kootenaibrown.ca', phone: '403-627-3684' },
      { name: 'Pincher Creek Golf Club', description: 'A beautiful 9-hole course with mountain vistas.', link: 'https://pinchercreekgolf.com', phone: '403-627-2129' }
    ],
    subCommunities: ['walking-plow', 'cowley', 'lundbreck']
  },
  'crowsnest-pass': {
    id: 'crowsnest-pass',
    name: 'Crowsnest Pass',
    description: 'A municipality formed from five distinct towns, rich in coal mining history and world-class outdoor recreation.',
    heroImage: 'https://images.unsplash.com/photo-1589136777351-fdc9c99bc03a?auto=format&fit=crop&q=80&w=1600',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41113.88214227926!2d-114.4539868!3d49.6053748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536ee6805c6d36e7%3A0x8952b662df94d775!2sCrowsnest%20Pass%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca',
    highlights: ['Mining Heritage', 'Fly Fishing', 'Frank Slide'],
    eat: [
      { name: 'Stone\'s Throw Cafe', description: 'Organic coffee and artisanal sandwiches in Blairmore.', phone: '403-562-2330' },
      { name: 'The Rum Runner', description: 'Famous burgers and a tribute to local prohibition-era history.', phone: '403-562-2253' }
    ],
    do: [
      { name: 'Frank Slide Interpretive Centre', description: 'Learn about Canada\'s deadliest rockslide.', link: 'https://frankslide.ca', phone: '403-562-7388' },
      { name: 'Pass Powderkeg Ski Area', description: 'The family-friendly ski hill right in the Pass.', link: 'https://passpowderkeg.com', phone: '403-562-8334' }
    ],
    subCommunities: ['blairmore', 'coleman', 'hillcrest', 'bellevue', 'frank']
  },
  'lethbridge': {
    id: 'lethbridge',
    name: 'Lethbridge',
    description: 'The largest city in Southern Alberta, known for its deep coulees, the High Level Bridge, and vibrant cultural scene.',
    heroImage: 'https://images.unsplash.com/photo-1629904853716-f0bc54eba481?auto=format&fit=crop&q=80&w=1600',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d82136.96347326884!2d-112.8943343!3d49.6934572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e622998e6c469%3A0x6e76d8c83a73c153!2sLethbridge%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca',
    highlights: ['Coulee Landscapes', 'High Level Bridge', 'University of Lethbridge'],
    eat: [
      { name: 'Mocha Cabana', description: 'Farm-to-table excellence in the heart of downtown.', link: 'https://mochacabana.ca', phone: '403-329-6242' },
      { name: 'Two Guys and a Pizza Place', description: 'Nationally recognized creative pizzas.', link: 'https://twoguyspizza.ca', phone: '403-331-2222' }
    ],
    do: [
      { name: 'Nikka Yuko Japanese Garden', description: 'A serene Japanese garden built in 1967.', link: 'https://nikkayuko.com', phone: '403-328-3511' },
      { name: 'Galt Museum & Archives', description: 'Southern Alberta history with a stunning coulee view.', link: 'https://galtmuseum.com', phone: '403-320-3954' }
    ],
    subCommunities: ['west-lethbridge', 'south-lethbridge', 'north-lethbridge']
  },

  // --- SUB-COMMUNITIES: Pincher Creek MD ---
  'walking-plow': {
    id: 'walking-plow',
    name: 'Walking Plow Estates',
    parentCommunityId: 'pincher-creek',
    description: 'A premium acreage community just outside Pincher Creek, offering vast horizons and high-end rural living.',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600',
    mapEmbedUrl: '',
    highlights: ['Estate Living', 'Mountain Panoramas', 'Quiet Luxury'],
    eat: [], do: []
  },
  'cowley': {
    id: 'cowley',
    name: 'Cowley',
    parentCommunityId: 'pincher-creek',
    description: 'The "Gliding Capital of Canada," this quaint village is famous for its mountain waves that attract pilots from across the globe.',
    heroImage: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&q=80&w=1600',
    mapEmbedUrl: '',
    highlights: ['Aviation Hub', 'Railway History', 'Close to Oldman River'],
    eat: [{ name: 'Cowley Co-op', description: 'The hub for local essentials and snacks.', phone: '403-628-3939' }],
    do: [{ name: 'Oldman River Dam', description: 'A massive landmark for fishing, windsurfing, and recreation.', phone: '403-627-1111' }]
  },
  'lundbreck': {
    id: 'lundbreck',
    name: 'Lundbreck',
    parentCommunityId: 'pincher-creek',
    description: 'A small hamlet perfectly situated near the beautiful Lundbreck Falls and the Cowboy Trail.',
    heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10287.123456789!2d-114.15!3d49.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e800000000000%3A0x0!2sLundbreck%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca',
    highlights: ['Lundbreck Falls', 'Fly Fishing Paradise', 'Gateway to Crowsnest Pass'],
    eat: [{ name: 'Oldman River Brewing', description: 'Craft beer and elevated pub fare in the heart of Lundbreck.', link: 'https://oldmanriverbrewing.com', phone: '403-628-2122' }],
    do: [{ name: 'Lundbreck Falls', description: 'Stunning double waterfall on the Crowsnest River.', phone: '403-627-1122' }]
  },

  // --- SUB-COMMUNITIES: Crowsnest Pass ---
  'blairmore': {
    id: 'blairmore',
    name: 'Blairmore',
    parentCommunityId: 'crowsnest-pass',
    description: 'The administrative and commercial hub of Crowsnest Pass, nestled directly under the shadow of Turtle Mountain.',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10260.0!2d-114.43!3d49.61!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536ee00000000000%3A0x0!2sBlairmore%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Commercial Hub', 'Historic Downtown', 'Access to Pass Powderkeg'],
    eat: [
      { name: 'The Cherry on Top', description: 'Local ice cream shop and social hub.', phone: '403-562-2824' },
      { name: 'Stone\'s Throw Cafe', description: 'Organic coffee and artisanal sandwiches.', phone: '403-562-2330' }
    ],
    do: [
      { name: 'Pass Powderkeg Ski Area', description: 'Family-friendly skiing and mountain biking.', link: 'https://passpowderkeg.com' },
      { name: 'Crowsnest Museum', description: 'Explore the rich history of the Pass.', link: 'https://crowsnestmuseum.ca' }
    ]
  },
  'coleman': {
    id: 'coleman',
    name: 'Coleman',
    parentCommunityId: 'crowsnest-pass',
    description: 'National Historic Site status marks Coleman as a town that preserves its coal mining heritage better than almost any other.',
    heroImage: 'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10261.0!2d-114.5!3d49.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536ee00000000000%3A0x0!2sColeman%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Historic District', 'Flier Mine Site', 'Gateway to BC'],
    eat: [
      { name: 'Chris\' Restaurant', description: 'A staple for breakfast and traditional diner fare.', phone: '403-563-3053' },
      { name: 'Crowsnest Coffee Company', description: 'Freshly roasted coffee in a historic setting.', link: 'https://crowsnestcoffee.ca' }
    ],
    do: [
      { name: 'Star Creek Falls', description: 'A beautiful hike leading to a hidden waterfall.', phone: '403-562-8833' }
    ]
  },
  'hillcrest': {
    id: 'hillcrest',
    name: 'Hillcrest',
    parentCommunityId: 'crowsnest-pass',
    description: 'A quiet residential community in the Crowsnest Pass, known for its history and scenic mountain backdrop.',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10262.0!2d-114.38!3d49.59!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536ee00000000000%3A0x0!2sHillcrest%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Residential Peace', 'Mountain Views', 'Historic Mines'],
    eat: [{ name: 'Hillcrest Miners Club', description: 'A historic social club with a welcoming atmosphere.', phone: '403-562-2544' }],
    do: [{ name: 'Hillcrest Mine Disaster Memorial', description: 'A solemn site honoring the 189 miners lost in 1914.', phone: '403-562-7388' }]
  },
  'bellevue': {
    id: 'bellevue',
    name: 'Bellevue',
    parentCommunityId: 'crowsnest-pass',
    description: 'Home to the Bellevue Underground Mine tour, this community offers a deep dive into the region\'s mining history.',
    heroImage: 'https://images.unsplash.com/photo-1544161515-4ad6ce6cd692?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10263.0!2d-114.35!3d49.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536ee00000000000%3A0x0!2sBellevue%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Bellevue Underground Mine', 'Historic Main Street', 'Scenic Vistas'],
    eat: [{ name: 'Old Dairy Ice Cream Shop', description: 'Famous for its massive scoops and historic building.', phone: '403-564-4222' }],
    do: [{ name: 'Bellevue Underground Mine Tour', description: 'Experience the life of a coal miner.', link: 'https://bellevuemine.com', phone: '403-564-4700' }]
  },
  'frank': {
    id: 'frank',
    name: 'Frank',
    parentCommunityId: 'crowsnest-pass',
    description: 'The site of the famous Frank Slide, Canada\'s deadliest rockslide, now a place of remembrance and geological wonder.',
    heroImage: 'https://images.unsplash.com/photo-1589136777351-fdc9c99bc03a?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10264.0!2d-114.4!3d49.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536ee00000000000%3A0x0!2sFrank%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Frank Slide', 'Interpretive Centre', 'Geological History'],
    eat: [],
    do: [{ name: 'Frank Slide Interpretive Centre', description: 'Award-winning museum and walking trails.', link: 'https://frankslide.ca', phone: '403-562-7388' }]
  },

  // --- SUB-COMMUNITIES: Lethbridge ---
  'west-lethbridge': {
    id: 'west-lethbridge',
    name: 'West Lethbridge',
    parentCommunityId: 'lethbridge',
    description: 'The fastest-growing sector of the city, West Lethbridge is home to the University and many modern residential communities.',
    heroImage: 'https://images.unsplash.com/photo-1629904853716-f0bc54eba481?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10267.0!2d-112.9!3d49.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e600000000000%3A0x0!2sWest%20Lethbridge%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca',
    highlights: ['University of Lethbridge', 'Modern Neighborhoods', 'Extensive Parks'],
    eat: [{ name: 'Firestone Restaurant and Bar', description: 'Upscale casual with a great patio.', phone: '403-329-3473' }],
    do: [{ name: 'Nicholas Sheran Park', description: 'Lethbridge\'s premier disc golf and multi-use park.', phone: '403-320-3020' }],
    schools: [
      { name: 'University of Lethbridge', description: 'Global research university.' },
      { name: 'Coalbanks Elementary', description: 'Highly rated public school in Copperwood.' }
    ],
    subCommunities: ['copperwood', 'riverstone']
  },
  'copperwood': {
    id: 'copperwood',
    name: 'Copperwood',
    parentCommunityId: 'west-lethbridge',
    description: 'A family-oriented community in West Lethbridge known for its parks, trails, and modern amenities.',
    heroImage: '', mapEmbedUrl: '', highlights: ['Family Friendly', 'Modern Homes', 'Walking Trails'],
    eat: [], do: []
  },
  'riverstone': {
    id: 'riverstone',
    name: 'Riverstone',
    parentCommunityId: 'west-lethbridge',
    description: 'An established West Lethbridge neighborhood with beautiful landscaping and proximity to the coulees.',
    heroImage: '', mapEmbedUrl: '', highlights: ['Established Beauty', 'Coulee Access', 'Quiet Streets'],
    eat: [], do: []
  },
  'south-lethbridge': {
    id: 'south-lethbridge',
    name: 'South Lethbridge',
    parentCommunityId: 'lethbridge',
    description: 'The historic heart of the city, featuring mature trees, the downtown core, and the beautiful Henderson Lake Park.',
    heroImage: 'https://images.unsplash.com/photo-1629904853716-f0bc54eba481?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10265.0!2d-112.82!3d49.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e600000000000%3A0x0!2sSouth%20Lethbridge%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Henderson Lake', 'Downtown Lethbridge', 'Mature Neighborhoods'],
    eat: [
      { name: 'Mocha Cabana', description: 'Farm-to-table excellence downtown.', link: 'https://mochacabana.ca' },
      { name: 'The Owl Acoustic Lounge', description: 'Live music and great food.', link: 'https://theowlacousticlounge.ca' }
    ],
    do: [
      { name: 'Henderson Lake Park', description: 'Lethbridge\'s premier urban park.', phone: '403-320-3020' },
      { name: 'Nikka Yuko Japanese Garden', description: 'Tranquility and culture.', link: 'https://nikkayuko.com' }
    ],
    schools: [
      { name: 'Lethbridge Collegiate Institute', description: 'Historic high school with strong academics.' },
      { name: 'Fleetwood-Bawden Elementary', description: 'Respected neighborhood elementary school.' }
    ],
    subCommunities: ['london-road']
  },
  'london-road': {
    id: 'london-road',
    name: 'London Road',
    parentCommunityId: 'south-lethbridge',
    description: 'One of Lethbridge\'s most historic neighborhoods, featuring stunning heritage homes and mature tree-lined streets.',
    heroImage: '', mapEmbedUrl: '', highlights: ['Heritage Homes', 'Mature Trees', 'Walkable'],
    eat: [], do: []
  },
  'north-lethbridge': {
    id: 'north-lethbridge',
    name: 'North Lethbridge',
    parentCommunityId: 'lethbridge',
    description: 'A diverse area with strong community roots, featuring many parks and the scenic Pavan Park along the river.',
    heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10266.0!2d-112.85!3d49.72!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e600000000000%3A0x0!2sNorth%20Lethbridge%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Pavan Park', 'Community Spirit', 'Diverse Housing'],
    eat: [
      { name: 'Italian Table', description: 'Family-style Italian dining.', link: 'https://italiantable.ca' },
      { name: 'Luigi\'s North', description: 'A local favorite for steak and pizza.', phone: '403-328-1111' }
    ],
    do: [
      { name: 'Pavan Park', description: 'Extensive trail system along the Oldman River.', phone: '403-320-3020' },
      { name: 'Legacy Park', description: 'Lethbridge\'s newest major park with a spray park and skate park.', phone: '403-320-3020' }
    ],
    schools: [
      { name: 'Winston Churchill High School', description: 'Known for its International Baccalaureate program.' },
      { name: 'St. Teresa of Calcutta', description: 'Modern Catholic elementary school.' }
    ],
    subCommunities: ['legacy-ridge', 'uplands']
  },
  'legacy-ridge': {
    id: 'legacy-ridge',
    name: 'Legacy Ridge',
    parentCommunityId: 'north-lethbridge',
    description: 'A newer North Lethbridge community with great views of the coulees and easy access to Legacy Park.',
    heroImage: '', mapEmbedUrl: '', highlights: ['Newer Homes', 'Coulee Views', 'Legacy Park Access'],
    eat: [], do: []
  },
  'uplands': {
    id: 'uplands',
    name: 'Uplands',
    parentCommunityId: 'north-lethbridge',
    description: 'A well-established North Lethbridge neighborhood with a variety of housing options and many parks.',
    heroImage: '', mapEmbedUrl: '', highlights: ['Established', 'Diverse Housing', 'Parks'],
    eat: [], do: []
  },

  // --- MDs ---
  'md-pincher-creek': {
    id: 'md-pincher-creek',
    name: 'MD of Pincher Creek',
    description: 'A diverse municipal district covering mountain peaks, foothills, and fertile plains. It offers some of the most stunning ranch land in Alberta.',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10284.0!2d-113.9!3d49.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e700000000000%3A0x0!2sMD%20of%20Pincher%20Creek%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca',
    highlights: ['Beaver Mines', 'Twin Butte', 'Oldman River Basin'],
    eat: [{ name: 'Twin Butte Country Store', description: 'Legendary Mexican food and live music in the foothills.', phone: '403-627-4035' }],
    do: [{ name: 'Castle Provincial Park', description: 'Vast wilderness for hiking and fishing.', phone: '403-627-1132' }]
  },
  'md-willow-creek': {
    id: 'md-willow-creek',
    name: 'MD of Willow Creek',
    description: 'Bordering the foothills of the Rockies, this district is rich in ranching history and home to the famous Head-Smashed-In Buffalo Jump.',
    heroImage: 'https://images.unsplash.com/photo-1544161515-4ad6ce6cd692?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10285.0!2d-113.6!3d49.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e000000000000%3A0x0!2sMD%20of%20Willow%20Creek%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Stavely', 'Claresholm', 'Head-Smashed-In Buffalo Jump'],
    eat: [{ name: 'The Station', description: 'Classic diner food in a historic railway station in Claresholm.', phone: '403-625-2333' }],
    do: [{ name: 'Head-Smashed-In Buffalo Jump', description: 'UNESCO World Heritage site documenting 6,000 years of history.', link: 'https://headsmashedin.ca' }]
  },
  'lethbridge-county': {
    id: 'lethbridge-county',
    name: 'Lethbridge County',
    description: 'The agricultural powerhouse of Southern Alberta, surrounding the city of Lethbridge with fertile fields and thriving towns.',
    heroImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600', 
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10286.0!2d-112.8!3d49.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x536e000000000000%3A0x0!2sLethbridge%20County%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca', 
    highlights: ['Coaldale', 'Coalhurst', 'Birds of Prey Centre'],
    eat: [{ name: 'The Coaldale Bakery', description: 'Famous for its traditional Dutch pastries and fresh bread.', phone: '403-345-3322' }],
    do: [{ name: 'Alberta Birds of Prey Centre', description: 'Canada\'s largest birds of prey facility.', link: 'https://burrowingowl.com' }]
  }
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    address: '123 Mountain View Way',
    city: 'Pincher Creek',
    price: 450000,
    beds: 4,
    baths: 3,
    sqft: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    type: 'Residential',
    featured: true
  },
  {
    id: '2',
    address: '742 Evergreen Terrace',
    city: 'Lethbridge',
    price: 389000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800',
    type: 'Residential',
    featured: true
  },
  {
    id: '3',
    address: '10 High Country Trail',
    city: 'Crowsnest Pass',
    price: 525000,
    beds: 5,
    baths: 3,
    sqft: 3100,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    type: 'Acreage',
    featured: true
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah & John M.',
    location: 'Pincher Creek',
    quote: 'Dillon made selling our home effortless. His communication was top-notch, and the 2% commission saved us over $12,000!',
    rating: 5
  },
  {
    id: '2',
    name: 'Kevin L.',
    location: 'Lethbridge',
    quote: 'Coming from a law enforcement background, Dillon brings a level of integrity and calm that is rare in real estate. Truly a stress-free experience.',
    rating: 5
  },
  {
    id: '3',
    name: 'Brenda T.',
    location: 'Crowsnest Pass',
    quote: 'We were skeptical about the 2% model, but the service was actually better than traditional agents we\'ve used. Dillon went above and beyond.',
    rating: 5
  }
];
