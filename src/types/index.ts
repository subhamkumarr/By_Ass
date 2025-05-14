export interface Profile {
  id: string;
  name: string;
  photo: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contactInfo?: {
    email: string;
    phone: string;
  };
  interests?: string[];
}

export interface ProfileFormData extends Omit<Profile, 'id'> {}

export interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  markers?: Array<{
    position: {
      lat: number;
      lng: number;
    };
    title: string;
  }>;
}

export interface SearchFilters {
  name?: string;
  location?: string;
  interests?: string[];
} 