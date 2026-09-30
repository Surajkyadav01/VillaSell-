import { PropertyInquiry, SiteVisit, SearchAlert, BuyerRequirement } from '../types/property';

export const INITIAL_INQUIRIES: PropertyInquiry[] = [
  {
    id: 'inq-101',
    propertyId: 'prop-1',
    propertyTitle: 'Prestige Golfshire Ultra Luxury Villa',
    propertyImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    propertyPrice: '₹ 8.50 Cr',
    propertyCity: 'Bangalore',
    userName: 'Vikramaditya Roy',
    userEmail: 'vikram.roy88@gmail.com',
    userPhone: '+91 98450 12345',
    message: 'Hello, I am interested in viewing this villa this weekend. Is the price negotiable for immediate bank transfer?',
    date: '2026-09-27 11:30 AM',
    status: 'New',
    type: 'Price Inquiry',
    targetAgentEmail: 'sales@villasell.com',
    targetRole: 'Owner'
  },
  {
    id: 'inq-102',
    propertyId: 'prop-2',
    propertyTitle: 'The Imperial Sky Penthouse with Sea View',
    propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    propertyPrice: '₹ 14.20 Cr',
    propertyCity: 'Mumbai',
    userName: 'Ananya Deshmukh',
    userEmail: 'ananya.deshmukh@tcs.com',
    userPhone: '+91 98201 98765',
    message: 'Requesting a private site visit on Sunday afternoon with my architect. Please share floor plans.',
    date: '2026-09-26 04:15 PM',
    status: 'Contacted',
    type: 'Site Visit',
    targetAgentEmail: 'rajesh.agent@villasell.com',
    targetRole: 'Agent'
  },
  {
    id: 'inq-103',
    propertyId: 'prop-4',
    propertyTitle: 'Sobha Dream Acres Garden Residence',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    propertyPrice: '₹ 1.25 Cr',
    propertyCity: 'Bangalore',
    userName: 'Rohan Sharma',
    userEmail: 'rohan.sharma@infosys.com',
    userPhone: '+91 99887 65432',
    message: 'Looking for a 2 BHK with East facing balcony. What is the current maintenance cost per sq ft?',
    date: '2026-09-25 02:40 PM',
    status: 'New',
    type: 'General',
    targetAgentEmail: 'rajesh.agent@villasell.com',
    targetRole: 'Agent'
  },
  {
    id: 'inq-104',
    propertyId: 'prop-7',
    propertyTitle: 'DLF The Camellias Ultra Luxury Residence',
    propertyImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    propertyPrice: '₹ 22.00 Cr',
    propertyCity: 'Delhi NCR',
    userName: 'Col. Rajeshwar Singh (Retd)',
    userEmail: 'rajeshwar.singh@defence.gov.in',
    userPhone: '+91 98110 54321',
    message: 'Interested in purchasing floor 18 or above. Need RERA certificates and possession timelines.',
    date: '2026-09-24 10:10 AM',
    status: 'Closed',
    type: 'Price Inquiry',
    targetAgentEmail: 'sales@villasell.com',
    targetRole: 'Owner'
  }
];

export const INITIAL_SITE_VISITS: SiteVisit[] = [
  {
    id: 'visit-1',
    propertyId: 'prop-1',
    propertyTitle: 'Prestige Golfshire Ultra Luxury Villa',
    propertyLocation: 'Nandi Hills, Bangalore',
    propertyImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
    visitDate: '2026-10-02',
    timeSlot: '11:00 AM - 12:30 PM',
    agentName: 'Sanjay Malhotra',
    agentPhone: '+91 83838 26205',
    status: 'Scheduled',
    notes: 'Agent will meet at Gate 1 with project brochure and layout map.'
  },
  {
    id: 'visit-2',
    propertyId: 'prop-4',
    propertyTitle: 'Sobha Dream Acres Garden Residence',
    propertyLocation: 'Panathur, Outer Ring Road, Bangalore',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    visitDate: '2026-09-30',
    timeSlot: '03:00 PM - 04:00 PM',
    agentName: 'Rajesh Verma (Verified Agent)',
    agentPhone: '+91 98765 43210',
    status: 'Scheduled',
    notes: 'Key handover preview with clubhouse tour.'
  },
  {
    id: 'visit-3',
    propertyId: 'prop-3',
    propertyTitle: 'Hiranandani Heritage Signature Suite',
    propertyLocation: 'Kandivali West, Mumbai',
    propertyImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    visitDate: '2026-09-18',
    timeSlot: '05:00 PM - 06:00 PM',
    agentName: 'Priya Nambiar',
    agentPhone: '+91 98200 11223',
    status: 'Completed',
    notes: 'Client reviewed master bedroom and car park space.'
  }
];

export const INITIAL_SEARCH_ALERTS: SearchAlert[] = [
  {
    id: 'alert-1',
    city: 'Bangalore',
    bhk: '3 BHK',
    maxBudget: '₹ 2.5 Cr',
    propertyType: 'Villa',
    createdDate: '2026-09-20',
    matchCount: 14
  },
  {
    id: 'alert-2',
    city: 'Mumbai',
    bhk: '2 BHK',
    maxBudget: '₹ 1.8 Cr',
    propertyType: 'Apartment',
    createdDate: '2026-09-22',
    matchCount: 8
  },
  {
    id: 'alert-3',
    city: 'Delhi NCR',
    bhk: '4+ BHK',
    maxBudget: '₹ 5.0 Cr',
    propertyType: 'Penthouse',
    createdDate: '2026-09-25',
    matchCount: 5
  }
];

export const INITIAL_BUYER_REQUIREMENTS: BuyerRequirement[] = [
  {
    id: 'req-1',
    userName: 'Kunal Singhania',
    userPhone: '+91 98334 11223',
    userEmail: 'kunal.singh@gmail.com',
    city: 'Bangalore',
    locality: 'Whitefield or Sarjapur Road',
    propertyType: 'Villa / Gated Villa',
    bhk: '4 BHK',
    budgetRange: '₹ 3.5 Cr - ₹ 5 Cr',
    timeline: 'Within 2 Months',
    notes: 'Prefer private garden and East facing main door. Ready to move or near completion.',
    postedDate: '2026-09-26',
    status: 'Active'
  },
  {
    id: 'req-2',
    userName: 'Dr. Meera Iyer',
    userPhone: '+91 98401 22334',
    userEmail: 'meera.iyer@apollo.org',
    city: 'Mumbai',
    locality: 'Powai or Andheri East',
    propertyType: 'Apartment',
    bhk: '3 BHK',
    budgetRange: '₹ 2.5 Cr - ₹ 3.5 Cr',
    timeline: 'Immediate Purchase',
    notes: 'High floor with good ventilation, 2 covered car park slots required.',
    postedDate: '2026-09-25',
    status: 'Active'
  }
];

export const MOCK_USER_METRICS = {
  totalBuyers: 34200,
  verifiedAgents: 1840,
  propertyOwners: 8950,
  pendingKyc: 42,
  activeCities: 8
};
