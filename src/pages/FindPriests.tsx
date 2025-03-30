import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, Clock, Phone } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const FindPriests = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedPriest, setSelectedPriest] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState({
    lat: 12.9716,  // Default to Bangalore
    lng: 77.5946
  });

  // Sample data for priests
  const priests = [
    {
      id: '1',
      name: 'Purohit Services & Puja Store',
      rating: 5.0,
      reviews: 125,
      type: 'Pujari',
      address: '306, Bangalore',
      hours: 'Opens 6:30 am',
      isOpen: false,
      location: { lat: 12.9716, lng: 77.5946 }
    },
    {
      id: '2',
      name: 'Pujas homas',
      rating: 5.0,
      reviews: 1,
      type: 'Pujari',
      address: 'WQ27+WH6',
      hours: 'Open 24 hours',
      isOpen: true,
      location: { lat: 12.9816, lng: 77.5846 }
    },
    {
      id: '3',
      name: 'North Indian pandit ji in Bangalore',
      rating: 4.9,
      reviews: 270,
      type: 'Pujari',
      address: 'Vill- Tingalapaliya p/s Mahadevpura Hoodi, 8th cross',
      phone: '080880 74168',
      hours: 'Open 24 hours',
      isOpen: true,
      description: '"Golu Panditji is very punctual and completed the Pooja on time."',
      location: { lat: 12.9916, lng: 77.5746 }
    },
    {
      id: '4',
      name: 'Bangalore North Indian Pandit Ji',
      rating: 4.5,
      reviews: 10,
      type: 'Pujari',
      address: '7, 10th Cross Rd',
      phone: '080732 22058',
      hours: 'Opens 7 am',
      isOpen: false,
      description: '"We had Rudrabhishek at our home and it was done"',
      location: { lat: 12.9616, lng: 77.6046 }
    }
  ];

  useEffect(() => {
    // Load Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCz9ipWeMCe9vjtJA3k1BxaWrezuR_bWAs&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Get user's location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          if (map) {
            map.setCenter(newLocation);
          }
        },
        () => {
          console.log('Using default location');
        }
      );
    }
  }, [map]);

  const initMap = () => {
    if (!mapRef.current) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    setMap(mapInstance);

    // Add markers for each priest
    const newMarkers = priests.map(priest => {
      const marker = new window.google.maps.Marker({
        position: priest.location,
        map: mapInstance,
        title: priest.name
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-size: 16px; margin-bottom: 4px;">${priest.name}</h3>
            <p style="margin: 0;">${priest.address}</p>
            <p style="margin: 4px 0 0;">Rating: ${priest.rating} (${priest.reviews} reviews)</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        markers.forEach(m => m.infoWindow.close());
        infoWindow.open(mapInstance, marker);
        setSelectedPriest(priest.id);
      });

      return { marker, infoWindow };
    });

    setMarkers(newMarkers);
  };

  const handlePriestClick = (priest: any) => {
    setSelectedPriest(priest.id);
    if (map) {
      map.setCenter(priest.location);
      map.setZoom(15);
      
      // Close all info windows and open the selected one
      markers.forEach((marker, index) => {
        if (priests[index].id === priest.id) {
          marker.infoWindow.open(map, marker.marker);
        } else {
          marker.infoWindow.close();
        }
      });
    }
  };

  const handleGetDirections = (priest: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (map) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map
      });

      directionsService.route({
        origin: userLocation,
        destination: priest.location,
        travelMode: window.google.maps.TravelMode.DRIVING
      }, (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        }
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - List of Priests */}
      <div className="w-[400px] h-full overflow-y-auto border-r">
        <div className="p-4">
          <h1 className="text-2xl font-semibold mb-2">Hindu Priests Near You</h1>
          <p className="text-sm text-gray-600 mb-4">Results for priests in your area</p>
          
          <div className="space-y-6">
            {priests.map((priest) => (
              <div 
                key={priest.id} 
                className={`cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-3 ${selectedPriest === priest.id ? 'bg-blue-50' : ''}`}
                onClick={() => handlePriestClick(priest)}
              >
                <h3 className="text-lg font-medium text-blue-800 hover:underline mb-1">
                  {priest.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center text-[#fbbc04]">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-black">{priest.rating}</span>
                  </div>
                  <span className="text-gray-600">({priest.reviews})</span>
                  <span className="text-gray-600">· {priest.type}</span>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {priest.address}
                  </div>
                  
                  {priest.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {priest.phone}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className={priest.isOpen ? 'text-green-700' : 'text-red-700'}>
                      {priest.hours}
                    </span>
                  </div>
                </div>

                {priest.description && (
                  <p className="mt-2 text-sm text-gray-600">
                    {priest.description}
                  </p>
                )}

                <div className="mt-3">
                  <button 
                    className="text-blue-800 hover:text-blue-900 text-sm font-medium"
                    onClick={(e) => handleGetDirections(priest, e)}
                  >
                    Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1" ref={mapRef} />
    </div>
  );
};

export default FindPriests; 