import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  useTheme,
  alpha,
  Chip,
  Tooltip,
  Fade,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/api';
import { Profile, ProfileFormData } from '../types';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';

interface ContactInfo {
  email: string;
  phone: string;
}

interface FormValues extends Omit<ProfileFormData, 'contactInfo'> {
  contactInfo: ContactInfo;
}

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  photo: yup.string().url('Must be a valid URL').required('Photo URL is required'),
  description: yup.string().required('Description is required'),
  address: yup.object({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    country: yup.string().required('Country is required'),
    coordinates: yup.object({
      lat: yup.number().required('Latitude is required'),
      lng: yup.number().required('Longitude is required'),
    }),
  }),
  contactInfo: yup.object({
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
  }),
  interests: yup.array().of(yup.string()),
});

const initialValues: FormValues = {
  name: '',
  photo: '',
  description: '',
  address: {
    street: '',
    city: '',
    state: '',
    country: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
  contactInfo: {
    email: '',
    phone: '',
  },
  interests: [],
};

const convertProfileToFormValues = (profile: Profile): FormValues => ({
  ...profile,
  contactInfo: profile.contactInfo || { email: '', phone: '' },
});



const AdminPanel: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: profileService.getAllProfiles,
  });

  const createMutation = useMutation({
    mutationFn: profileService.createProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfileFormData }) =>
      profileService.updateProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: profileService.deleteProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: selectedProfile ? convertProfileToFormValues(selectedProfile) : initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      try {
        if (selectedProfile) {
          await updateMutation.mutateAsync({
            id: selectedProfile.id,
            data: {
              ...values,
              // id: selectedProfile.id
            }
          });
        } else {
          await createMutation.mutateAsync(values);
        }
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    },
  });

  const handleEdit = (profile: Profile) => {
    setSelectedProfile(profile);
    formik.setValues(convertProfileToFormValues(profile));
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setSelectedProfile(null);
    formik.resetForm();
  };

  const filteredProfiles = profiles?.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.address.country.toLowerCase().includes(searchQuery.toLowerCase())
  );
   const [interestInput, setInterestInput] = useState('');

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        bgcolor={alpha(theme.palette.background.default, 0.8)}
      >
        <Typography variant="h6" color="textSecondary">Loading profiles...</Typography>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Admin Panel
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              py: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              },
            }}
          >
            Add New Profile
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            borderRadius: 2,
            background: alpha(theme.palette.background.paper, 0.9),
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search profiles by name, description, city, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Paper>

        <Grid container spacing={3}>
          {filteredProfiles?.map((profile) => (
            <Grid item xs={12} md={6} lg={4} key={profile.id}>
              <Fade in timeout={500}>
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
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {profile.name}
                      </Typography>
                      <Typography 
                        color="textSecondary" 
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

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="textSecondary">
                          {profile.address.city}, {profile.address.country}
                        </Typography>
                      </Box>
                      {profile.contactInfo && (
                        <>
                          <Box display="flex" alignItems="center" mb={1}>
                            <EmailIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">
                              {profile.contactInfo.email}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <PhoneIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">
                              {profile.contactInfo.phone}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    {profile.interests && profile.interests.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Interests
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {profile.interests.map((interest, index) => (
                            <Chip
                              key={index}
                              label={interest}
                              size="small"
                              sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                },
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions 
                    className="profile-actions"
                    sx={{
                      p: 2,
                      pt: 0,
                      opacity: 0,
                      transform: 'translateY(10px)',
                      transition: 'all 0.3s ease-in-out',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <Tooltip title="Edit Profile">
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(profile)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          minWidth: 100,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete Profile">
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(profile.id)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          minWidth: 100,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog 
        open={isFormOpen} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          py: 2,
        }}>
          <Typography variant="h6" color="primary">
            {selectedProfile ? 'Edit Profile' : 'Add New Profile'}
          </Typography>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="photo"
                  label="Photo URL"
                  value={formik.values.photo}
                  onChange={formik.handleChange}
                  error={formik.touched.photo && Boolean(formik.errors.photo)}
                  helperText={formik.touched.photo && formik.errors.photo}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Description"
                  multiline
                  rows={4}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                  sx={{ mb: 2 }}
                />
              </Grid>
<Grid item xs={12}>
  <Typography variant="subtitle1" color="primary" gutterBottom>
    Interests
  </Typography>
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
    {(formik.values.interests ?? []).map((interest, idx) => (
      <Chip
        key={idx}
        label={interest}
        onDelete={() => {
          const newInterests = [...(formik.values.interests ?? [])];
          newInterests.splice(idx, 1);
          formik.setFieldValue('interests', newInterests);
        }}
        color="primary"
        variant="outlined"
      />
    ))}
  </Box>
  <TextField
    fullWidth
    label="Add Interest"
    value={interestInput}
    onChange={(e) => setInterestInput(e.target.value)}
    onKeyDown={(e) => {
      if (
        (e.key === 'Enter' || e.key === ',') &&
        interestInput.trim() !== ''
      ) {
        e.preventDefault();
        if (
          !(formik.values.interests ?? []).includes(interestInput.trim())
        ) {
          formik.setFieldValue('interests', [
            ...(formik.values.interests ?? []),
            interestInput.trim(),
          ]);
        }
        setInterestInput('');
      }
    }}
    helperText="Type an interest and press Enter or comma"
    sx={{ mb: 2 }}
  />
</Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Address
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="address.street"
                      label="Street"
                      value={formik.values.address.street}
                      onChange={formik.handleChange}
                      error={formik.touched.address?.street && Boolean(formik.errors.address?.street)}
                      helperText={formik.touched.address?.street && formik.errors.address?.street}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="address.city"
                      label="City"
                      value={formik.values.address.city}
                      onChange={formik.handleChange}
                      error={formik.touched.address?.city && Boolean(formik.errors.address?.city)}
                      helperText={formik.touched.address?.city && formik.errors.address?.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="address.state"
                      label="State"
                      value={formik.values.address.state}
                      onChange={formik.handleChange}
                      error={formik.touched.address?.state && Boolean(formik.errors.address?.state)}
                      helperText={formik.touched.address?.state && formik.errors.address?.state}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="address.country"
                      label="Country"
                      value={formik.values.address.country}
                      onChange={formik.handleChange}
                      error={formik.touched.address?.country && Boolean(formik.errors.address?.country)}
                      helperText={formik.touched.address?.country && formik.errors.address?.country}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="contactInfo.email"
                      label="Email"
                      value={formik.values.contactInfo.email}
                      onChange={formik.handleChange}
                      error={Boolean(formik.touched.contactInfo?.email && formik.errors.contactInfo?.email)}
                      helperText={formik.touched.contactInfo?.email && formik.errors.contactInfo?.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="contactInfo.phone"
                      label="Phone"
                      value={formik.values.contactInfo.phone}
                      onChange={formik.handleChange}
                      error={Boolean(formik.touched.contactInfo?.phone && formik.errors.contactInfo?.phone)}
                      helperText={formik.touched.contactInfo?.phone && formik.errors.contactInfo?.phone}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button 
              onClick={handleClose}
              sx={{ 
                mr: 1,
                borderRadius: 2,
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              {selectedProfile ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminPanel; 