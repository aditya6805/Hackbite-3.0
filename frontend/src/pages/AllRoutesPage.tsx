import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { BusRoute } from '../types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SearchIcon from '@mui/icons-material/Search';
import RouteCard from '../components/RouteCard';

const AllRoutesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { routes, origin, destination, travelMode, journeyDate } = location.state as { 
    routes: BusRoute[], 
    origin: string, 
    destination: string,
    travelMode: string,
    journeyDate: Date | null
  };
  
  const [sortBy, setSortBy] = useState<string>('price-low');
  
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

  const handleViewDetails = (route: BusRoute) => {
    navigate('/route-details', { 
      state: { 
        routes: [route],
        origin: origin,
        destination: destination,
        travelMode: travelMode,
        journeyDate: journeyDate
      } 
    });
  };

  // Group routes by travel mode
  const busOnlyRoutes = routes.filter(route => !route.lastMile);
  const combinedRoutes = routes.filter(route => route.lastMile);
  
  // Sort routes based on selection
  const getSortedRoutes = (routeList: BusRoute[]) => {
    switch (sortBy) {
      case 'price-low':
        return [...routeList].sort((a, b) => {
          const aPrice = a.price || a.fare || 0;
          const bPrice = b.price || b.fare || 0;
          const aLastMileFare = a.lastMile?.fare || 0;
          const bLastMileFare = b.lastMile?.fare || 0;
          
          const aTotal = aPrice + aLastMileFare;
          const bTotal = bPrice + bLastMileFare;
          
          return aTotal - bTotal;
        });
      case 'price-high':
        return [...routeList].sort((a, b) => {
          const aPrice = a.price || a.fare || 0;
          const bPrice = b.price || b.fare || 0;
          const aLastMileFare = a.lastMile?.fare || 0;
          const bLastMileFare = b.lastMile?.fare || 0;
          
          const aTotal = aPrice + aLastMileFare;
          const bTotal = bPrice + bLastMileFare;
          
          return bTotal - aTotal;
        });
      case 'duration-low':
        return [...routeList]; // Would need to convert times to comparable format
      default:
        return routeList;
    }
  };
  
  const sortedBusRoutes = getSortedRoutes(busOnlyRoutes);
  const sortedCombinedRoutes = getSortedRoutes(combinedRoutes);

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

      <Container maxWidth="lg">
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)} 
          variant="outlined"
          sx={{ mb: 4 }}
        >
          Back to Search
        </Button>

        <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CompareArrowsIcon sx={{ mr: 2 }} /> All Available Routes
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
            <Typography variant="h6">
              <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {origin} to {destination}
              {journeyDate && (
                <Typography variant="subtitle1" sx={{ mt: 1, color: 'text.secondary' }}>
                  Journey Date: {journeyDate.toLocaleDateString()}
                </Typography>
              )}
            </Typography>
            <Typography variant="body1">
              <DirectionsBusIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {routes.length} Route{routes.length > 1 ? 's' : ''} Available
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              {travelMode && (
                <Chip 
                  label={travelMode} 
                  color="primary" 
                  size="small" 
                />
              )}
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort By"
                >
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="duration-low">Duration: Shortest</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Paper>
        
        {/* Direct/Bus Only Routes */}
        {sortedBusRoutes.length > 0 && (
          <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography variant="h5" gutterBottom>
              Direct Routes ({sortedBusRoutes.length})
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={3} useFlexGap>
              {sortedBusRoutes.map((route, index) => (
                <Box 
                  key={route.id || `bus-${index}`}
                  sx={{ 
                    width: { xs: '100%', md: 'calc(50% - 12px)' }
                  }}
                >
                  <RouteCard 
                    route={route} 
                    onViewDetails={handleViewDetails} 
                    showType={true}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        )}
        
        {/* Combined Routes with Last Mile */}
        {sortedCombinedRoutes.length > 0 && (
          <Paper sx={{ p: 3, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <Typography variant="h5" gutterBottom>
              Combined Routes ({sortedCombinedRoutes.length})
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={3} useFlexGap>
              {sortedCombinedRoutes.map((route, index) => (
                <Box 
                  key={route.id || `combined-${index}`}
                  sx={{ 
                    width: { xs: '100%', md: 'calc(50% - 12px)' }
                  }}
                >
                  <RouteCard 
                    route={route} 
                    onViewDetails={handleViewDetails} 
                    showType={true}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        )}
        
        {/* Call to Action */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => navigate('/find-route')}
            startIcon={<SearchIcon />}
          >
            Search New Routes
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AllRoutesPage; 