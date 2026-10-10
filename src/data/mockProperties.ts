import { Property, CustomerReview } from '../types/property';
import { CITIES } from './cities';
import { BRAND_CONFIG } from './brandConfig';

export { CITIES, BRAND_CONFIG };

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: '4 BHK Grand Imperial Villa with Private Plunge Pool',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Bangalore',
    locality: 'Sarjapur Road',
    address: 'Emerald Hills Enclave, Phase 2, Sarjapur, Bangalore - 560035',
    price: 34500000,
    priceDisplay: '₹ 3.45 Cr',
    pricePerSqFt: 8846,
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    areaSqFt: 3900,
    carpetAreaSqFt: 3450,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: 'G + 2 Independent Villa',
    reraId: 'PRM/KA/RERA/1251/308/PR/210319/004012',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Swimming Pool',
      'Private Landscaped Lawn',
      'Double Height Ceiling',
      '24x7 Security & CCTV',
      '100% DG Power Backup',
      'Double Covered Car Parking',
      'Home Automation Ready',
      'Clubhouse & Gym Access'
    ],
    localityHighlights: [
      { title: 'Carmelaram Railway / Metro Link', distance: '3.2 km', type: 'metro' },
      { title: 'Wipro SEZ Corporate Campus', distance: '1.8 km', type: 'highway' },
      { title: 'Motherhood Hospital', distance: '2.5 km', type: 'hospital' },
      { title: 'Greenwood High International School', distance: '1.2 km', type: 'school' },
      { title: 'Kempegowda International Airport', distance: '45 mins', type: 'airport' }
    ],
    postedBy: {
      name: 'Aditya Vardhan (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Bespoke contemporary triplex villa nestled in an ultra-luxurious gated sanctuary on Sarjapur Road. Features high Italian marble flooring, floor-to-ceiling soundproof glass facades, custom private plunge pool, and expansive terrace deck overlooking lush greenery. Directly connected to prime IT corridors with zero brokerage.',
    createdAt: '2026-03-15'
  },
  {
    id: 'prop-2',
    title: '3 BHK Sea-View Ultra Luxury Residence',
    category: 'buy',
    propertyType: 'Luxury Apartment',
    city: 'Mumbai',
    locality: 'Worli Sea Face',
    address: 'The Celeste Heights, Level 24, Worli, Mumbai - 400018',
    price: 68000000,
    priceDisplay: '₹ 6.80 Cr',
    pricePerSqFt: 30909,
    bedrooms: 3,
    bathrooms: 4,
    balconies: 2,
    areaSqFt: 2200,
    carpetAreaSqFt: 1850,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Furnished',
    facing: 'West',
    floor: '24th of 45 Floors',
    reraId: 'P51900018247',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Panoramic Arabian Sea View',
      'Infinity Rooftop Pool',
      'Concierge & Valet Service',
      'State-of-art Technogym Fitness Studio',
      '3 Dedicated Basement Car Parks',
      'Private High-Speed Elevator',
      'EV Charging Bays',
      'Sky Lounge & Cigar Room'
    ],
    localityHighlights: [
      { title: 'Bandra-Worli Sea Link Entrance', distance: '1.1 km', type: 'highway' },
      { title: 'Acharya Atre Metro Station', distance: '1.4 km', type: 'metro' },
      { title: 'Podar International School', distance: '2.0 km', type: 'school' },
      { title: 'Hinduja Hospital Khar / Mahim', distance: '3.5 km', type: 'hospital' },
      { title: 'Chhatrapati Shivaji Maharaj Airport', distance: '25 mins', type: 'airport' }
    ],
    postedBy: {
      name: 'Oberoi Realty Partner Desk',
      type: 'Builder',
      phone: '+91 8383826205'
    },
    description: 'An architectural masterpiece overlooking the serene Arabian Sea in iconic Worli. Lavishly furnished with imported German fittings, climate control HVAC, designer chandeliers, and uninterrupted sunset views. Fully vetted with clear title and zero brokerage fee.',
    createdAt: '2026-03-20'
  },
  {
    id: 'prop-3',
    title: '3 BHK Modern High-Rise Apartment in Cyber City Hub',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Delhi NCR',
    locality: 'Golf Course Extension, Gurugram',
    address: 'DLF Crest Walk, Sector 54, Gurugram, Haryana - 122002',
    price: 21500000,
    priceDisplay: '₹ 2.15 Cr',
    pricePerSqFt: 11025,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 3,
    areaSqFt: 1950,
    carpetAreaSqFt: 1650,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Semi-Furnished',
    facing: 'North',
    floor: '12th of 28 Floors',
    reraId: 'RC/REP/HARERA/GGM/2021/68',
    isVerified: true,
    isZeroBrokerage: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Olympic-sized Swimming Pool',
      'Squash & Badminton Courts',
      'Lush Central Greens & Jogging Track',
      'Multi-tier 24x7 Security',
      'Clubhouse with Banquet Hall',
      'Children Play Zone & Creche',
      'Solar Powered Common Areas'
    ],
    localityHighlights: [
      { title: 'Sector 54 Rapid Metro Station', distance: '600 m', type: 'metro' },
      { title: 'Cyber Hub DLF', distance: '10 mins drive', type: 'highway' },
      { title: 'Fortis Memorial Research Institute', distance: '4.2 km', type: 'hospital' },
      { title: 'The Shri Ram School Aravali', distance: '2.1 km', type: 'school' },
      { title: 'IGI International Airport T3', distance: '20 mins', type: 'airport' }
    ],
    postedBy: {
      name: 'Kamlesh Yadav (Authorized Rep)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Spectacular sunlit corner 3 BHK apartment located right off Golf Course Extension Road. Enjoy panoramic Aravalli ridge views, high-end modular kitchen with chimney & hob, premium wooden flooring in master bedroom, and resort style amenities.',
    createdAt: '2026-03-10'
  },
  {
    id: 'prop-4',
    title: '4 BHK Royal Heritage Villa with Private Courtyard',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Varanasi',
    locality: 'Shivpur, Ring Road Corridor',
    address: 'Kashi Royal Enclave, Near Ring Road Phase 1, Shivpur, Varanasi - 221003',
    price: 18500000,
    priceDisplay: '₹ 1.85 Cr',
    pricePerSqFt: 5781,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    areaSqFt: 3200,
    carpetAreaSqFt: 2800,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: 'G + 1 Independent Duplex',
    reraId: 'UPRERAPRJ983411',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Gated Community with Boundary Wall',
      'Private Courtyard (Aangan) & Garden',
      'Borewell & Dedicated Submersible System',
      'Wide 40-ft Internal Concrete Roads',
      '2 Covered SUV Car Parking',
      'Rooftop Terrace with Temple Space',
      'Solar Geyser Installed'
    ],
    localityHighlights: [
      { title: 'Varanasi Ring Road Highway', distance: '800 m', type: 'highway' },
      { title: 'Babatpur Lal Bahadur Shastri Airport', distance: '14 km / 18 mins', type: 'airport' },
      { title: 'Varanasi Cantonment Junction', distance: '6.5 km', type: 'metro' },
      { title: 'Heritage Super Specialty Hospital', distance: '4.0 km', type: 'hospital' },
      { title: 'Sunbeam School Varuna', distance: '3.2 km', type: 'school' }
    ],
    postedBy: {
      name: 'Kamlesh Builder & Associates',
      type: 'Builder',
      phone: '+91 8383826205'
    },
    description: 'Exquisite independent duplex villa blending classical architectural aesthetics with ultra-modern comforts in prime Shivpur. Spacious rooms with expansive natural light, Vaastu-compliant North-East entrance, robust RCC structure, and clean 100% legal title.',
    createdAt: '2026-03-18'
  },
  {
    id: 'prop-5',
    title: '3 BHK Lavish Riverside Penthouse with Private Terrace',
    category: 'buy',
    propertyType: 'Penthouse',
    city: 'Pune',
    locality: 'Koregaon Park Annexe',
    address: 'Riverstone Towers, 14th Floor, Koregaon Park Annexe, Pune - 411001',
    price: 27500000,
    priceDisplay: '₹ 2.75 Cr',
    pricePerSqFt: 10377,
    bedrooms: 3,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 2650,
    carpetAreaSqFt: 2280,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Furnished',
    facing: 'North',
    floor: '14th Floor (Top Penthouse)',
    reraId: 'P52100028912',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      '750 sq.ft Private Open Terrace Garden',
      'Smart Home Automation by Legrand',
      'Designer Italian Kitchen with Island',
      'Clubhouse with Heated Jacuzzi',
      'High-Speed Elevators with Card Access',
      '2 Reserved Basement Car Parking',
      '24/7 Concierge Support'
    ],
    localityHighlights: [
      { title: 'Kalyani Nagar Metro Station', distance: '1.5 km', type: 'metro' },
      { title: 'Pune International Airport Lohegaon', distance: '5.2 km', type: 'airport' },
      { title: 'Ruby Hall Clinic', distance: '3.8 km', type: 'hospital' },
      { title: 'Phoenix Marketcity Mall', distance: '4.0 km', type: 'mall' },
      { title: 'Magarpatta Cybercity IT Park', distance: '6.0 km', type: 'highway' }
    ],
    postedBy: {
      name: 'Pooja Kulkarni (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Rare top-floor penthouse offering tranquil Mula-Mutha river views and cool breezes. Features expansive party terrace, Italian marble floors, walking closets, and custom ambient cove lighting. Walking distance to elite cafes and fine dining.',
    createdAt: '2026-03-22'
  },
  {
    id: 'prop-6',
    title: '3 BHK Designer Apartment in Gomti Nagar Extension',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Lucknow',
    locality: 'Gomti Nagar Extension',
    address: 'Eldeco Elegance, Sector 7, Gomti Nagar Extension, Lucknow - 226010',
    price: 9800000,
    priceDisplay: '₹ 98 Lakhs',
    pricePerSqFt: 5939,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1650,
    carpetAreaSqFt: 1380,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: '8th of 16 Floors',
    reraId: 'UPRERAPRJ442190',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1502005229762-ee152d9a5b3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'LDA Approved & Bank Loan Available',
      'Clubhouse with Swimming Pool',
      'Gym & Yoga Meditation Deck',
      'Covered Car Stilt Parking',
      '24-Hour Security & Intercom',
      'Landscaped Green Parks with Gazebo'
    ],
    localityHighlights: [
      { title: 'Ekana International Cricket Stadium', distance: '1.5 km', type: 'highway' },
      { title: 'Lulu Mall Lucknow', distance: '3.0 km', type: 'mall' },
      { title: 'Medanta Super Specialty Hospital', distance: '4.5 km', type: 'hospital' },
      { title: 'CMS Gomti Nagar Campus', distance: '2.8 km', type: 'school' },
      { title: 'Chaudhary Charan Singh Airport', distance: '20 mins', type: 'airport' }
    ],
    postedBy: {
      name: 'Kamlesh Property Consultants',
      type: 'Agent',
      phone: '+91 8383826205'
    },
    description: 'Impeccably designed 3 BHK home in one of Lucknow’s fastest-appreciating residential corridors. Features double balconies with open skyline views, vitrified tile flooring, modular woodwork, and uninterrupted municipal water supply.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-7',
    title: 'Fully Furnished 2 BHK Luxury Rental Flat near Tech Corridor',
    category: 'rent',
    propertyType: 'Apartment',
    city: 'Bangalore',
    locality: 'Whitefield',
    address: 'Prestige Boulevard, ITPL Main Road, Whitefield, Bangalore - 560066',
    price: 45000,
    priceDisplay: '₹ 45,000 / mo',
    pricePerSqFt: 36,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    areaSqFt: 1250,
    carpetAreaSqFt: 1050,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Furnished',
    facing: 'North',
    floor: '5th of 14 Floors',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Zero Brokerage Direct Owner Deal',
      'Smart TV, Double-Door Fridge & Washing Machine',
      'King Beds with Orthopedic Mattresses',
      'High-Speed Fiber Broadband Pre-Installed',
      'Swimming Pool & Badminton Court',
      'Dedicated Reserved Stilt Parking'
    ],
    localityHighlights: [
      { title: 'ITPL Metro Station (Purple Line)', distance: '400 m', type: 'metro' },
      { title: 'International Tech Park Bangalore (ITPB)', distance: '600 m', type: 'highway' },
      { title: 'Manipal Hospital Whitefield', distance: '1.8 km', type: 'hospital' },
      { title: 'Nexus Shantiniketan Mall', distance: '1.2 km', type: 'mall' }
    ],
    postedBy: {
      name: 'Rohan Deshmukh (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Plug-and-play modern 2 BHK home for tech professionals and families. 100% furnished with tasteful designer furniture, smart appliances, crockery, and fast WiFi. Walking distance to Purple Line metro station.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-8',
    title: 'Grade-A Prime IT Office Space in Bandra Kurla Complex (BKC)',
    category: 'commercial',
    propertyType: 'Commercial Office',
    city: 'Mumbai',
    locality: 'Bandra Kurla Complex',
    address: 'Capital One Financial Tower, G Block, BKC, Bandra East, Mumbai - 400051',
    price: 45000000,
    priceDisplay: '₹ 4.50 Cr',
    pricePerSqFt: 25000,
    bedrooms: 0,
    bathrooms: 2,
    balconies: 0,
    areaSqFt: 1800,
    carpetAreaSqFt: 1500,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Furnished',
    facing: 'North-East',
    floor: '7th of 22 Floors',
    reraId: 'P51800030119',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'LEED Platinum Certified Green Building',
      'Centralised HVAC & Fresh Air Chiller Plants',
      'High-Speed Destination Controlled Lifts',
      '100% Redundant Power Backup & Server Room',
      'Multi-tier Biometric Access Control',
      'Underground Multi-level Parking'
    ],
    localityHighlights: [
      { title: 'BKC Underground Metro Station (Line 3)', distance: '300 m', type: 'metro' },
      { title: 'Western Express Highway', distance: '1.2 km', type: 'highway' },
      { title: 'Jio World Convention Centre', distance: '500 m', type: 'mall' },
      { title: 'Bandra Terminus', distance: '2.5 km', type: 'metro' }
    ],
    postedBy: {
      name: 'VillaSell Commercial Advisory',
      type: 'Agent',
      phone: '+91 8383826205'
    },
    description: 'Prestigious commercial office asset in the heart of Mumbai’s premier financial hub. High rental yield potential (8.5% p.a.), fully fitted with 28 workstations, conference boardroom, private cabin, and cafeteria.',
    createdAt: '2026-03-21'
  },
  {
    id: 'prop-9',
    title: 'Gated Villa Plot in Premium Eco-Township',
    category: 'plots',
    propertyType: 'Residential Plot',
    city: 'Pune',
    locality: 'Wakad - Hinjewadi Link Rd',
    address: 'Greenwood County, Phase 3, Hinjewadi, Pune - 411057',
    price: 6500000,
    priceDisplay: '₹ 65 Lakhs',
    pricePerSqFt: 2708,
    bedrooms: 0,
    bathrooms: 0,
    balconies: 0,
    areaSqFt: 2400,
    carpetAreaSqFt: 2400,
    status: 'Ready to Move',
    possession: 'Immediate Registry',
    furnishing: 'Unfurnished',
    facing: 'East',
    floor: 'Clear NA / RERA Approved',
    reraId: 'P52100034190',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'PMRDA Sanctioned & Clear Title',
      'Individual 7/12 Extract Ready',
      'Gated Campus with Concrete Compound Wall',
      'Underground Water, Electricity & Sewage Cabling',
      'Street Lights & Tree Plantation along avenues',
      'Immediate Bank Loan from SBI / HDFC'
    ],
    localityHighlights: [
      { title: 'Hinjewadi IT Phase 1', distance: '3.5 km', type: 'highway' },
      { title: 'Proposed Hinjewadi Metro Station', distance: '2.0 km', type: 'metro' },
      { title: 'Aditya Birla Memorial Hospital', distance: '5.0 km', type: 'hospital' },
      { title: 'Indira National School', distance: '2.5 km', type: 'school' }
    ],
    postedBy: {
      name: 'Suresh Patil (Direct Landowner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Prime East-facing residential NA plot in an upscale gated community. Ideal for constructing your custom private villa with lush gardens. 100% clean documentation with spot registration and immediate demarcation.',
    createdAt: '2026-03-12'
  },
  {
    id: 'prop-10',
    title: '4 BHK Luxury Hilltop Villa in Jubilee Hills',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Hyderabad',
    locality: 'Jubilee Hills, Road No. 36',
    address: 'Emerald Crest Heights, Road No. 36, Jubilee Hills, Hyderabad - 500033',
    price: 52000000,
    priceDisplay: '₹ 5.20 Cr',
    pricePerSqFt: 11555,
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    areaSqFt: 4500,
    carpetAreaSqFt: 3950,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: 'G + 2 Independent Villa',
    reraId: 'P02400003891',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Temperature Controlled Pool',
      'Landscaped Rooftop Deck',
      'Home Cinema Automation Suite',
      '24x7 Armed Guard Security',
      'Servant Quarters with Separate Entrance',
      'Solar Rooftop Grid with Net Metering'
    ],
    localityHighlights: [
      { title: 'HITEC City Cyber Towers', distance: '4.5 km', type: 'highway' },
      { title: 'Jubilee Hills Check Post Metro', distance: '1.2 km', type: 'metro' },
      { title: 'Apollo Hospital Jubilee Hills', distance: '2.0 km', type: 'hospital' },
      { title: 'Oakridge International School', distance: '3.8 km', type: 'school' }
    ],
    postedBy: {
      name: 'K. Rama Rao (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Grand architectural triplex villa in Hyderabad’s most prestigious residential enclave. Expansive double-height living room, Italian marble finishes, private plunge pool, and lush manicured gardens.',
    createdAt: '2026-03-22'
  },
  {
    id: 'prop-11',
    title: '3 BHK Sea-Facing High-Rise at ECR Coastal Corridor',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Chennai',
    locality: 'East Coast Road (ECR), Thiruvanmiyur',
    address: 'Bayview Grand Oceanics, ECR, Chennai - 600041',
    price: 24500000,
    priceDisplay: '₹ 2.45 Cr',
    pricePerSqFt: 10652,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 2300,
    carpetAreaSqFt: 1950,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Furnished',
    facing: 'East',
    floor: '14th of 22 Floors',
    reraId: 'TN/29/Building/0192/2026',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Unobstructed Bay of Bengal Ocean View',
      'Infinity Rooftop Pool',
      'Squash Court & Technogym Fitness Club',
      '2 Reserved Basement Car Parks',
      'Full 100% Power Backup'
    ],
    localityHighlights: [
      { title: 'Thiruvanmiyur Beach & Promenade', distance: '400 m', type: 'highway' },
      { title: 'Tidel Park & OMR IT Corridor', distance: '2.5 km', type: 'highway' },
      { title: 'Fortis Malar Hospital', distance: '3.0 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Casagrand Alliance Desk',
      type: 'Builder',
      phone: '+91 8383826205'
    },
    description: 'Breathtaking ocean-front residence with panoramic views of the Bay of Bengal. Premium teakwood joinery, modular kitchen, and world-class luxury amenities on the scenic ECR corridor.',
    createdAt: '2026-03-23'
  },
  {
    id: 'prop-12',
    title: '3 BHK Heritage Luxury Apartment in Alipore',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Kolkata',
    locality: 'Alipore Avenue',
    address: 'The Royal Sovereign, Alipore Road, Kolkata - 700027',
    price: 31000000,
    priceDisplay: '₹ 3.10 Cr',
    pricePerSqFt: 12400,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 2500,
    carpetAreaSqFt: 2100,
    status: 'Ready to Move',
    possession: 'Immediate',
    furnishing: 'Semi-Furnished',
    facing: 'South-East',
    floor: '8th of 18 Floors',
    reraId: 'WBRERA/P/KOL/2026/000412',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private High-Speed Elevator Lobby',
      'Clubhouse with Temperature Pool',
      'Lush Central Landscaped Lawn',
      '2 Dedicated Covered Car Parks',
      'Multi-tier 24x7 Security'
    ],
    localityHighlights: [
      { title: 'Taj Bengal & Zoological Gardens', distance: '1.0 km', type: 'mall' },
      { title: 'Rabindra Sadan Metro Station', distance: '2.2 km', type: 'metro' },
      { title: 'BM Birla Heart Research Centre', distance: '800 m', type: 'hospital' }
    ],
    postedBy: {
      name: 'Mani Group Property Desk',
      type: 'Agent',
      phone: '+91 8383826205'
    },
    description: 'Aristocratic living in the greenest and most prestigious neighborhood of Kolkata. Spacious rooms with expansive balconies overlooking royal heritage bungalows and gardens.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-13',
    title: '4 BHK Grand Bunglow Villa with Private Lawn',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Ahmedabad',
    locality: 'SG Highway, Bodakdev',
    address: 'Shivalik Greenwoods, Bodakdev, Ahmedabad - 380054',
    price: 38000000,
    priceDisplay: '₹ 3.80 Cr',
    pricePerSqFt: 9500,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    areaSqFt: 4000,
    carpetAreaSqFt: 3500,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: 'G + 2 Independent Villa',
    reraId: 'PR/GJ/AHMEDABAD/2026/00119',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private 800 Sq.Ft Manicured Green Lawn',
      'Double Height Grand Living Hall',
      'Clubhouse with Indoor Badminton Court',
      '3 Dedicated Covered Car Parks',
      '24x7 Security & Power Backup'
    ],
    localityHighlights: [
      { title: 'SG Highway Arterial Junction', distance: '1.2 km', type: 'highway' },
      { title: 'Thaltej Metro Station', distance: '2.0 km', type: 'metro' },
      { title: 'Zydus Hospital SG Highway', distance: '1.8 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Bhavesh Patel (Direct Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Ultra-spacious independent luxury villa situated in prime Bodakdev near SG Highway. Clean title, high-end Italian tiles, modular kitchen, and peaceful green surroundings.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-14',
    title: '3 BHK Sea-View Luxury Apartment for Rent in Bandra West',
    category: 'rent',
    propertyType: 'Luxury Apartment',
    city: 'Mumbai',
    locality: 'Carter Road, Bandra West',
    address: 'Seabreeze Heights, 11th Floor, Carter Road, Bandra West, Mumbai - 400050',
    price: 185000,
    priceDisplay: '₹ 1.85 L/mo',
    pricePerSqFt: 102,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1800,
    carpetAreaSqFt: 1550,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'West',
    floor: '11th of 20 Floors',
    reraId: 'P51900029311',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Arabian Sea Sunset Panorama',
      'Designer Fully Furnished Interior',
      'Italian Marble & Central AC',
      '2 Dedicated Stilt Car Parking',
      'Gymnasium & Swimming Pool Access',
      'Zero Brokerage Lease'
    ],
    localityHighlights: [
      { title: 'Carter Road Promenade', distance: '100 m', type: 'highway' },
      { title: 'Bandra-Worli Sea Link', distance: '3.5 km', type: 'highway' },
      { title: 'Lilavati Hospital', distance: '2.0 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Rohan Mehta (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Fully furnished sea-facing residence on Carter Road in Bandra West. Unobstructed Arabian Sea breeze, designer Italian furnishings, and immediate lease with zero brokerage fees.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-15',
    title: '4 BHK Grand Independent Villa in Juhu Scheme',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Mumbai',
    locality: 'JVPD Scheme, Juhu',
    address: 'Gulmohar Enclave, 10th Cross, JVPD Scheme, Juhu, Mumbai - 400049',
    price: 145000000,
    priceDisplay: '₹ 14.50 Cr',
    pricePerSqFt: 30208,
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    areaSqFt: 4800,
    carpetAreaSqFt: 4100,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Furnished',
    facing: 'North-East',
    floor: 'G + 2 Independent Villa with Lift',
    reraId: 'P51800041920',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Terrace Swimming Pool',
      'Private Glass Elevator',
      '3 SUV Covered Car Parking',
      'Italian Modular Kitchen',
      'Home Automation & VRV Air Conditioning'
    ],
    localityHighlights: [
      { title: 'Juhu Beach Promenade', distance: '800 m', type: 'highway' },
      { title: 'Nanavati Super Speciality Hospital', distance: '1.5 km', type: 'hospital' },
      { title: 'Mumbai Domestic Airport', distance: '15 mins', type: 'airport' }
    ],
    postedBy: {
      name: 'Sunil Shroff (Direct Rep)',
      type: 'Agent',
      phone: '+91 8383826205'
    },
    description: 'An elite bespoke independent villa in the heart of Mumbai’s celebrity neighborhood Juhu JVPD. Features ultra-luxury fittings, private terrace pool, and crystal clear legal documentation.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-16',
    title: '3 BHK High-End Furnished Flat for Rent in Indiranagar',
    category: 'rent',
    propertyType: 'Apartment',
    city: 'Bangalore',
    locality: '100 Feet Road, Indiranagar',
    address: 'Indraprastha Regal, 100 Ft Rd, Indiranagar, Bangalore - 560038',
    price: 95000,
    priceDisplay: '₹ 95,000/mo',
    pricePerSqFt: 45,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 2100,
    carpetAreaSqFt: 1800,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'East',
    floor: '4th of 8 Floors',
    reraId: 'PRM/KA/RERA/2026/00192',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Walking Distance to Metro Station',
      'Fully Furnished Designer Decor',
      '100% Power Backup',
      '2 Dedicated Covered Car Parks',
      'Clubhouse & Gymnasium'
    ],
    localityHighlights: [
      { title: 'Indiranagar Metro Station', distance: '400 m', type: 'metro' },
      { title: 'Manipal Hospital HAL Airport Rd', distance: '2.0 km', type: 'hospital' },
      { title: 'Embassy GolfLinks Tech Park', distance: '3.0 km', type: 'highway' }
    ],
    postedBy: {
      name: 'Naveen Kumar (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Prime luxury rental apartment on 100 Feet Road in Indiranagar. Tastefully furnished with teakwood sofas, king-size beds, appliances, and high-speed Wi-Fi readiness.',
    createdAt: '2026-03-23'
  },
  {
    id: 'prop-17',
    title: '4 BHK Beachside Designer Villa in ECR',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Chennai',
    locality: 'Injambakkam, East Coast Road',
    address: 'Coromandel Coastal Sanctuary, ECR, Injambakkam, Chennai - 600115',
    price: 39000000,
    priceDisplay: '₹ 3.90 Cr',
    pricePerSqFt: 9285,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 4200,
    carpetAreaSqFt: 3600,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: 'G + 2 Independent Villa with Lawn',
    reraId: 'TN/01/Building/2026/0041',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Direct Private Beach Access Path',
      'Private Swimming Pool',
      'Tropical Landscaped Lawn',
      'Double Height Ceiling Hall',
      'Solar Powered Backup'
    ],
    localityHighlights: [
      { title: 'Injambakkam Beach Walk', distance: '250 m', type: 'highway' },
      { title: 'OMR Sholinganallur Tech Hub', distance: '5.0 km', type: 'highway' },
      { title: 'Apollo Speciality Hospital OMR', distance: '4.5 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Venkatesh S (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Sensational coastal villa on the golden beaches of ECR in Chennai. Boasts an infinity plunge pool, sprawling master suites, and direct beach access pathway.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-18',
    title: '3 BHK Sea-View Coastal Apartment for Rent in Adyar',
    category: 'rent',
    propertyType: 'Apartment',
    city: 'Chennai',
    locality: 'Gandhi Nagar, Adyar',
    address: 'Adyar Gateway, Gandhi Nagar 1st Main, Adyar, Chennai - 600020',
    price: 75000,
    priceDisplay: '₹ 75,000/mo',
    pricePerSqFt: 39,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1900,
    carpetAreaSqFt: 1600,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'East',
    floor: '7th of 14 Floors',
    reraId: 'TN/01/Building/2026/0088',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Bespoke Teakwood Furniture',
      'Modular Kitchen with Chimney',
      'Clubhouse & Swimming Pool',
      '2 Covered Car Parking',
      '24x7 Security & Intercom'
    ],
    localityHighlights: [
      { title: 'Adyar Bus Terminus / MRTS', distance: '800 m', type: 'metro' },
      { title: 'IIT Madras Campus Gate', distance: '1.5 km', type: 'school' },
      { title: 'Fortis Malar Hospital', distance: '1.2 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Priya Sundaram (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Immaculately maintained 3 BHK furnished apartment in peaceful Adyar. Very close to OMR IT corridor, hospitals, and premier schools.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-19',
    title: '3 BHK Ultra-Luxury Serviced Floor for Rent in DLF Phase 5',
    category: 'rent',
    propertyType: 'Independent Floor',
    city: 'Delhi NCR',
    locality: 'DLF Phase 5, Gurugram',
    address: 'DLF Park Place, Sector 54, Gurugram, Haryana - 122002',
    price: 120000,
    priceDisplay: '₹ 1.20 L/mo',
    pricePerSqFt: 50,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 3,
    areaSqFt: 2400,
    carpetAreaSqFt: 2050,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'North-East',
    floor: '9th of 25 Floors',
    reraId: 'HRERA-PKL-GGM-2026/012',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'DLF Golf Course Views',
      'Fully Furnished Luxury Decor',
      'Clubhouse with Olympic Size Pool',
      '2 Covered Basement Parking',
      'Direct Elevator Access'
    ],
    localityHighlights: [
      { title: 'One Horizon Center / DLF Cyber Hub', distance: '1.5 km', type: 'highway' },
      { title: 'Sector 54 Rapid Metro', distance: '500 m', type: 'metro' },
      { title: 'Fortis Memorial Hospital', distance: '4.0 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Vikas Aggarwal (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Ultra-luxurious fully furnished 3 BHK serviced residence in DLF Phase 5, Gurugram. Breathtaking views of the DLF Golf Course, imported marble flooring, and ready to move in.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-20',
    title: '3 BHK High-Rise Flat for Rent in Baner IT Corridor',
    category: 'rent',
    propertyType: 'Apartment',
    city: 'Pune',
    locality: 'Baner - Balewadi High Street',
    address: 'Supreme Pallacio, Balewadi High St, Baner, Pune - 411045',
    price: 48000,
    priceDisplay: '₹ 48,000/mo',
    pricePerSqFt: 30,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1600,
    carpetAreaSqFt: 1350,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'East',
    floor: '8th of 16 Floors',
    reraId: 'P52100028910',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Balewadi High Street Walkability',
      'Fully Furnished Interior',
      'Swimming Pool & Gym',
      '1 Reserved Covered Parking',
      '24x7 Security'
    ],
    localityHighlights: [
      { title: 'Balewadi High Street Cafes', distance: '300 m', type: 'mall' },
      { title: 'Hinjewadi IT Hub Phase 1', distance: '6.5 km', type: 'highway' },
      { title: 'Jupiter Hospital Baner', distance: '2.0 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Sachin Kulkarni (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Fully furnished 3 BHK home in Baner with high quality wood work, modular kitchen with chimney, ACs installed in all rooms, and zero brokerage.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-21',
    title: '3 BHK Lake-View High-Rise for Rent in Gachibowli',
    category: 'rent',
    propertyType: 'Apartment',
    city: 'Hyderabad',
    locality: 'Financial District, Gachibowli',
    address: 'My Home Bhooja, Financial District, Gachibowli, Hyderabad - 500032',
    price: 68000,
    priceDisplay: '₹ 68,000/mo',
    pricePerSqFt: 31,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 2200,
    carpetAreaSqFt: 1850,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'North-East',
    floor: '16th of 35 Floors',
    reraId: 'P02400001029',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Walking Distance to Tech Companies (Google/Microsoft)',
      'Lake View from Balcony',
      'Clubhouse & Temperature Pool',
      '2 Dedicated Basement Parking',
      'Zero Brokerage Lease'
    ],
    localityHighlights: [
      { title: 'Wipro Circle / Financial District', distance: '800 m', type: 'highway' },
      { title: 'Continental Hospitals', distance: '1.2 km', type: 'hospital' },
      { title: 'ORR Exit 1', distance: '1.0 km', type: 'highway' }
    ],
    postedBy: {
      name: 'Anand Reddy (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Luxury high-floor apartment in Hyderabad’s prime Financial District. Unobstructed lake view, modern Italian furniture, and immediate possession.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-22',
    title: '3 BHK Ganga-View Penthouse for Rent in Varanasi',
    category: 'rent',
    propertyType: 'Penthouse',
    city: 'Varanasi',
    locality: 'Ravindrapuri - Bhelupur Corridor',
    address: 'Ganga Kripa Heights, Ravindrapuri Extension, Varanasi - 221005',
    price: 36000,
    priceDisplay: '₹ 36,000/mo',
    pricePerSqFt: 20,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1800,
    carpetAreaSqFt: 1550,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'East',
    floor: '6th of 6 Floors with Private Terrace',
    reraId: 'UPRERAPRJ2026/041',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Holy River Ganga View from Terrace',
      'Private Terrace Garden',
      'Fully Furnished Living',
      'Lift with Power Backup',
      'Covered Car Parking'
    ],
    localityHighlights: [
      { title: 'Assi Ghat', distance: '1.2 km', type: 'highway' },
      { title: 'Banaras Hindu University (BHU)', distance: '1.8 km', type: 'school' },
      { title: 'Heritage Hospital Lanka', distance: '2.0 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Rameshwar Nath (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Serene Ganga-view penthouse in Ravindrapuri with private terrace garden. Peaceful spiritual environment, close to Assi Ghat and BHU campus with zero brokerage.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-23',
    title: '3 BHK High-Rise Apartment for Rent in Gomti Nagar Ext',
    category: 'rent',
    propertyType: 'Apartment',
    city: 'Lucknow',
    locality: 'Shaheed Path, Gomti Nagar Extension',
    address: 'Omaxe Residency 2, Sector 7, Gomti Nagar Ext, Lucknow - 226010',
    price: 35000,
    priceDisplay: '₹ 35,000/mo',
    pricePerSqFt: 21,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1650,
    carpetAreaSqFt: 1400,
    status: 'Ready to Move',
    possession: 'Immediate Occupancy',
    furnishing: 'Furnished',
    facing: 'North-East',
    floor: '10th of 18 Floors',
    reraId: 'UPRERAPRJ2026/092',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Direct View of Ekana International Stadium',
      'Fully Furnished Modular Setup',
      'Clubhouse with Swimming Pool',
      '1 Reserved Stilt Parking',
      'Gated Security'
    ],
    localityHighlights: [
      { title: 'Ekana Stadium / Phoenix Palassio Mall', distance: '1.0 km', type: 'mall' },
      { title: 'Shaheed Path Arterial Ring', distance: '400 m', type: 'highway' },
      { title: 'Medanta Super Specialty Hospital', distance: '4.5 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Gaurav Srivastava (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Modern 3 BHK apartment in Gomti Nagar Extension on Shaheed Path. Furnished with ACs, TV, beds, and modular kitchen. Zero brokerage.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-24',
    title: '4 BHK DLF Golf Course Luxury Villa with Private Garden',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Gurgaon',
    locality: 'Golf Course Road, Sector 42',
    address: 'DLF Magnolias, Golf Course Road, Sector 42, Gurugram, Haryana - 122002',
    price: 85000000,
    priceDisplay: '₹ 8.50 Cr',
    pricePerSqFt: 15454,
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    areaSqFt: 5500,
    carpetAreaSqFt: 4800,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: 'Independent G+2 Luxury Villa',
    reraId: 'HRERA-PKL-GGM-124-2026',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Landscaped Lawn',
      'DLF Golf Course Frontage',
      'Italian Marble Flooring',
      'Triple Height Lobby',
      '3 Dedicated Car Parks'
    ],
    localityHighlights: [
      { title: 'Sector 42 Rapid Metro Station', distance: '400 m', type: 'metro' },
      { title: 'Cyber Hub Entertainment & Mall', distance: '3.5 km', type: 'mall' },
      { title: 'Fortis Memorial Hospital', distance: '2.8 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Kamlesh Singhania (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Premier 4 BHK luxury villa in Gurugram on Golf Course Road. Panoramic golf views, private swimming plunge, and verified zero brokerage documentation.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-25',
    title: '3 BHK High-Rise Golf Residence with Panoramic Balcony',
    category: 'buy',
    propertyType: 'Luxury Apartment',
    city: 'Noida',
    locality: 'Sector 150, Noida-Greater Noida Expressway',
    address: 'ATS Pristine, Sector 150, Noida Expressway, Uttar Pradesh - 201310',
    price: 18500000,
    priceDisplay: '₹ 1.85 Cr',
    pricePerSqFt: 8222,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 3,
    areaSqFt: 2250,
    carpetAreaSqFt: 1950,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: '18th of 26 Floors',
    reraId: 'UPRERAPRJ2875/2026',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Expressway Frontage',
      'Clubhouse & Olympic Pool',
      'Sports Arena & 9-Hole Golf',
      'High-Speed Elevators',
      'Double Basement Parking'
    ],
    localityHighlights: [
      { title: 'Sector 148 Aqua Line Metro', distance: '1.2 km', type: 'metro' },
      { title: 'Jewar International Airport Corridor', distance: '22 km', type: 'airport' },
      { title: 'Noida Expressway', distance: '200 m', type: 'highway' }
    ],
    postedBy: {
      name: 'Sunil Mathur (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Breathtaking 3 BHK apartment in Noida Sector 150 eco-hub. Greenest sector in NCR, low density development, corner unit with triple balconies.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-26',
    title: '3 BHK Lake-Facing Premium Flat in Hiranandani Estate',
    category: 'buy',
    propertyType: 'Luxury Apartment',
    city: 'Thane',
    locality: 'Ghodbunder Road, Hiranandani Estate',
    address: 'Rodas Enclave, Hiranandani Estate, Ghodbunder Road, Thane West - 400607',
    price: 24500000,
    priceDisplay: '₹ 2.45 Cr',
    pricePerSqFt: 15312,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1600,
    carpetAreaSqFt: 1320,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: '14th of 28 Floors',
    reraId: 'P51700000412/2026',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Neoclassical Architecture',
      'Upvan Lake & Hill View',
      'The House of Hiranandani Club',
      '24/7 Security & Video Intercom',
      'Covered Reserved Parking'
    ],
    localityHighlights: [
      { title: 'Ghodbunder Highway', distance: '300 m', type: 'highway' },
      { title: 'Viviana Mall', distance: '4.2 km', type: 'mall' },
      { title: 'Jupiter Hospital Thane', distance: '4.5 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Pooja Sawant (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Elegant 3 BHK apartment in Hiranandani Estate Thane. Peaceful surroundings, open views of Yeoor Hills and lake, ready for immediate family occupancy.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-27',
    title: '4 BHK Luxury Designer Builder Floor with Stilt Parking',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Delhi',
    locality: 'Greater Kailash Part 2 (GK-2)',
    address: 'M-Block Enclave, Greater Kailash 2, South Delhi, New Delhi - 110048',
    price: 49500000,
    priceDisplay: '₹ 4.95 Cr',
    pricePerSqFt: 18333,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 2700,
    carpetAreaSqFt: 2350,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: '2nd Floor with Dedicated Lift',
    reraId: 'DLRERA2026/089',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Lift Access',
      'Stilt Car Parking for 2 Cars',
      'Italian Modular Kitchen',
      'Wide Road Corner Plot',
      '100% Power Backup'
    ],
    localityHighlights: [
      { title: 'Greater Kailash Metro Station (Magenta Line)', distance: '600 m', type: 'metro' },
      { title: 'M-Block Market GK-2', distance: '300 m', type: 'mall' },
      { title: 'Max Super Specialty Hospital Saket', distance: '3.8 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Vikramjit Sahni (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Pristine 4 BHK builder floor in South Delhi GK-2. Wide avenue, private high-speed lift, imported fixtures, and fully verified title deeds.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-28',
    title: '3 BHK High-Rise Flat with Eco-Park View in New Town',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Kolkata',
    locality: 'Action Area II, New Town',
    address: 'Uniworld City Gardens, Action Area II, New Town, Kolkata - 700156',
    price: 13500000,
    priceDisplay: '₹ 1.35 Cr',
    pricePerSqFt: 7500,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1800,
    carpetAreaSqFt: 1520,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'South-East',
    floor: '12th of 24 Floors',
    reraId: 'WBRERA/P/NOR/2026/000219',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Eco Park Lake Vista',
      'Olympic-Sized Swimming Pool',
      'Tennis & Badminton Courts',
      'Solar Power Lighting',
      'Covered Basement Parking'
    ],
    localityHighlights: [
      { title: 'Eco Park & Lake Expressway', distance: '800 m', type: 'highway' },
      { title: 'Sector V Metro Corridor', distance: '2.5 km', type: 'metro' },
      { title: 'Kolkata Airport (CCU)', distance: '8.5 km', type: 'airport' }
    ],
    postedBy: {
      name: 'Subhashish Roy (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Bright and airy 3 BHK apartment in New Town Action Area II. Peaceful green views, gated township with club facilities, and 100% zero brokerage.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-29',
    title: '4 BHK Luxury Bungalow on Sindhu Bhavan Main Road',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Ahmedabad',
    locality: 'Sindhu Bhavan Road, Bodakdev',
    address: 'Shilp Shaligram Enclave, Sindhu Bhavan Road, Ahmedabad - 380054',
    price: 42000000,
    priceDisplay: '₹ 4.20 Cr',
    pricePerSqFt: 11052,
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    areaSqFt: 3800,
    carpetAreaSqFt: 3300,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: 'G+2 Independent Bungalow',
    reraId: 'PR/GJ/AHMEDABAD/2026/092',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Landscaped Lawn',
      'Double Height Living Room',
      'Bespoke Wooden Flooring',
      '2 Dedicated Covered Car Parks',
      '24/7 Security Enclave'
    ],
    localityHighlights: [
      { title: 'Sindhu Bhavan Road Promenade', distance: '150 m', type: 'highway' },
      { title: 'S.G. Highway Junction', distance: '1.2 km', type: 'highway' },
      { title: 'Zydus Super Specialty Hospital', distance: '3.2 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Pragnesh Patel (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Prestigious 4 BHK independent luxury bungalow on prime Sindhu Bhavan Road. Elite neighborhood, private garden, top quality construction with clear title deeds.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-30',
    title: '3 BHK Seawoods Grand Palm Beach Coastal Residence',
    category: 'buy',
    propertyType: 'Luxury Apartment',
    city: 'Navi Mumbai',
    locality: 'Palm Beach Road, Seawoods',
    address: 'Seawoods Grand Towers, Sector 40, Palm Beach Road, Navi Mumbai - 400706',
    price: 21500000,
    priceDisplay: '₹ 2.15 Cr',
    pricePerSqFt: 12647,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1700,
    carpetAreaSqFt: 1420,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'West',
    floor: '16th of 26 Floors with Sea View',
    reraId: 'P52000021456/2026',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Flamingo Sanctuary & Sea View',
      'Infinity Rooftop Pool',
      'Direct Skywalk to Grand Central Mall',
      'Covered Multi-Level Parking',
      'Clubhouse with Gymnasium'
    ],
    localityHighlights: [
      { title: 'Seawoods Railway Station & Mall', distance: '100 m', type: 'metro' },
      { title: 'Palm Beach Coastal Highway', distance: '200 m', type: 'highway' },
      { title: 'Apollo Hospital Navi Mumbai', distance: '3.5 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Ashok Deshmukh (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Iconic 3 BHK coastal apartment on Palm Beach Road, Seawoods. Direct sea view, integrated transit living, zero brokerage verification.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-pry-1',
    title: '4 BHK Luxury Independent Bungalow in Civil Lines',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Prayagraj',
    locality: 'Civil Lines',
    address: 'Near High Court & Elgin Road, Civil Lines, Prayagraj - 211001',
    price: 26500000,
    priceDisplay: '₹ 2.65 Cr',
    pricePerSqFt: 7571,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 3500,
    carpetAreaSqFt: 2980,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: 'G + 1 Independent Bungalow',
    reraId: 'UPRERA/PRJ/2024/09121',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Landscaped Lawn & Courtyard',
      '24x7 Ganga Water Supply & RO',
      'Double Covered Car Porch',
      '100% Power Inverter/DG Backup',
      'Wide 40-ft Road Frontage'
    ],
    localityHighlights: [
      { title: 'Allahabad High Court', distance: '800 m', type: 'mall' },
      { title: 'Civil Lines Central Market', distance: '500 m', type: 'mall' },
      { title: 'Prayagraj Junction Railway Station', distance: '1.8 km', type: 'metro' }
    ],
    postedBy: {
      name: 'Advocate V. K. Srivastava (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Rare heritage style modern 4 BHK bungalow in prime Civil Lines, Prayagraj. Fully clear title, freehold land, direct deal with owner without brokerage.',
    createdAt: '2026-03-26'
  },
  {
    id: 'prop-pry-2',
    title: '3 BHK River-Facing Premium Flat in Sangam Vihar',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Prayagraj',
    locality: 'Sangam Vihar / Jhunsi',
    address: 'Triveni Tower, New Yamuna Bridge Link Road, Prayagraj - 211019',
    price: 8800000,
    priceDisplay: '₹ 88.0 Lac',
    pricePerSqFt: 5333,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 1650,
    carpetAreaSqFt: 1350,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: '8th of 14 Floors',
    reraId: 'UPRERA/PRJ/2023/04481',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Panoramic Triveni Sangam River View',
      'Rooftop Clubhouse & Gym',
      'Automatic High Speed Elevators',
      'Reserved Basement Parking',
      '24x7 Multi-tier Security'
    ],
    localityHighlights: [
      { title: 'New Yamuna Cable Bridge', distance: '1.2 km', type: 'highway' },
      { title: 'Triveni Sangam Ghat', distance: '2.5 km', type: 'highway' },
      { title: 'IIIT Allahabad', distance: '4.0 km', type: 'school' }
    ],
    postedBy: {
      name: 'Rameshwar Tripathi (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Breathtaking sunrise river views overlooking Sangam. Modern 3 BHK apartment with modular fittings and verified RERA certificate.',
    createdAt: '2026-03-24'
  },
  {
    id: 'prop-pry-3',
    title: 'Spacious 2 BHK Furnished Family Flat for Rent in Ashok Nagar',
    category: 'rent',
    propertyType: 'Apartment',
    city: 'Prayagraj',
    locality: 'Ashok Nagar',
    address: 'Near Company Bagh & Allahabad University, Ashok Nagar, Prayagraj - 211002',
    price: 24000,
    priceDisplay: '₹ 24,000 / mo',
    pricePerSqFt: 20,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    areaSqFt: 1200,
    carpetAreaSqFt: 1050,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Furnished',
    facing: 'North',
    floor: '2nd of 4 Floors',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Air Conditioners in All Rooms',
      'Modular Kitchen with Chimney & RO',
      'Geyser & High Speed Fiber Wi-Fi',
      'Reserved Stilt Car Parking',
      'Gated Colony with Guard'
    ],
    localityHighlights: [
      { title: 'Chandrashekhar Azad Park (Company Bagh)', distance: '400 m', type: 'mall' },
      { title: 'Allahabad University Central Campus', distance: '1.0 km', type: 'school' },
      { title: 'Civil Lines Bus Terminus', distance: '1.5 km', type: 'metro' }
    ],
    postedBy: {
      name: 'Sunil Pathak (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Peaceful green locality close to Company Bagh. Ideal for families and professionals. Zero brokerage, transparent rent agreement.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-lko-3',
    title: '4 BHK Grand Villa in Gomti Nagar Extension',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Lucknow',
    locality: 'Gomti Nagar Extension',
    address: 'Sector 7, Near Shaheed Path & Ekana Stadium, Lucknow - 226010',
    price: 21500000,
    priceDisplay: '₹ 2.15 Cr',
    pricePerSqFt: 7166,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 3000,
    carpetAreaSqFt: 2550,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: 'G + 2 Independent Villa',
    reraId: 'UPRERA/PRJ/2023/07812',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Terrace Garden',
      'Italian Marble Flooring',
      'Double Car Covered Garage',
      'Gated Community with 24x7 CCTV',
      'Solar Water Heater System'
    ],
    localityHighlights: [
      { title: 'Ekana International Cricket Stadium', distance: '1.2 km', type: 'mall' },
      { title: 'Shaheed Path Expressway', distance: '600 m', type: 'highway' },
      { title: 'Phoenix Palassio Mall', distance: '1.8 km', type: 'mall' }
    ],
    postedBy: {
      name: 'Syed Tariq (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Luxurious duplex villa in prime Gomti Nagar Extension. High ceilings, wide roads, and elite neighborhood. 100% verified Lucknow property.',
    createdAt: '2026-03-26'
  },
  {
    id: 'prop-vns-3',
    title: '3 BHK Heritage Villa near Sigra & Kashi Vishwanath Corridor',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Varanasi',
    locality: 'Sigra',
    address: 'Near Vidyapeeth Road & Sigra Stadium, Varanasi - 221002',
    price: 18500000,
    priceDisplay: '₹ 1.85 Cr',
    pricePerSqFt: 7708,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 2400,
    carpetAreaSqFt: 2050,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: 'G + 1 Independent House',
    reraId: 'UPRERA/PRJ/2024/01192',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Puja Hall & Courtyard',
      'Borewell & Municipal Water Line',
      'Wide Paved Driveway for 2 Cars',
      'Modular Teak Wood Kitchen',
      'Surveillance Security Cameras'
    ],
    localityHighlights: [
      { title: 'Sigra Sports Stadium', distance: '400 m', type: 'mall' },
      { title: 'Kashi Vishwanath Temple', distance: '2.8 km', type: 'mall' },
      { title: 'Varanasi Cantt Railway Station', distance: '1.5 km', type: 'metro' }
    ],
    postedBy: {
      name: 'Pandit Ananda Mishra (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Prestigious independent home in the cultural heart of Varanasi. Calm residential lane with quick access to Cantt and Godowlia.',
    createdAt: '2026-03-25'
  },
  {
    id: 'prop-noi-2',
    title: '3 BHK High-Rise Penthouse with Golf Course View',
    category: 'buy',
    propertyType: 'Penthouse',
    city: 'Noida',
    locality: 'Sector 128 (Noida Expressway)',
    address: 'Jaypee Greens Corridor, Sector 128, Noida Expressway - 201304',
    price: 32000000,
    priceDisplay: '₹ 3.20 Cr',
    pricePerSqFt: 11428,
    bedrooms: 3,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 2800,
    carpetAreaSqFt: 2350,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: '26th of 28 Floors',
    reraId: 'UPRERA/PRJ/2022/05934',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Panoramic 18-Hole Golf Course View',
      'Private Terrace Jacuzzi Provision',
      '3 Dedicated Basement Parking Bays',
      'Olympic Size Swimming Pool & Spa',
      'Direct Expressway Connectivity'
    ],
    localityHighlights: [
      { title: 'Noida-Greater Noida Expressway', distance: '200 m', type: 'highway' },
      { title: 'Jaypee Hospital', distance: '1.0 km', type: 'hospital' },
      { title: 'Sector 137 Metro Station', distance: '2.5 km', type: 'metro' }
    ],
    postedBy: {
      name: 'Rajat Singhal (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Iconic golf-facing luxury home on Noida Expressway. Double-height living room, floor-to-ceiling glass windows, and zero brokerage verified.',
    createdAt: '2026-03-26'
  },
  {
    id: 'prop-mirzapur-1',
    title: '3 BHK Ganga River-View Luxury Villa in Mirzapur',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Mirzapur',
    locality: 'Civil Lines / Vindhyachal Corridor',
    address: 'Vindhya Heritage Residency, Near Civil Lines, Mirzapur - 231001',
    price: 8500000,
    priceDisplay: '₹ 85 Lac',
    pricePerSqFt: 3863,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 2200,
    carpetAreaSqFt: 1850,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: 'G + 1 Independent Villa',
    reraId: 'UPRERAPRJ/MZP/2025/00881',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Ganga River View Balcony',
      'Private Landscaped Lawn',
      '24x7 Security & CCTV',
      'Covered Car Parking',
      'Water Harvesting & Solar Backup'
    ],
    localityHighlights: [
      { title: 'Vindhyachal Temple Corridor', distance: '4.5 km', type: 'highway' },
      { title: 'Mirzapur Railway Junction', distance: '2.1 km', type: 'metro' },
      { title: 'District Government Hospital', distance: '1.2 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Santosh Mishra (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Picturesque independent 3 BHK luxury villa with peaceful river view and private lawn in Mirzapur. Freehold property with 100% clear legal title, direct deal with owner without any brokerage fee.',
    createdAt: '2026-04-01'
  },
  {
    id: 'prop-bhadohi-1',
    title: '4 BHK Grand Independent Villa with Private Garden in Bhadohi',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Bhadohi',
    locality: 'Carpet City Enclave / Station Road',
    address: 'Royal Loom Estate, Near Bhadohi Railway Station, Bhadohi - 221401',
    price: 9200000,
    priceDisplay: '₹ 92 Lac',
    pricePerSqFt: 3538,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 2600,
    carpetAreaSqFt: 2200,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North-East',
    floor: 'G + 2 Independent Villa',
    reraId: 'UPRERAPRJ/BDH/2025/00742',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Expansive Rooftop Terrace & Garden',
      'Grand Double-Height Entrance Lobby',
      'Private 2-Car Covered Garage',
      '24 Hours Running Sweet Borewell Water',
      '100% Power Inverter Support'
    ],
    localityHighlights: [
      { title: 'Bhadohi Junction Railway Station', distance: '1.5 km', type: 'metro' },
      { title: 'Varanasi-Bhadohi 4-Lane Highway', distance: '800 m', type: 'highway' },
      { title: 'Indian Institute of Carpet Technology', distance: '2.0 km', type: 'school' }
    ],
    postedBy: {
      name: 'Vikas Baranwal (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Immaculately constructed 4 BHK independent duplex villa situated in the premier residential pocket of Bhadohi. Premium marble flooring, expansive terrace, high ceiling bedrooms, and zero brokerage.',
    createdAt: '2026-04-02'
  },
  {
    id: 'prop-jaunpur-1',
    title: '3 BHK Modern Duplex Villa near Line Bazar in Jaunpur',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Jaunpur',
    locality: 'Line Bazar / Olandganj Corridor',
    address: 'Gomti Green Residency, Near Line Bazar, Jaunpur - 222002',
    price: 7800000,
    priceDisplay: '₹ 78 Lac',
    pricePerSqFt: 3714,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    areaSqFt: 2100,
    carpetAreaSqFt: 1750,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North',
    floor: 'G + 1 Independent Duplex Villa',
    reraId: 'UPRERAPRJ/JNP/2025/00914',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Modular Kitchen with Chimney',
      'Gated Community with 24x7 Security',
      'Interlocking Wide Internal Roads',
      'Dedicated Car Parking Space',
      'Children Play Area'
    ],
    localityHighlights: [
      { title: 'Jaunpur Junction Railway Station', distance: '2.8 km', type: 'metro' },
      { title: 'Varanasi-Jaunpur Highway Toll Link', distance: '1.2 km', type: 'highway' },
      { title: 'TD College & University Circle', distance: '1.5 km', type: 'school' }
    ],
    postedBy: {
      name: 'Rameshwar Yadav (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Charming modern 3 BHK duplex villa in prime Line Bazar locality of Jaunpur. Near top schools, shopping centers, and easy 40-minute drive to Varanasi via national expressway. Direct deal with owner with zero brokerage.',
    createdAt: '2026-04-03'
  },
  {
    id: 'prop-mirzapur-2',
    title: '2 BHK Modern Lakeview Apartment in Civil Lines, Mirzapur',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Mirzapur',
    locality: 'Civil Lines',
    address: 'Shivalik Heights, Opp. Collectorate, Civil Lines, Mirzapur - 231001',
    price: 4200000,
    priceDisplay: '₹ 42 Lac',
    pricePerSqFt: 3500,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    areaSqFt: 1200,
    carpetAreaSqFt: 980,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: '3rd of 6 Floors',
    reraId: 'UPRERAPRJ/MZP/2025/00895',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Lift with Power Backup',
      'Covered Reserved Parking',
      '24x7 Security & CCTV Surveillance',
      'Continuous Municipal Water Supply',
      'Community Rooftop Terrace'
    ],
    localityHighlights: [
      { title: 'Collectorate & District Courts', distance: '500 m', type: 'metro' },
      { title: 'Mirzapur Main Market', distance: '1.0 km', type: 'mall' },
      { title: 'Mirzapur Railway Station', distance: '1.8 km', type: 'metro' }
    ],
    postedBy: {
      name: 'Anand Srivastava (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Well-ventilated 2 BHK apartment in prime Civil Lines Mirzapur. Clear legal title, lift, covered parking, and direct deal with owner with zero brokerage.',
    createdAt: '2026-04-05'
  },
  {
    id: 'prop-bhadohi-2',
    title: 'Prime Commercial Showroom & Office Space on Station Road, Bhadohi',
    category: 'commercial',
    propertyType: 'Commercial Office',
    city: 'Bhadohi',
    locality: 'Station Road / Carpet City Centre',
    address: 'Carpet Plaza, Station Road, Bhadohi - 221401',
    price: 9500000,
    priceDisplay: '₹ 95 Lac',
    pricePerSqFt: 5277,
    bedrooms: 0,
    bathrooms: 2,
    balconies: 1,
    areaSqFt: 1800,
    carpetAreaSqFt: 1600,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Unfurnished',
    facing: 'North-East',
    floor: 'Ground Floor Road-Facing',
    reraId: 'UPRERAPRJ/BDH/2025/00742',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Main Highway / Station Road Frontage',
      'High-Footfall Commercial Hub',
      'Dedicated Customer Parking',
      '3-Phase Industrial Power Connection',
      'Water Supply & Modern Washrooms'
    ],
    localityHighlights: [
      { title: 'Bhadohi Railway Junction', distance: '400 m', type: 'metro' },
      { title: 'Carpet Export Mart Complex', distance: '800 m', type: 'mall' },
      { title: 'National Highway Link', distance: '2.5 km', type: 'highway' }
    ],
    postedBy: {
      name: 'Mohammad Tariq (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'High visibility road-facing commercial showroom and office in heart of Bhadohi. Ideal for banks, retail brands, or carpet exporters. Zero brokerage direct sale.',
    createdAt: '2026-04-06'
  },
  {
    id: 'prop-jaunpur-2',
    title: '2 BHK Airy Residential Apartment near Olandganj, Jaunpur',
    category: 'buy',
    propertyType: 'Apartment',
    city: 'Jaunpur',
    locality: 'Olandganj / Poly Road',
    address: 'Shree Krishna Enclave, Olandganj, Jaunpur - 222002',
    price: 3800000,
    priceDisplay: '₹ 38 Lac',
    pricePerSqFt: 3454,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    areaSqFt: 1100,
    carpetAreaSqFt: 920,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'East',
    floor: '2nd of 5 Floors',
    reraId: 'UPRERAPRJ/JNP/2025/00938',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Modern High-Speed Elevator',
      '24-Hour Sweet Water Supply',
      'Intercom & Gated Security',
      'Bike and Car Covered Parking',
      'Rooftop Solar Lighting'
    ],
    localityHighlights: [
      { title: 'Olandganj Commercial Chowk', distance: '600 m', type: 'mall' },
      { title: 'Civil Hospital Jaunpur', distance: '1.2 km', type: 'hospital' },
      { title: 'Jaunpur City Railway Station', distance: '2.0 km', type: 'metro' }
    ],
    postedBy: {
      name: 'Vikas Singh (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Affordable and peaceful 2 BHK apartment in prime Olandganj, Jaunpur. Near markets and clinics, ready for instant possession with zero brokerage.',
    createdAt: '2026-04-06'
  },
  {
    id: 'prop-jaipur-1',
    title: '4 BHK Luxury Royal Villa in Vaishali Nagar, Jaipur',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Jaipur',
    locality: 'Vaishali Nagar',
    address: 'Pink City Grand Greens, Sector 4, Vaishali Nagar, Jaipur - 302021',
    price: 18500000,
    priceDisplay: '₹ 1.85 Cr',
    pricePerSqFt: 5781,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 3200,
    carpetAreaSqFt: 2750,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Furnished',
    facing: 'North-East',
    floor: 'Independent G+2 Villa',
    reraId: 'RAJ/RERA/2025/1102',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Private Landscaped Lawn & Courtyard',
      'Italian Marble Flooring',
      'Modular European Kitchen',
      'Dual Car Parking Garage',
      'Gated Community with 24x7 Security'
    ],
    localityHighlights: [
      { title: 'Vaishali Nagar Main Market', distance: '800 m', type: 'mall' },
      { title: 'Jaipur Junction Railway Station', distance: '5.5 km', type: 'metro' },
      { title: 'Ajmer Road Expressway', distance: '1.2 km', type: 'highway' }
    ],
    postedBy: {
      name: 'Rajendra Singh Rathore (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Magnificent 4 BHK luxury villa with private lawn in posh Vaishali Nagar Jaipur. Freehold JDA approved, zero brokerage direct owner deal.',
    createdAt: '2026-04-05'
  },
  {
    id: 'prop-chandigarh-1',
    title: '4 BHK Independent Duplex Kothi in Sector 8, Chandigarh',
    category: 'buy',
    propertyType: 'Villa',
    city: 'Chandigarh',
    locality: 'Sector 8 / Sukhna Lake Environs',
    address: 'Kothi 142, Sector 8-B, Chandigarh - 160009',
    price: 36000000,
    priceDisplay: '₹ 3.60 Cr',
    pricePerSqFt: 9000,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    areaSqFt: 4000,
    carpetAreaSqFt: 3400,
    status: 'Ready to Move',
    possession: 'Immediate Possession',
    furnishing: 'Semi-Furnished',
    facing: 'North',
    floor: 'Independent G+1 Kothi',
    reraId: 'CH/RERA/2025/0821',
    isVerified: true,
    isZeroBrokerage: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'
    ],
    amenities: [
      'Large Front Green Lawn with Fruit Trees',
      'Teak Wood Woodwork & Modern Fixtures',
      'Servant Quarters with Attached Bath',
      'Covered Driveway for 3 Cars',
      'Near Sukhna Lake & Sector 8 Market'
    ],
    localityHighlights: [
      { title: 'Sukhna Lake Promenade', distance: '1.2 km', type: 'highway' },
      { title: 'Sector 8 Inner Market & Cafes', distance: '400 m', type: 'mall' },
      { title: 'PGI & Punjab University', distance: '3.5 km', type: 'hospital' }
    ],
    postedBy: {
      name: 'Col. Jasbir Cheema (Retd.) (Owner)',
      type: 'Owner',
      phone: '+91 8383826205'
    },
    description: 'Premier independent 4 BHK kothi in prime Sector 8 Chandigarh. Peaceful tree-lined avenue, private lawns, 100% clear title, direct owner connect.',
    createdAt: '2026-04-06'
  }
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Rajesh Mehra',
    location: 'Bangalore',
    rating: 5,
    date: 'February 2026',
    title: 'Found our dream villa with zero brokerage headache!',
    comment: 'VillaSell completely changed how we bought our home. We contacted the owner directly through WhatsApp, scheduled a visit the next morning, and closed the paperwork in under 12 days. Kamlesh and team provided complete legal assistance throughout.',
    propertyBought: 'Purchased 4 BHK Villa in Sarjapur',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    verifiedBuyer: true
  },
  {
    id: 'rev-2',
    author: 'Dr. Sunita Sen',
    location: 'Mumbai',
    rating: 5,
    date: 'January 2026',
    title: 'Verified RERA details and honest pricing',
    comment: 'As a doctor with tight schedules, I could not waste time on misleading listings. The photos, carpet area, and RERA credentials on VillaSell matched 100% when we visited on ground. The EMI calculator was also spot-on with current bank rates.',
    propertyBought: 'Bought 3 BHK Luxury Apartment in Worli',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    verifiedBuyer: true
  },
  {
    id: 'rev-3',
    author: 'Amitava Banerjee',
    location: 'Varanasi',
    rating: 5,
    date: 'March 2026',
    title: 'Sold our duplex within 10 days of free listing',
    comment: 'I posted my family property on VillaSell using their simple 4-step form. Received genuine buyers directly calling my number (+91 8383826205 helpline was super supportive when I asked for verification). Top notch real estate portal!',
    propertyBought: 'Posted & Sold Duplex in Shivpur',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verifiedBuyer: true
  }
];

