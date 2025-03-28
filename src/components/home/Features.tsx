import React from 'react';
import { Sparkles, Headphones, BookOpen, Music, Video, Wand2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Features = () => {
  const features = [
    {
      title: 'Spiritual Guidance',
      description: 'Receive personalized spiritual guidance and answers to your deepest questions through ancient wisdom.',
      icon: <Sparkles className="h-8 w-8" />,
      accent: 'hindu-red',
      color: 'bg-hindu-red/10',
      textColor: 'text-hindu-red',
      isNew: true
    },
    {
      title: 'Devotional Music',
      description: 'Immerse yourself in a vast collection of bhajans, kirtans, and spiritual music to elevate your consciousness.',
      icon: <Music className="h-8 w-8" />,
      accent: 'hindu-gold',
      color: 'bg-hindu-gold/10',
      textColor: 'text-hindu-gold'
    },
    {
      title: 'Sacred Texts',
      description: 'Explore ancient scriptures, Vedas, Upanishads, and spiritual literature from various traditions.',
      icon: <BookOpen className="h-8 w-8" />,
      accent: 'hindu-blue',
      color: 'bg-hindu-blue/10',
      textColor: 'text-hindu-blue'
    },
    {
      title: 'Guided Meditations',
      description: 'Find peace and clarity with professionally guided meditations for spiritual growth and healing.',
      icon: <Headphones className="h-8 w-8" />,
      accent: 'hindu-green',
      color: 'bg-hindu-green/10',
      textColor: 'text-hindu-green',
      isNew: true
    },
    {
      title: 'Spiritual Cinema',
      description: 'Watch inspiring documentaries and films about spiritual journeys, saints, and mystical experiences.',
      icon: <Video className="h-8 w-8" />,
      accent: 'hindu-purple',
      color: 'bg-hindu-purple/10',
      textColor: 'text-hindu-purple'
    },
    {
      title: 'Virtual Rituals',
      description: 'Participate in authentic rituals and ceremonies from the comfort of your home, guided by experienced priests.',
      icon: <Wand2 className="h-8 w-8" />,
      accent: 'hindu-orange',
      color: 'bg-hindu-orange/10',
      textColor: 'text-hindu-orange'
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-hindu-red/30 text-hindu-red bg-hindu-red/5">
            Our Offerings
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Elevate Your Spiritual Journey</h2>
          <p className="text-muted-foreground">
            Discover a treasure trove of spiritual resources designed to support your path to enlightenment,
            inner peace, and connection with the divine.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl p-6 border border-border/50 hover:border-${feature.accent}/30 transition-all duration-300 bg-background group hover:shadow-md`}
            >
              <div className={`absolute top-0 right-0 bottom-0 w-1 ${feature.color} group-hover:bg-${feature.accent} transition-colors duration-300 opacity-50 rounded-r-xl`}></div>
              
              {feature.isNew && (
                <Badge className="absolute top-4 right-4 bg-hindu-red text-white">New</Badge>
              )}
              
              <div className={`p-3 ${feature.color} rounded-lg inline-flex mb-4`}>
                <div className={feature.textColor}>{feature.icon}</div>
              </div>
              
              <h3 className={`text-xl font-semibold mb-3 group-hover:text-${feature.accent} transition-colors`}>
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 text-sm">
                {feature.description}
              </p>
              
              <Button 
                variant="ghost" 
                className={`px-0 group-hover:text-${feature.accent} transition-colors group-hover:bg-transparent`}
              >
                Learn more
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="ml-1 transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 