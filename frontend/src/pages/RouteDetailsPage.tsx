import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Divider,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { BusRoute } from '../types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';

const RouteDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, origin, destination, travelMode, journeyDate } = location.state as { 
    routes: BusRoute[], 
    origin: string, 
    destination: string,
    travelMode: string,
    journeyDate: Date | null
  };

  if (!routes || routes.length === 0) {
    return (
      <Box sx={{ position: 'relative', minHeight: '100vh', py: 4 }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${process.env.PUBLIC_URL}/travel-image.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(1.5)',
            zIndex: -1
          }}
        />
        <Container maxWidth="md">
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate(-1)} 
            variant="outlined"
            sx={{ mb: 4 }}
          >
            Back
          </Button>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5">No routes found</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              No routes are available between {origin} and {destination}.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', py: 4 }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${process.env.PUBLIC_URL}/travel-image.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.5)',
          zIndex: -1
        }}
      />

      <Container maxWidth="md">
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          variant="outlined"
          sx={{ mb: 4 }}
        >
          Back
        </Button>

        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Typography variant="h4" gutterBottom>
            Journey Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Typography variant="h6">
              <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {origin} to {destination}
            </Typography>
            <Typography variant="body1">
              <DirectionsBusIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {routes.length} Route{routes.length > 1 ? 's' : ''} Available
            </Typography>
          </Box>
          {journeyDate && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Journey Date: {journeyDate.toLocaleDateString()}
            </Typography>
          )}
        </Paper>

        {routes.map((route, index) => {
          // Check if lastMile exists
          const hasLastMile = route.lastMile !== undefined;
          
          return (
            <Card 
              key={route.id || index} 
              sx={{ 
                mb: 3, 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="div">
                    {route.routeName || `${route.origin} to ${route.destination}`}
                  </Typography>
                  <Chip 
                    label={`₹${route.price || route.fare || 0}${hasLastMile ? ' + ₹' + (route.lastMile?.fare || 0) : ''}`}
                    color="secondary"
                    icon={<AttachMoneyIcon />}
                    size="medium"
                  />
                </Box>
                
                <Stack direction={{ sx: 'column', md: 'row' }} spacing={3}>
                  <Box sx={{ flex: 1 }}>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                      <Typography variant="h6" gutterBottom>
                        <DirectionsBusIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Main Journey
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">
                          <strong>From:</strong> {route.origin}
                        </Typography>
                        <Typography variant="body1">
                          <strong>To:</strong> {route.destination}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Box sx={{ minWidth: '45%' }}>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {route.duration || route.estimatedTime || 'N/A'}
                          </Typography>
                        </Box>
                        <Box sx={{ minWidth: '45%' }}>
                          <Typography variant="body2">
                            <strong>Fare:</strong> ₹{route.price || route.fare || 0}
                          </Typography>
                        </Box>
                        {route.operator && (
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <Typography variant="body2">
                              <strong>Operator:</strong> {route.operator}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Paper>
                  </Box>
                  
                  {hasLastMile && (
                    <Box sx={{ flex: 1 }}>
                      <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                        <Typography variant="h6" gutterBottom>
                          <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                          Last Mile Options
                        </Typography>
                        
                        <Stack spacing={1}>
                          <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Box sx={{ minWidth: '45%' }}>
                              <Typography variant="body2">
                                <strong>Mode:</strong> {route.lastMile?.mode || 'N/A'}
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: '45%' }}>
                              <Typography variant="body2">
                                <strong>Distance:</strong> {route.lastMile?.distance || 0} km
                              </Typography>
                            </Box>
                          </Stack>
                          
                          <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Box sx={{ minWidth: '45%' }}>
                              <Typography variant="body2">
                                <strong>Duration:</strong> {route.lastMile?.estimatedTime || 'N/A'}
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: '45%' }}>
                              <Typography variant="body2">
                                <strong>Fare:</strong> ₹{route.lastMile?.fare || 0}
                              </Typography>
                            </Box>
                          </Stack>
                          
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Availability:</strong> {route.lastMile?.availability || 'N/A'}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Box>
                  )}
                </Stack>
                
                <Paper 
                  sx={{ 
                    mt: 3, 
                    p: 2, 
                    bgcolor: 'primary.main', 
                    color: 'white' 
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    <ScheduleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Total Journey Summary
                  </Typography>
                  
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        <strong>Total Duration:</strong> {hasLastMile 
                          ? `${route.duration || route.estimatedTime || 'N/A'} + ${route.lastMile?.estimatedTime || 'N/A'}`
                          : route.duration || route.estimatedTime || 'N/A'
                        }
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1">
                        <strong>Total Fare:</strong> ₹{hasLastMile 
                          ? (route.price || route.fare || 0) + (route.lastMile?.fare || 0)
                          : route.price || route.fare || 0
                        }
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    onClick={() => window.alert('Booking functionality coming soon!')}
                  >
                    Book This Journey
                  </Button>
                </Paper>
              </CardContent>
            </Card>
          );
        })}
      </Container>
    </Box>
  );
};

export default RouteDetailsPage; 