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
  videos?: string[];
  amenities: string[];
  localityHighlights: LocalityHighlight[];
  postedBy: {
    name: string;
    type: 'Owner' | 'Agent' | 'Builder';
    phone: string;
    email?: string;
    userId?: string;
  };
  description: string;
  createdAt: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  viewsCount?: number;
  inquiriesCount?: number;
  isSoldOrRented?: boolean;
  postedByEmail?: string;
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

export type UserRole = 'Buyer' | 'Agent' | 'Owner' | 'Admin';

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  email: string;
  role: 'Buyer' | 'Owner' | 'Agent' | 'Admin';
  avatar?: string;
  city?: string;
  agencyName?: string;
  licenseNumber?: string;
  pendingRoleSelection?: boolean;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  propertyPrice?: string;
  propertyCity?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'Closed';
  type: 'Site Visit' | 'Price Inquiry' | 'General';
  targetAgentEmail?: string;
  targetRole?: 'Agent' | 'Owner' | 'Admin';
}

export interface SiteVisit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  visitDate: string;
  timeSlot: string;
  agentName: string;
  agentPhone: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface SearchAlert {
  id: string;
  city: string;
  bhk: string;
  maxBudget: string;
  propertyType: string;
  createdDate: string;
  matchCount: number;
}

export interface BuyerRequirement {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  city: string;
  locality: string;
  propertyType: string;
  bhk: string;
  budgetRange: string;
  timeline: string;
  notes: string;
  postedDate: string;
  status: 'Active' | 'Fulfilled';
}

export interface AdminEmailNotification {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyCity: string;
  propertyLocality: string;
  propertyPrice: string;
  submittedBy: {
    name: string;
    phone: string;
    role: string;
  };
  adminEmail: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
  propertyThumbnail?: string;
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
  | 'city-properties'
  | 'dashboard'
  | 'admin-panel';
