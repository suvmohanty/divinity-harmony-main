import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/assets/hero-bg.jpg" 
          alt="Spiritual background" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-hindu-red/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-hindu-gold/5 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-24 md:py-32 lg:py-40 mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-hindu-red/10 text-hindu-red text-sm font-medium mb-6 border border-hindu-red/20">
            <span className="flex h-2 w-2 mr-2">
              <span className="animate-ping absolute h-2 w-2 rounded-full bg-hindu-red/30"></span>
              <span className="relative rounded-full h-2 w-2 bg-hindu-red"></span>
            </span>
            Experience Divine Harmony
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="block">Discover the Path to</span>
            <span className="bg-gradient-to-r from-hindu-red to-hindu-gold bg-clip-text text-transparent">Spiritual Enlightenment</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Connect with your inner self through ancient mantras, live darshans, and sacred texts. Begin your journey to inner peace and spiritual growth today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="bg-gradient-to-r from-hindu-red to-hindu-orange hover:brightness-110 transition-all group">
              <Link to="/mantras">
                Explore Mantras
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="border-muted-foreground/20 hover:bg-hindu-red/10 hover:text-hindu-red hover:border-hindu-red/50 group">
              <Link to="/darshan">
                <PlayCircle className="mr-2 h-5 w-5 group-hover:text-hindu-red transition-colors" />
                Watch Live Darshan
              </Link>
            </Button>
          </div>
          
          {/* Statistic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl">
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-sm">
              <div className="text-3xl font-bold mb-2 text-hindu-red">10,000+</div>
              <div className="text-muted-foreground text-sm">Mantras Available</div>
            </div>
            
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-sm">
              <div className="text-3xl font-bold mb-2 text-hindu-gold">500+</div>
              <div className="text-muted-foreground text-sm">Live Darshans Monthly</div>
            </div>
            
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-border/30 shadow-sm">
              <div className="text-3xl font-bold mb-2 text-hindu-orange">50,000+</div>
              <div className="text-muted-foreground text-sm">Global Community</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="none" className="w-full">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 64L60 58.7C120 53.3 240 42.7 360 48C480 53.3 600 74.7 720 80C840 85.3 960 74.7 1080 69.3C1200 64 1320 64 1380 64H1440V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V64Z" fill="currentColor" className="text-background" />
        </svg>
      </div>
    </div>
  );
};

export default Hero; 