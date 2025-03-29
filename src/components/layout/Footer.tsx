import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Settings, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-muted pt-16 pb-8">
      <div className="container px-4 mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-base font-semibold mb-4 tracking-wide">About Us</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Divinity Harmony is your spiritual sanctuary, providing access to sacred mantras, live temple darshans, and ancient wisdom to help you embrace divine harmony in daily life.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="h-9 w-9 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Facebook size={18} className="text-foreground/70" />
              </a>
              <a href="#" className="h-9 w-9 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Twitter size={18} className="text-foreground/70" />
              </a>
              <a href="#" className="h-9 w-9 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Instagram size={18} className="text-foreground/70" />
              </a>
              <a href="#" className="h-9 w-9 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors">
                <Youtube size={18} className="text-foreground/70" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4 tracking-wide">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Mantras
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Live Darshan
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Hindu Pujas & Rituals
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Sacred Texts
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4 tracking-wide">Support</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 group">
                  <span className="h-0.5 w-0 bg-hindu-orange group-hover:w-2 transition-all duration-300"></span>
                  Donation Program <ExternalLink className="ml-1 h-3 w-3 inline" />
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-4 tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground group">
                <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-hindu-red border border-border/30 group-hover:bg-hindu-red/10 transition-colors">
                  <Mail size={14} />
                </div>
                <span>contact@divinityharmony.com</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground group">
                <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-hindu-red border border-border/30 group-hover:bg-hindu-red/10 transition-colors">
                  <Phone size={14} />
                </div>
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground group">
                <div className="h-8 w-8 bg-background rounded-full flex items-center justify-center text-hindu-red border border-border/30 group-hover:bg-hindu-red/10 transition-colors mt-0.5">
                  <MapPin size={14} />
                </div>
                <span>Divine Harmony Center,<br />Spiritual Avenue, Peace City</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8 opacity-40" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2023 Divinity Harmony. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              <Settings className="h-3 w-3 mr-1" />
              Settings
            </Button>
            <div className="h-4 w-px bg-border"></div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500 fill-red-500" /> by Devotees
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
