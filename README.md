# Profile Map Application

A React application that allows users to view profiles and their locations on an interactive map. Built with React, TypeScript, Material-UI, and Google Maps integration.

## Features

- View a list of profiles with photos and descriptions
- Interactive map integration with Google Maps
- Search and filter profiles
- Detailed profile view with contact information and location
- Responsive design for all devices
- Admin panel for managing profiles (coming soon)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd profile-map-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Google Maps API key:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── services/      # API services
  ├── types/         # TypeScript interfaces
  ├── utils/         # Utility functions
  ├── hooks/         # Custom React hooks
  └── context/       # React context providers
```

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- React Query
- Google Maps API
- Axios

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
