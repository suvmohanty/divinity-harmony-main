
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselPrevious, 
  CarouselNext 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookOpen, Video, Music } from 'lucide-react';

// Featured content data
const featuredContent = [
  {
    id: 1,
    title: "Gayatri Mantra",
    description: "Sacred verse from the Rigveda, dedicated to Savitr, the sun deity",
    type: "mantra",
    icon: BookOpen,
    color: "bg-hindu-gold",
    link: "/mantras/gayatri"
  },
  {
    id: 2,
    title: "Live Darshan: Varanasi Ganga Aarti",
    description: "Experience the divine Ganga Aarti ceremony live from Varanasi",
    type: "darshan",
    icon: Video,
    color: "bg-hindu-red",
    link: "/darshan/varanasi"
  },
  {
    id: 3,
    title: "Om Namah Shivaya",
    description: "One of the most powerful and popular mantras in Hinduism",
    type: "mantra",
    icon: Music,
    color: "bg-hindu-orange",
    link: "/mantras/shiva"
  },
  {
    id: 4,
    title: "Live Darshan: Tirupati Balaji Temple",
    description: "Experience live darshan from the sacred Tirupati Balaji Temple",
    type: "darshan",
    icon: Video,
    color: "bg-hindu-maroon",
    link: "/darshan/tirupati"
  }
];

const FeaturedCarousel = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="my-12">
      <h2 className="text-3xl font-bold text-center mb-10">Featured Content</h2>
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent>
          {featuredContent.map((item) => (
            <CarouselItem key={item.id} className={isMobile ? "basis-full" : "basis-1/2"}>
              <Link to={item.link}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center mb-4`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                      <div className="mt-4 inline-block bg-muted rounded-full px-3 py-1 text-xs font-medium">
                        {item.type === "mantra" ? "Sacred Mantra" : "Live Darshan"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-6" />
          <CarouselNext className="-right-6" />
        </div>
      </Carousel>
    </section>
  );
};

export default FeaturedCarousel;
