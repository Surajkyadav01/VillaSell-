export type PropertyCategory = 'buy' | 'rent' | 'commercial' | 'plots';

export type PropertyType = 
  | 'Villa' 
  | 'Luxury Apartment' 
  | 'Apartment' 
  | 'Independent Floor' 
  | 'Penthouse' 
  | 'Commercial Office' 
  | 'Commercial Shop' 
  | 'Residential Plot';

export interface LocalityHighlight {
  title: string;
  distance: string;
  type: 'metro' | 'airport' | 'hospital' | 'school' | 'mall' | 'highway';
}

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  propertyType: PropertyType;
  city: string;
  locality: string;
  address: string;
  price: number; // in INR
  priceDisplay: string;
  pricePerSqFt: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  areaSqFt: number;
  carpetAreaSqFt: number;
  status: 'Ready to Move' | 'Under Construction' | 'Immediate';
  possession: string;
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  facing: 'North' | 'East' | 'North-East' | 'West' | 'South-East';
  floor: string;
  reraId?: string;
  isVerified: boolean;
  isZeroBrokerage: boolean;
  isFeatured: boolean;
  images: string[];
  amenities: string[];
  localityHighlights: LocalityHighlight[];
  postedBy: {
    name: string;
    type: 'Owner' | 'Agent' | 'Builder';
    phone: string;
  };
  description: string;
  createdAt: string;
}

export interface SearchFilterState {
  category: PropertyCategory | 'all';
  city: string;
  keyword: string;
  bhk: string; // 'all' | '1' | '2' | '3' | '4+'
  budgetRange: string; // 'all' | 'under-50l' | '50l-1cr' | '1cr-3cr' | 'above-3cr'
  propertyType: string; // 'all' | PropertyType
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  propertyBought: string;
  avatarUrl: string;
  verifiedBuyer: boolean;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  role: 'Buyer' | 'Owner' | 'Agent';
  avatar?: string;
  city?: string;
}

export type ActiveView = 
  | 'home' 
  | 'property-detail' 
  | 'post-property' 
  | 'shortlist' 
  | 'contact' 
  | 'privacy-policy' 
  | 'terms' 
  | 'rera-disclaimer' 
  | 'cookie-policy'
  | 'home-loan'
  | 'housing-premium'
  | 'emi-calculator'
  | 'property-valuation'
  | 'rent-receipt-generator'
  | 'city-properties';
