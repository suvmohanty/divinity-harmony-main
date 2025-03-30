import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Phone, Globe, Clock } from 'lucide-react';

interface Priest {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  hours: string;
  isOpen: boolean;
  description?: string;
}

const FindPriests = () => {
  const [selectedPriest, setSelectedPriest] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 12.9716,  // Default to Bangalore
    lng: 77.5946
  });

  // Sample data - this would typically come from your backend/API
  const priests: Priest[] = [
    {
      id: '1',
      name: 'Purohit Services & Puja Store',
      rating: 5.0,
      reviews: 125,
      type: 'Pujari',
      address: '306, Bangalore',
      hours: 'Opens 6:30 am',
      isOpen: false,
      description: 'On-site services'
    },
    {
      id: '2',
      name: 'Pujas homas',
      rating: 5.0,
      reviews: 1,
      type: 'Pujari',
      address: 'WQ27+WH6',
      hours: 'Open 24 hours',
      isOpen: true
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
      description: '"Golu Panditji is very punctual and completed the Pooja on time."'
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
      description: '"We had Rudrabhishek at our home and it was done"'
    }
  ];

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          // If error, keep default coordinates
          console.log('Using default location');
        }
      );
    }
  }, []);

  return (
    <Layout>
      <div className="flex h-[calc(100vh-64px)] mt-16">
        {/* Left Panel - List of Priests */}
        <div className="w-[400px] overflow-y-auto border-r">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Hindu Priests Near You</h2>
            <div className="space-y-4">
              {priests.map((priest) => (
                <Card
                  key={priest.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 ${
                    selectedPriest === priest.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedPriest(priest.id)}
                >
                  <h3 className="font-semibold text-lg">{priest.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {priest.rating}
                    </Badge>
                    <span className="text-sm text-muted-foreground">({priest.reviews})</span>
                    <span className="text-sm text-muted-foreground">· {priest.type}</span>
                  </div>
                  
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {priest.address}
                    </div>
                    
                    {priest.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {priest.phone}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className={priest.isOpen ? 'text-green-600' : 'text-red-600'}>
                        {priest.hours}
                      </span>
                    </div>
                  </div>

                  {priest.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {priest.description}
                    </p>
                  )}

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">
                      Directions
                    </Button>
                    <Button size="sm">
                      Book Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1">
          <iframe
            src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyCz9ipWeMCe9vjtJA3k1BxaWrezuR_bWAs&q=hindu+priest+near+${userLocation.lat},${userLocation.lng}&zoom=13`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Layout>
  );
};

export default FindPriests; 