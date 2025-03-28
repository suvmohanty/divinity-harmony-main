import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, Music, FileText, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    title: 'Sacred Mantras',
    description: 'Discover and recite powerful mantras for peace, prosperity, and spiritual growth.',
    icon: BookOpen,
    href: '/mantras',
    color: 'from-hindu-gold/30 to-hindu-gold/5',
    iconColor: 'text-hindu-gold',
    textColor: 'text-hindu-gold',
    badge: 'Popular'
  },
  {
    title: 'Live Temple Darshan',
    description: 'Experience live darshans from sacred temples across the world.',
    icon: Video,
    href: '/darshan',
    color: 'from-hindu-red/30 to-hindu-red/5',
    iconColor: 'text-hindu-red',
    textColor: 'text-hindu-red',
    badge: 'Live Now'
  },
  {
    title: 'Spiritual Music',
    description: 'Listen to sacred chants, bhajans, and guided meditation music.',
    icon: Music,
    href: '/mp3-player',
    color: 'from-hindu-orange/30 to-hindu-orange/5',
    iconColor: 'text-hindu-orange',
    textColor: 'text-hindu-orange',
    badge: 'New Content'
  },
  {
    title: 'Sacred Texts',
    description: 'Read and study ancient spiritual texts and scriptures.',
    icon: FileText,
    href: '/pdf-reader',
    color: 'from-hindu-maroon/30 to-hindu-maroon/5',
    iconColor: 'text-hindu-maroon',
    textColor: 'text-hindu-maroon',
    badge: 'Updated'
  },
  {
    title: 'User Settings',
    description: 'Customize your experience and manage your account preferences.',
    icon: Settings,
    href: '/settings',
    color: 'from-blue-500/30 to-blue-500/5',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-600'
  },
];

const FeatureTiles = () => {
  return (
    <section className="my-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-hindu-red/30 text-hindu-red bg-hindu-red/5">
            Explore Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Spiritual Resources</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access a wealth of spiritual content to enhance your journey toward inner peace and divine consciousness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card 
              key={feature.title}
              className="overflow-hidden border-border/40 hover:border-border/80 transition-all duration-300 hover:shadow-lg group"
            >
              <CardContent className="p-0">
                <div className={`bg-gradient-to-br ${feature.color} p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full ${feature.iconColor} bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    {feature.badge && (
                      <Badge className="bg-background/80 text-foreground text-xs font-medium">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 group-hover:${feature.textColor}`}>{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t border-border/20 flex justify-between items-center">
                <Link 
                  to={feature.href} 
                  className={`text-sm font-medium ${feature.textColor} flex items-center gap-1 hover:underline`}
                >
                  Explore Now
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureTiles;
