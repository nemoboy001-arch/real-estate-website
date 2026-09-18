export interface Property {
  id: string;
  title: string;
  category: 'residential' | 'luxury' | 'rental' | 'commercial' | 'land';
  listingType: 'sale' | 'lease';
  price: number;
  beds?: number;
  baths?: number;
  sqft: number;
  location: {
    address: string;
    city: string;
    zip: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images: string[];
  amenities: string[];
  agentId: string;
  description: string;
  featured: boolean;
  yearBuilt?: number;
  leaseTerm?: string;
  hoa?: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  photo: string;
  email: string;
  phone: string;
  bio: string;
  rating: number;
  specialties: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  avatar: string;
  rating: number;
}

export const agents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Sarah Jenkins',
    title: 'Luxury Estate Specialist',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    email: 'sarah@peculiaraesthetics.com',
    phone: '(555) 124-5678',
    bio: 'With over 12 years of experience in luxury real estate, Sarah has helped high-net-worth clients secure exclusive properties in Bel Air and Beverly Hills. Her attention to detail and discreet service are legendary.',
    rating: 4.9,
    specialties: ['Luxury Homes', 'Exclusive Mansions', 'Oceanfront Properties'],
  },
  {
    id: 'agent-2',
    name: 'Marcus Vance',
    title: 'Commercial Broker & Advisor',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80',
    email: 'marcus@peculiaraesthetics.com',
    phone: '(555) 987-6543',
    bio: 'Marcus has handled over $200M in commercial transactions. From downtown office towers to tech campus leases, he guides companies, startups, and investors through complex acquisitions and leases.',
    rating: 4.8,
    specialties: ['Office Spaces', 'Retail Leases', 'Industrial Properties', 'Investment Sales'],
  },
  {
    id: 'agent-3',
    name: 'Elena Rostova',
    title: 'Residential Sales Specialist',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80',
    email: 'elena@peculiaraesthetics.com',
    phone: '(555) 432-8765',
    bio: 'Elena is dedicated to helping families find their dream homes. Her approach combines deep local market knowledge with strong negotiation skills, making home buying stress-free and seamless.',
    rating: 4.9,
    specialties: ['Single Family Homes', 'First-Time Buyers', 'Suburban Communities'],
  },
  {
    id: 'agent-4',
    name: 'David Kim',
    title: 'Rental & Leasing Manager',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80',
    email: 'david@peculiaraesthetics.com',
    phone: '(555) 789-0123',
    bio: 'David manages our leasing portfolio, specializing in luxury apartments and urban lofts. He works closely with renters and landlords to coordinate swift, reliable tenancy agreements.',
    rating: 4.7,
    specialties: ['Urban Apartments', 'Corporate Housing', 'Short-term Rentals'],
  },
];

export const properties: Property[] = [
  // LUXURY
  {
    id: 'prop-lux-1',
    title: 'The Obsidian Estate',
    category: 'luxury',
    listingType: 'sale',
    price: 12500000,
    beds: 6,
    baths: 8,
    sqft: 9800,
    location: {
      address: '1428 Sunset Crest Dr',
      city: 'Beverly Hills',
      zip: '90210',
      coordinates: { lat: 34.0736, lng: -118.4004 },
    },
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Infinity Pool', 'Wine Cellar', 'Private Cinema', 'Smart Home System', 'Guest House', 'Helipad Access', 'Chef Kitchen'],
    agentId: 'agent-1',
    description: 'Commanding breathtaking panoramic views of the Los Angeles basin, The Obsidian Estate is an architectural masterpiece of steel, glass, and dark marble. Designed for absolute privacy, it features floor-to-ceiling glass walls, a 75-foot infinity-edge pool, and custom-imported Italian finishes throughout.',
    featured: true,
    yearBuilt: 2024,
    hoa: 1200,
  },
  {
    id: 'prop-lux-2',
    title: 'Lakeside Zenith Villa',
    category: 'luxury',
    listingType: 'sale',
    price: 8900000,
    beds: 5,
    baths: 6,
    sqft: 7200,
    location: {
      address: '88 Lakeview Dr',
      city: 'Lake Tahoe',
      zip: '96150',
      coordinates: { lat: 39.0968, lng: -120.0324 },
    },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Private Pier', 'Heated Outdoor Deck', 'Hot Tub', 'Sauna', 'Ski Storage', 'Indoor Fireplace'],
    agentId: 'agent-1',
    description: 'An extraordinary waterfront sanctuary on the pristine shores of Lake Tahoe. Lakeside Zenith combines rustic alpine woodcraft with modern luxury. Vaulted redwood ceilings, a private deep-water pier, and expansive decks offer the ultimate multi-season retreat.',
    featured: true,
    yearBuilt: 2022,
    hoa: 800,
  },
  {
    id: 'prop-lux-3',
    title: 'Bel Air Crest Mansion',
    category: 'luxury',
    listingType: 'sale',
    price: 18500000,
    beds: 7,
    baths: 10,
    sqft: 14500,
    location: {
      address: '2300 Stone Canyon Rd',
      city: 'Bel Air',
      zip: '90077',
      coordinates: { lat: 34.0984, lng: -118.4489 },
    },
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Tennis Court', 'Wellness Spa', '10-Car Gallery', 'Infinity Pool', 'Elevator', '24/7 Guard Gated'],
    agentId: 'agent-1',
    description: 'Poised on a dramatic 2.5-acre promontory, this legendary Bel Air estate showcases monumental modern classic styling. Features include a professional wellness spa, professional-grade clay tennis court, and an expansive multi-level lawn that commands skyline views.',
    featured: false,
    yearBuilt: 2021,
    hoa: 2200,
  },

  // RESIDENTIAL
  {
    id: 'prop-res-1',
    title: 'Modern Suburban Haven',
    category: 'residential',
    listingType: 'sale',
    price: 985000,
    beds: 4,
    baths: 3,
    sqft: 2850,
    location: {
      address: '412 Meadowbrook Ln',
      city: 'Pasadena',
      zip: '91101',
      coordinates: { lat: 34.1478, lng: -118.1445 },
    },
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Landscaped Backyard', 'Double Garage', 'Solar Panels', 'Open Concept Kitchen', 'Hardwood Floors'],
    agentId: 'agent-3',
    description: 'Perfectly situated in a tree-lined Pasadena neighborhood, this craftsman-inspired modern home is ideal for family living. High ceilings, a light-flooded kitchen, and a private backyard with a cedar deck make it an exceptional residence.',
    featured: true,
    yearBuilt: 2018,
    hoa: 150,
  },
  {
    id: 'prop-res-2',
    title: 'Tranquil Oakwood Modern',
    category: 'residential',
    listingType: 'sale',
    price: 1350000,
    beds: 4,
    baths: 4,
    sqft: 3400,
    location: {
      address: '1504 Oakwood Ave',
      city: 'Sherman Oaks',
      zip: '91403',
      coordinates: { lat: 34.1481, lng: -118.4514 },
    },
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Smart Thermostat', 'Walk-in Closet', 'Home Office', 'Deck', 'EV Charger Setup'],
    agentId: 'agent-3',
    description: 'Located south of the boulevard, this newly updated home boasts dynamic contemporary lines, an open floor plan, state-of-the-art chef appliances, and a master suite complete with a private balcony.',
    featured: true,
    yearBuilt: 2019,
    hoa: 0,
  },
  {
    id: 'prop-res-3',
    title: 'Craftsman Family Residence',
    category: 'residential',
    listingType: 'sale',
    price: 780000,
    beds: 3,
    baths: 2,
    sqft: 1950,
    location: {
      address: '711 Elmwood Dr',
      city: 'Glendora',
      zip: '91741',
      coordinates: { lat: 34.1361, lng: -117.8653 },
    },
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Fireplace', 'Historic Details', 'Large Front Porch', 'Detached Workshop'],
    agentId: 'agent-3',
    description: 'Impeccably maintained Craftsman home blending historical character with smart modern updates. Features a welcoming front porch, a river-stone fireplace, built-in breakfast nook, and a sprawling backyard garden.',
    featured: false,
    yearBuilt: 1948,
    hoa: 0,
  },

  // RENTALS
  {
    id: 'prop-ren-1',
    title: 'Skyline Skyline Penthouse',
    category: 'rental',
    listingType: 'lease',
    price: 5200,
    beds: 2,
    baths: 2,
    sqft: 1400,
    location: {
      address: '800 Grand Ave #4202',
      city: 'Downtown LA',
      zip: '90017',
      coordinates: { lat: 34.0488, lng: -118.2581 },
    },
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['24/7 Concierge', 'Rooftop Pool', 'Fitness Center', 'Valet Parking', 'Panoramic City Views'],
    agentId: 'agent-4',
    description: 'Live above the clouds in this stunning 42nd-floor penthouse apartment. Featuring breathtaking glass walls looking over downtown, premium custom cabinet fixtures, smart lighting, and full access to elite community facilities.',
    featured: true,
    leaseTerm: '12 Months Minimum',
  },
  {
    id: 'prop-ren-2',
    title: 'Boho loft in Venice Beach',
    category: 'rental',
    listingType: 'lease',
    price: 3600,
    beds: 1,
    baths: 1.5,
    sqft: 950,
    location: {
      address: '52 Windward Ave #3B',
      city: 'Venice',
      zip: '90291',
      coordinates: { lat: 33.9877, lng: -118.4722 },
    },
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Exposed Brick', 'Polished Concrete Floors', 'Bicycle Storage', 'Walk to Beach', 'Private Balcony'],
    agentId: 'agent-4',
    description: 'A gorgeous industrial-style loft just steps from the sand. Vaulted ceilings, raw concrete finishes, exposed structural brick, and large factory-style windows flood the space with natural ocean breeze.',
    featured: true,
    leaseTerm: '6-18 Months',
  },
  {
    id: 'prop-ren-3',
    title: 'Suburban Courtyard Townhouse',
    category: 'rental',
    listingType: 'lease',
    price: 2850,
    beds: 2,
    baths: 2.5,
    sqft: 1250,
    location: {
      address: '1940 Cypress St',
      city: 'Torrance',
      zip: '90501',
      coordinates: { lat: 33.8358, lng: -118.3406 },
    },
    images: [
      'https://images.unsplash.com/photo-1502672090438-21149cd281cf?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Gated Courtyard', 'In-unit Laundry', 'Attached Garage', 'Community BBQ Area'],
    agentId: 'agent-4',
    description: 'Charming townhouse in a secure gated community. Features dual master suites, high-quality luxury vinyl plank flooring, an updated kitchen, and a private enclosed patio perfect for dining.',
    featured: false,
    leaseTerm: '12 Months',
  },

  // COMMERCIAL
  {
    id: 'prop-com-1',
    title: 'The Apex Creative Hub',
    category: 'commercial',
    listingType: 'lease',
    price: 18500,
    sqft: 5800,
    location: {
      address: '320 Abbot Kinney Blvd',
      city: 'Venice',
      zip: '90291',
      coordinates: { lat: 33.9904, lng: -118.4632 },
    },
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['High-speed Fiber', 'Conference Suites', 'Kitchenette', 'Skylights', 'Executive Parking', 'Flex Desk Layout'],
    agentId: 'agent-2',
    description: 'An exceptional commercial opportunity in the heart of Venice. Ideal for creative agencies, technology startups, or executive firms. Features high industrial truss ceilings, multiple conference zones, and a stunning open-floor plan.',
    featured: true,
    leaseTerm: '3-5 Years NNN',
  },
  {
    id: 'prop-com-2',
    title: 'Downtown Premium HQ Plaza',
    category: 'commercial',
    listingType: 'sale',
    price: 6400000,
    sqft: 18500,
    location: {
      address: '777 Wilshire Blvd',
      city: 'Los Angeles',
      zip: '90017',
      coordinates: { lat: 34.0504, lng: -118.2598 },
    },
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Full Building Signage', 'Security Reception', 'HVAC Dual Zone', 'Subterranean Parking', 'LEED Certified'],
    agentId: 'agent-2',
    description: 'A premier corporate headquarters asset on Wilshire Blvd. This standalone architectural structure offers grand visibility, secure access lobby, open floor executive workspaces, and an private underground parking deck.',
    featured: true,
    yearBuilt: 2012,
  },
  {
    id: 'prop-land-1',
    title: 'Prime Malibu Canyon Acreage',
    category: 'land',
    listingType: 'sale',
    price: 3200000,
    sqft: 217800, // 5 Acres
    location: {
      address: '2400 Malibu Canyon Rd',
      city: 'Malibu',
      zip: '90265',
      coordinates: { lat: 34.0471, lng: -118.6923 },
    },
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['Ocean Views', 'Geotechnical Survey Complete', 'Grading Permit Pending', 'Water Well Connected'],
    agentId: 'agent-1',
    description: 'An unparalleled development opportunity overlooking the Pacific Ocean. Over 5 pristine acres situated in the heart of Malibu. Concept designs for a modern 10,000 sq ft architectural estate are included.',
    featured: true,
  },
  {
    id: 'prop-land-2',
    title: 'Beverly Hills Crest Development Site',
    category: 'land',
    listingType: 'sale',
    price: 8900000,
    sqft: 87120, // 2 Acres
    location: {
      address: '1420 Benedict Canyon Dr',
      city: 'Beverly Hills',
      zip: '90210',
      coordinates: { lat: 34.1032, lng: -118.4231 },
    },
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: ['360 City Views', 'Gated Access Road', 'Utilities at Street', 'Fully Cleared Lot'],
    agentId: 'agent-1',
    description: 'Rare offering of a massive double lot building site on a private promontory in Beverly Hills. Boasting sweeping 360-degree views of the canyon and city skyline.',
    featured: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Julian Henderson',
    role: 'CEO, Nexus Technology',
    feedback: 'Marcus Vance secured our new headquarters within weeks. His deep commercial expertise and understanding of tech workspace needs saved us countless hours. Absolutely brilliant experience.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Victoria & Albert Green',
    role: 'Homeowners',
    feedback: 'Elena was an angel throughout our search. As first-time buyers, we were intimidated, but she navigated the entire process, explaining every document, and negotiated a fantastic price.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Alexandra DuPont',
    role: 'Luxury Real Estate Investor',
    feedback: 'Sarah Jenkins is the only agent I trust with my luxury transactions. Her access to off-market inventory in Beverly Hills is unparalleled. Her confidentiality and professional integrity are top-tier.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    rating: 5,
  },
];
