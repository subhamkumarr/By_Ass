import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, Chip, useTheme, alpha } from '@mui/material';
import { Profile } from '../types';
import { useNavigate } from 'react-router-dom';
import {
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  Map as MapIcon,
} from '@mui/icons-material';

interface ProfileCardProps {
  profile: Profile;
  onShowMap: (profile: Profile) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onShowMap }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card 
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'visible',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
          '& .profile-actions': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <Avatar
          src={profile.photo}
          alt={profile.name}
          sx={{
            width: 80,
            height: 80,
            border: `4px solid ${theme.palette.background.paper}`,
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        />
      </Box>

      <CardContent sx={{ pt: 8, pb: 2 }}>
        <Box textAlign="center" mb={2}>
          <Typography 
            variant="h6" 
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
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {profile.description}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            <LocationIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {profile.address.city}, {profile.address.country}
            </Typography>
          </Box>
          {profile.contactInfo && (
            <>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {profile.contactInfo.email}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <PhoneIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  {profile.contactInfo.phone}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {profile.interests && profile.interests.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {profile.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        <Box 
          className="profile-actions"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            width: '100%',
            flexWrap: 'wrap',
            '& .MuiButton-root': {
              flex: 1,
              minWidth: '120px',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/profile/${profile.id}`)}
            startIcon={<VisibilityIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 2,
              py: 1,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                background: alpha(theme.palette.primary.main, 0.05),
              }
            }}
          >
            View Details
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onShowMap(profile)}
            startIcon={<MapIcon />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 2,
              py: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              }
            }}
          >
            Show on Map
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 