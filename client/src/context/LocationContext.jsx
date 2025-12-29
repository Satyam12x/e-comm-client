import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    city: '',
    pincode: '',
    street: '',
    state: '',
    loading: true,
    error: null
  });

  const detectLocation = () => {
    setLocation(prev => ({ ...prev, loading: true }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.suburb || '';
            const pincode = data.address.postcode || '';
            const street = data.address.road || data.address.neighbourhood || '';
            const state = data.address.state || '';
            
            setLocation({
              city,
              pincode,
              street,
              state,
              loading: false,
              error: null
            });
          } catch (error) {
            console.error('Error fetching location:', error);
            setLocation(prev => ({ ...prev, loading: false, error: 'Failed to fetch address details' }));
          }
        },
        (error) => {
          console.log('Geolocation permission denied or error:', error);
          setLocation(prev => ({ ...prev, loading: false, error: 'Location permission denied' }));
        }
      );
    } else {
        setLocation(prev => ({ ...prev, loading: false, error: 'Geolocation not supported' }));
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const updateLocation = (newLocation) => {
      setLocation(prev => ({ ...prev, ...newLocation }));
  };

  return (
    <LocationContext.Provider value={{ location, detectLocation, updateLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
