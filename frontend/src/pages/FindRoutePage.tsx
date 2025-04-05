import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Button,
  Stack
} from '@mui/material';
import SearchForm from '../components/SearchForm';
import { BusRoute } from '../types';
import { useNavigate } from 'react-router-dom';
import { mockBusRoutes } from '../data/mockData';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { travelApi } from '../services/api';
import { aiApi } from '../services/aiService';
import RouteCard from '../components/RouteCard';

function FindRoutePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [searchParams, setSearchParams] = useState<{
    origin: string;
    destination: string;
    travelMode: string;
    journeyDate: Date | null;
  } | null>(null);
  
  const navigate = useNavigate();

  const handleSearch = async (origin: string, destination: string, travelMode: string, journeyDate: Date | null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Save search parameters
      setSearchParams({
        origin,
        destination,
        travelMode,
        journeyDate
      });
      
      // Extract city name from the origin and destination (remove state)
      const originCity = origin.split(',')[0].trim();
      const destinationCity = destination.split(',')[0].trim();
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter mock data based on origin/destination
      const filteredRoutes = mockBusRoutes.filter(
        route => 
          route.origin.toLowerCase().includes(originCity.toLowerCase()) &&
          route.destination.toLowerCase().includes(destinationCity.toLowerCase())
      );
      
      // If no direct match, add a couple of randomized routes with the exact search criteria
      if (filteredRoutes.length === 0) {
        const randomRouteIds = ['random-1', 'random-2', 'random-3'];
        const randomDepartureHours = ['07', '14', '21'];
        const randomArrivalHours = ['12', '19', '04'];
        const randomBusTypes = ['AC Sleeper', 'Non-AC Seater', 'AC Semi-Sleeper'];
        const randomPrices = [550, 800, 1200];
        const randomOperators = ['Regional Transport', 'Express Travels', 'Mountain Roads'];
        
        const customRoutes = randomRouteIds.map((id, index) => ({
          id,
          routeNumber: `${originCity.substring(0, 3).toUpperCase()}-${destinationCity.substring(0, 3).toUpperCase()}-${index + 1}`,
          origin: originCity,
          destination: destinationCity,
          departureTime: `${randomDepartureHours[index]}:30`,
          arrivalTime: `${randomArrivalHours[index]}:30`,
          duration: `${Math.floor(Math.random() * 6) + 4}h ${Math.floor(Math.random() * 60)}m`,
          price: randomPrices[index],
          busType: randomBusTypes[index],
          operator: randomOperators[index],
          availableSeats: Math.floor(Math.random() * 25) + 5,
          amenities: ['WiFi', 'Charging Points'],
          rating: Math.floor(Math.random() * 10) / 2 + 3, // Random rating between 3.0 and 5.0
        }));
        
        setRoutes(customRoutes);
      } else {
        setRoutes(filteredRoutes);
      }
    } catch (err) {
      console.error('Error searching routes:', err);
      setError('Failed to fetch routes. Please try again.');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (route: BusRoute) => {
    if (!searchParams) return;
    
    navigate('/route-details', { 
      state: { 
        routes: [route],
        origin: searchParams.origin,
        destination: searchParams.destination,
        travelMode: searchParams.travelMode,
        journeyDate: searchParams.journeyDate
      } 
    });
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', py: 4 }}>
      {/* Background Layer */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${process.env.PUBLIC_URL}/travel-image.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.5)', // Increase brightness
          zIndex: -1 // Send to back
        }}
      />

      {/* Content Layer */}
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{ 
            color: '#1a237e', // Deep blue color
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            mb: 4
          }}
        >
          🚌 Find Your Route 🗺️
        </Typography>
        
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Search Form Section */}
          <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <Typography variant="h5" gutterBottom>
                Search Routes
              </Typography>
              <SearchForm onSearch={handleSearch} loading={loading} />
              
              {error && (
                <Typography 
                  color="error" 
                  variant="body2" 
                  sx={{ mt: 2, p: 1, bgcolor: 'rgba(255,235,235,0.7)' }}
                >
                  {error}
                </Typography>
              )}
            </Paper>
          </Box>
          
          {/* Results Section */}
          <Box sx={{ width: { xs: '100%', md: '66.666%' } }}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 3, 
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                overflow: 'auto',
                maxHeight: '80vh'
              }}
            >
              <Typography variant="h5" gutterBottom>
                Available Routes
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                  <CircularProgress />
                </Box>
              ) : routes.length > 0 ? (
                <>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {routes.length} route{routes.length !== 1 ? 's' : ''} found
                    {searchParams && ` from ${searchParams.origin} to ${searchParams.destination}`}
                    {searchParams?.journeyDate && ` for ${searchParams.journeyDate.toLocaleDateString()}`}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">Quick Results</Typography>
                    <Button 
                      variant="contained"
                      size="small"
                      onClick={() => navigate('/all-routes', { 
                        state: { 
                          routes,
                          origin: searchParams?.origin || '',
                          destination: searchParams?.destination || '',
                          travelMode: searchParams?.travelMode || '',
                          journeyDate: searchParams?.journeyDate || null
                        } 
                      })}
                    >
                      View All Routes
                    </Button>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    {routes.slice(0, 3).map((route, index) => {
                      return (
                        <RouteCard 
                          key={route.id || index} 
                          route={route}
                          onViewDetails={handleViewDetails}
                        />
                      );
                    })}
                    
                    {routes.length > 3 && (
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button 
                          variant="outlined" 
                          onClick={() => navigate('/all-routes', { 
                            state: { 
                              routes,
                              origin: searchParams?.origin || '',
                              destination: searchParams?.destination || '',
                              travelMode: searchParams?.travelMode || '',
                              journeyDate: searchParams?.journeyDate || null
                            } 
                          })}
                        >
                          See All {routes.length} Routes
                        </Button>
                      </Box>
                    )}
                  </Box>
                </>
              ) : searchParams ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" gutterBottom>
                    No routes found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We couldn't find any routes matching your search criteria.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" gutterBottom>
                    Start your search
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your journey details to find available routes.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default FindRoutePage; 