import { Profile } from './types';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'John Doe',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
    description: 'Software Engineer with 5 years of experience in web development.',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    contactInfo: {
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    interests: ['Programming', 'Hiking', 'Photography']
  },
  {
    id: '2',
    name: 'Jane Smith',
    photo: 'https://randomuser.me/api/portraits/women/1.jpg',
    description: 'UX Designer passionate about creating beautiful and functional interfaces.',
    address: {
      street: '456 Park Ave',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194
      }
    },
    contactInfo: {
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543'
    },
    interests: ['Design', 'Art', 'Travel']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    photo: 'https://randomuser.me/api/portraits/men/2.jpg',
    description: 'Data Scientist specializing in machine learning and AI.',
    address: {
      street: '789 Tech Blvd',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      coordinates: {
        lat: 47.6062,
        lng: -122.3321
      }
    },
    contactInfo: {
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 456-7890'
    },
    interests: ['AI', 'Data Science', 'Chess']
  }
]; 