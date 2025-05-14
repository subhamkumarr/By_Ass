import React, { useState } from 'react';
import { Container, Grid, Box, Typography, useTheme, alpha, Paper, IconButton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services/api';
import ProfileCard from '../components/ProfileCard';
import Map from '../components/Map';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Profile } from '../types';
import { Close as CloseIcon } from '@mui/icons-material';

const ProfileList: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['profiles'],
    queryFn: profileService.getAllProfiles
  });

  const handleShowMap = (profile: Profile) => {
    setSelectedProfile(profile);
  };

  const filteredProfiles = profiles?.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <Typography color="error" variant="h6">
          Error loading profiles. Please try again later.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
      py: 4,
    }}>
      <Container maxWidth="lg">
        <Box mb={4}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              mb: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Explore Profiles
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              background: alpha(theme.palette.background.paper, 0.9),
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </Paper>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={selectedProfile ? 8 : 12}>
            <Grid container spacing={3}>
              {filteredProfiles?.map((profile) => (
                <Grid item xs={12} sm={6} md={4} key={profile.id}>
                  <ProfileCard
                    profile={profile}
                    onShowMap={handleShowMap}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {selectedProfile && (
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  position: 'sticky',
                  top: 20,
                  p: 2,
                  borderRadius: 2,
                  background: alpha(theme.palette.background.paper, 0.9),
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  height: 'fit-content',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    color="primary"
                    sx={{
                      fontWeight: 'bold',
                    }}
                  >
                    Location
                  </Typography>
                  <IconButton 
                    onClick={() => setSelectedProfile(null)}
                    sx={{
                      color: theme.palette.primary.main,
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.1),
                      }
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Box 
                  sx={{ 
                    height: 400, 
                    borderRadius: 2, 
                    overflow: 'hidden',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                    '& .gm-style': {
                      borderRadius: '8px',
                    },
                  }}
                >
                  <Map
                    center={selectedProfile.address.coordinates}
                    zoom={12}
                    markers={[{
                      position: selectedProfile.address.coordinates,
                      title: selectedProfile.name
                    }]}
                  />
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProfileList; 