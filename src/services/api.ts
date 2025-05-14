import { Profile, ProfileFormData } from '../types';

// Initial mock data
const initialProfiles: Profile[] = [
  {
    id: '1',
    name: 'John Doe',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    description: 'Software Engineer with 5 years of experience',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    contactInfo: {
      email: 'john@example.com',
      phone: '+1 234 567 8900'
    },
    interests: ['Programming', 'AI', 'Web Development']
  },
  // ... other initial profiles ...
];

// Helper functions for localStorage
const getStoredProfiles = (): Profile[] => {
  const stored = localStorage.getItem('profiles');
  return stored ? JSON.parse(stored) : initialProfiles;
};

const setStoredProfiles = (profiles: Profile[]) => {
  localStorage.setItem('profiles', JSON.stringify(profiles));
};

// Initialize localStorage with initial data if empty
if (!localStorage.getItem('profiles')) {
  setStoredProfiles(initialProfiles);
}

export const profileService = {
  // Get all profiles
  getAllProfiles: async (): Promise<Profile[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredProfiles();
  },

  // Get a single profile by ID
  getProfileById: async (id: string): Promise<Profile | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const profiles = getStoredProfiles();
    return profiles.find(profile => profile.id === id);
  },

  // Create a new profile
  createProfile: async (profile: Omit<Profile, 'id'>): Promise<Profile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const profiles = getStoredProfiles();
    const newProfile = {
      ...profile,
      id: Date.now().toString(), // Generate a unique ID
    };
    const updatedProfiles = [...profiles, newProfile];
    setStoredProfiles(updatedProfiles);
    return newProfile;
  },

  // Update an existing profile
  updateProfile: async (id: string, profileData: ProfileFormData): Promise<Profile> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const profiles = getStoredProfiles();
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Profile not found');
    }

    // Create updated profile by merging existing data with new data
    const updatedProfile: Profile = {
      id,
      name: profileData.name,
      photo: profileData.photo,
      description: profileData.description,
      address: {
        street: profileData.address.street,
        city: profileData.address.city,
        state: profileData.address.state,
        country: profileData.address.country,
        coordinates: profileData.address.coordinates
      },
      contactInfo: profileData.contactInfo ? {
        email: profileData.contactInfo.email,
        phone: profileData.contactInfo.phone
      } : undefined,
      interests: profileData.interests || []
    };

    const updatedProfiles = [...profiles];
    updatedProfiles[index] = updatedProfile;
    setStoredProfiles(updatedProfiles);
    return updatedProfile;
  },

  // Delete a profile
  deleteProfile: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const profiles = getStoredProfiles();
    const updatedProfiles = profiles.filter(profile => profile.id !== id);
    setStoredProfiles(updatedProfiles);
  },

  // Search profiles
  searchProfiles: async (query: string): Promise<Profile[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    const profiles = getStoredProfiles();
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(searchTerm) ||
      profile.description.toLowerCase().includes(searchTerm) ||
      profile.address.city.toLowerCase().includes(searchTerm)
    );
  },
}; 