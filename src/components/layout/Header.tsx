import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Moon, 
  Sun,
  Home,
  BookOpen,
  Video,
  FileText,
  Settings,
  LogIn,
  LogOut,
  User,
  Bell,
  BookMarked,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

// Define navigation with the correct type
const Navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Mantras', href: '/mantras', icon: BookOpen },
  { name: 'Live Darshan', href: '/darshan', icon: Video },
  { name: 'Hindu Puja & Rituals', href: '/puja-rituals', icon: BookMarked },
  { name: 'Sacred Texts', href: '/pdf-reader', icon: FileText },
];

// Create a proper NavIcon component to handle Lucide icons
const NavIcon = ({ icon: Icon }) => {
  return Icon ? <Icon className="h-4 w-4" /> : null;
};

// Define Header props interface
interface HeaderProps {
  user?: any;
  onLoginClick?: () => void;
  loading?: boolean;
}

const Header = ({ user, onLoginClick, loading = false }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);
  
  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate('/login');
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      localStorage.removeItem('isLoggedIn');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isDark = theme === 'dark';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? isDark 
            ? 'bg-card/95 backdrop-blur-md border-b border-border/30' 
            : 'bg-background/95 backdrop-blur-sm border-b border-border/20' 
          : isDark
            ? 'bg-gradient-to-r from-slate-800 to-slate-900'
            : 'bg-gradient-to-r from-hindu-orange/90 to-hindu-red/90'
      }`}
    >
      <div className="container mx-auto">
        <nav className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-3 rounded-full px-2 py-1.5 transition-all duration-300 hover:bg-white/10"
            >
              <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                isDark 
                  ? 'bg-hindu-orange text-white' 
                  : 'bg-white text-hindu-orange'
              }`}>
                <span className="text-xl font-bold">ॐ</span>
              </div>
              <div className={`font-bold text-lg tracking-wide ${
                isDark 
                  ? 'text-white/90' 
                  : 'text-slate-800 bg-white/80 px-2 py-0.5 rounded-md'
              }`}>
                Divinity Harmony
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className={`flex gap-1 px-3 py-1.5 rounded-full ${
              isDark 
                ? 'bg-slate-700/70' 
                : isScrolled 
                  ? 'bg-muted/30' 
                  : 'bg-white/80'
            }`}>
              {Navigation.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all ${
                    location.pathname === item.href 
                      ? isDark 
                        ? 'bg-slate-900 text-white font-semibold shadow-sm' 
                        : 'bg-hindu-orange/90 text-white font-semibold' 
                      : isDark 
                        ? 'text-white hover:text-white hover:bg-slate-800' 
                        : 'text-slate-800 hover:text-hindu-orange hover:bg-white/60'
                  }`}
                >
                  <NavIcon icon={item.icon} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Right Side Menu */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${
                isDark 
                  ? 'bg-slate-700 text-white hover:bg-slate-600' 
                  : 'bg-white/80 text-slate-800 hover:bg-white'
              }`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* User account menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`relative h-9 w-9 rounded-full p-0 overflow-hidden ${
                      isDark ? 'ring-1 ring-white/30 bg-slate-700' : 'ring-2 ring-white bg-white'
                    }`}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL} alt={user.displayName} />
                      <AvatarFallback className={
                        isDark ? 'bg-slate-800 text-white font-semibold' : 'bg-white text-hindu-orange font-semibold'
                      }>
                        {user.displayName?.substring(0, 2) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="font-medium">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="font-medium">
                    <BookMarked className="mr-2 h-4 w-4" />
                    <span>My Pujas</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="font-medium">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className={`hidden sm:flex ${
                  isDark 
                    ? 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600' 
                    : 'bg-white text-hindu-orange font-semibold border-0 hover:bg-white/90'
                }`}
                onClick={handleLogin}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
            
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={isDark ? 'bg-slate-700 text-white' : 'bg-white/80 text-slate-800'}
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72">
                  <Link to="/" className="flex items-center gap-3 mb-8" onClick={() => setOpen(false)}>
                    <div className="h-10 w-10 bg-gradient-to-br from-hindu-orange to-hindu-red rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">ॐ</span>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hindu-orange to-hindu-red">
                      Divinity Harmony
                    </span>
                  </Link>
                  
                  <nav className="space-y-2 mb-8">
                    {Navigation.map((item, index) => (
                      <Link
                        key={index}
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          location.pathname === item.href
                            ? 'bg-muted font-bold text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 font-medium'
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </nav>
                  
                  <Separator className="my-6" />
                  
                  {user ? (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10 ring-1 ring-border">
                          <AvatarImage src={user.photoURL} alt={user.displayName} />
                          <AvatarFallback className="font-semibold">{user.displayName?.substring(0, 2) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold">{user.displayName || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[190px]">{user.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start font-medium" 
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-hindu-orange to-hindu-red mb-4 font-semibold text-white" 
                      onClick={() => {
                        handleLogin();
                        setOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login / Register
                    </Button>
                  )}
                  
                  <div className="mt-auto">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="w-full justify-start font-medium"
                    >
                      {isDark ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
