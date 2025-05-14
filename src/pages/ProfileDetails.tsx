import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { profileService } from '../services/api';
import Map from '../components/Map';

const ProfileDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => profileService.getProfileById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor={alpha(theme.palette.background.default, 0.8)}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profile) {
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
          Error loading profile. Please try again later.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
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
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ 
            mb: 3,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': {
              transform: 'translateX(-4px)',
            },
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          Back to Profiles
        </Button>

        <Paper 
          elevation={0}
          sx={{ 
            p: 4,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  position: 'relative',
                  mb: 3,
                }}
              >
                <Avatar
                  src={profile.photo}
                  alt={profile.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1',
                    borderRadius: 4,
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box mb={4}>
                <Typography 
                  variant="h3" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {profile.name}
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                  }}
                >
                  {profile.description}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                {profile.contactInfo && (
                  <Grid item xs={12} sm={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: alpha(theme.palette.primary.main, 0.05),
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="primary">
                        Contact Information
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <EmailIcon color="primary" />
                        <Typography>{profile.contactInfo.email}</Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon color="primary" />
                        <Typography>{profile.contactInfo.phone}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                )}

                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: alpha(theme.palette.secondary.main, 0.05),
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="secondary">
                      Address
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocationIcon color="secondary" />
                      <Box>
                        <Typography>{profile.address.street}</Typography>
                        <Typography>
                          {profile.address.city}, {profile.address.state}
                        </Typography>
                        <Typography>{profile.address.country}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                {profile.interests && profile.interests.length > 0 && (
                  <Grid item xs={12}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: alpha(theme.palette.success.main, 0.05),
                      }}
                    >
                      <Typography variant="h6" gutterBottom color="success.main">
                        Interests
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {profile.interests.map((interest, index) => (
                          <Chip
                            key={index}
                            label={interest}
                            sx={{
                              background: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main,
                              '&:hover': {
                                background: alpha(theme.palette.success.main, 0.2),
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 4 }} />
              <Box sx={{ height: 500, borderRadius: 4, overflow: 'hidden' }}>
                <Map
                  center={profile.address.coordinates}
                  zoom={12}
                  markers={[{
                    position: profile.address.coordinates,
                    title: profile.name
                  }]}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileDetails; 