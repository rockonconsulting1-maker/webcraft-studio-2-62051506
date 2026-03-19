
export interface Listing {
  id: string;
  address: string;
  city: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  type: 'Residential' | 'Acreage' | 'Commercial' | 'Investment';
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
}

export interface LocalSpot {
  name: string;
  description: string;
  link?: string;
  phone?: string;
}

export interface CommunityData {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  mapEmbedUrl: string;
  parentCommunityId?: string;
  highlights: string[];
  eat: LocalSpot[];
  do: LocalSpot[];
  schools?: LocalSpot[];
  subCommunities?: string[]; // IDs of children
}

export enum Page {
  Home = 'Home',
  About = 'About',
  Buyers = 'Buyers',
  Sellers = 'Sellers',
  Listings = 'Listings',
  Contact = 'Contact',
  Community = 'Community'
}
