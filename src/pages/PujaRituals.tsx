import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Calendar, RotateCw, Home, Baby, HeartHandshake, Flame, SunMoon, Clock, Video, Briefcase, Bell, X, Mail, Phone, User, MapPin, Loader2, Repeat } from 'lucide-react';
import { ThemeProvider } from '@/hooks/use-theme';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  GeoPoint, 
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC0j2DROvG6v0PXZx0F_qiQuxYR6QDNGBU",
  authDomain: "divinity-harmony.firebaseapp.com",
  projectId: "divinity-harmony",
  storageBucket: "divinity-harmony.appspot.com",
  messagingSenderId: "711540812083",
  appId: "1:711540812083:web:5a6b99f5b678e4c6f22a33"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
// ... existing code ...

interface RitualItem {
  title: string;
  description: string;
  duration?: string;
  season?: string;
  remedy?: string;
  repetitions?: string;
  icon?: React.ReactNode;
  mantra?: string;
  benefits?: string;
  procedure?: string;
  items?: string[];
}

interface Priest {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  location: GeoPoint;
  phone: string;
  email: string;
  address: string;
  photoUrl: string;
  available: boolean;
  rating: number;
}

interface UserLocation {
  latitude: number;
  longitude: number;
}

const PujaRituals = () => {
  const [activeTab, setActiveTab] = useState('daily-pujas');
  const [selectedRitual, setSelectedRitual] = useState<RitualItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  
  // Authentication states
  const [user, setUser] = useState<any>(null);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  
  // Priest connection states
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearbyPriests, setNearbyPriests] = useState<Priest[]>([]);
  const [isLoadingPriests, setIsLoadingPriests] = useState(false);
  const [isPriestDialogOpen, setIsPriestDialogOpen] = useState(false);
  
  // Map view states
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  
  // Newsletter subscription states
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');
  const [isNewsletterDialogOpen, setIsNewsletterDialogOpen] = useState(false);

  const categories = [
    { id: 'daily-pujas', label: 'Daily Pujas', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'festive-pujas', label: 'Festive Pujas', icon: <Calendar className="h-4 w-4" /> },
    { id: 'astrological', label: 'Astrological Rituals', icon: <SunMoon className="h-4 w-4" /> },
    { id: 'special-rituals', label: 'Special Rituals', icon: <Home className="h-4 w-4" /> },
    { id: 'yagna-havan', label: 'Yagnya & Havan', icon: <Flame className="h-4 w-4" /> },
    { id: 'mantra-guide', label: 'Mantra Guides', icon: <BookOpen className="h-4 w-4" /> }
  ];

  const dailyPujas = [
    { 
      title: 'Ganesh Puja', 
      description: 'Morning ritual to Lord Ganesha for removing obstacles', 
      duration: '15 mins',
      mantra: 'Om Gan Ganapataye Namah',
      benefits: 'Removes obstacles, grants success and wisdom',
      procedure: 'Place Ganesh idol or picture, offer red flowers, modak (sweet), light a lamp and incense, recite the mantra 108 times',
      items: ['Ganesh idol/picture', 'Red flowers', 'Modak/sweets', 'Incense', 'Red cloth']
    },
    { 
      title: 'Shiva Puja', 
      description: 'Ritual honoring Lord Shiva', 
      duration: '20 mins',
      mantra: 'Om Namah Shivaya',
      benefits: 'Purifies karma, grants inner strength and protection from negative energies',
      procedure: 'Offer water, milk, honey, yogurt, and Bilva leaves to Shiva Lingam, recite the mantra 108 times',
      items: ['Shiva Lingam', 'Bilva leaves', 'Milk', 'Yogurt', 'Honey', 'Ghee', 'Water']
    },
    { 
      title: 'Durga Puja', 
      description: 'Ritual honoring the Divine Mother', 
      duration: '25 mins',
      mantra: 'Om Dum Durgaye Namah',
      benefits: 'Provides protection, removes fears, bestows courage and strength',
      procedure: 'Offer red flowers, vermillion, sweets, light a lamp with ghee, recite the mantra 108 times',
      items: ['Durga image', 'Red flowers', 'Kumkum', 'Sweets', 'Red cloth']
    },
    { 
      title: 'Vishnu Puja', 
      description: 'Ritual worship of Lord Vishnu, the preserver', 
      duration: '20 mins',
      mantra: 'Om Namo Bhagavate Vasudevaya',
      benefits: 'Protection, prosperity, dharmic life, and spiritual evolution',
      procedure: 'Offer Tulsi leaves, yellow flowers, sandalwood paste, and perform aarti with recitation',
      items: ['Vishnu image', 'Tulsi leaves', 'Yellow flowers', 'Sandalwood paste']
    },
    { 
      title: 'Hanuman Puja', 
      description: 'Ritual for strength and devotion', 
      duration: '15 mins',
      mantra: 'Om Hanumate Namah',
      benefits: 'Strength, courage, protection from negative energies, devotion',
      procedure: 'Offer red flowers and sindoor, recite Hanuman Chalisa and the mantra',
      items: ['Hanuman image', 'Red flowers', 'Sindoor', 'Oil lamp']
    },
    { 
      title: 'Surya Puja', 
      description: 'Ritual offering to the Sun God', 
      duration: '10 mins',
      mantra: 'Om Hreem Suryaya Namah',
      benefits: 'Good health, vitality, success, spiritual enlightenment',
      procedure: 'Offer water to the rising sun, recite Aditya Hridayam or the mantra 12 times',
      items: ['Copper vessel with water', 'Red flowers', 'Red sandalwood']
    },
    { 
      title: 'Lakshmi Puja', 
      description: 'Evening ritual for wealth and prosperity', 
      duration: '20 mins',
      mantra: 'Om Shreem Mahalakshmiye Namah',
      benefits: 'Prosperity, abundance, material and spiritual wealth',
      procedure: 'Clean home, place coins and rice with the deity, offer red flowers and perform aarti',
      items: ['Lakshmi image', 'Red flowers', 'Coins', 'Rice', 'Lotus', 'Incense']
    },
    { 
      title: 'Saraswati Puja', 
      description: 'Ritual for knowledge and wisdom', 
      duration: '15 mins',
      mantra: 'Om Aim Saraswatyai Namah',
      benefits: 'Knowledge, creativity, learning ability, artistic talents',
      procedure: 'Place books and instruments near the deity, offer white flowers and perform aarti',
      items: ['Saraswati image', 'White flowers', 'Books', 'Musical instruments']
    },
    { 
      title: 'Kartikeya Puja', 
      description: 'Ritual to Lord Kartikeya, commander of divine forces', 
      duration: '15 mins',
      mantra: 'Om Saravanabhavaya Namah',
      benefits: 'Victory over enemies, courage, protection from negative forces',
      procedure: 'Offer red flowers, perform abhishekam with milk, recite the mantra',
      items: ['Kartikeya image', 'Red flowers', 'Milk', 'Peacock feather']
    },
    { 
      title: 'Bhairav Puja', 
      description: 'Ritual to the fierce form of Lord Shiva for protection', 
      duration: '30 mins',
      mantra: 'Om Hreem Batuk Bhairavaya Namah',
      benefits: 'Instant protection, removes obstacles, spiritual awakening',
      procedure: 'Perform at night, offer black sesame seeds, alcohol (symbolic), and recite mantras',
      items: ['Bhairav image', 'Black sesame seeds', 'Black flowers', 'Oil lamp']
    },
    { 
      title: 'Dattatreya Puja', 
      description: 'Worship of the trinity of Brahma, Vishnu, and Shiva in one form', 
      duration: '20 mins',
      mantra: 'Om Shri Gurudev Datta',
      benefits: 'Balance of creation, preservation, and dissolution energies',
      procedure: 'Offer mixed fruits, flowers of three colors, and coconut',
      items: ['Dattatreya image', 'Mixed fruits', 'Flowers of three colors', 'Coconut']
    },
    { 
      title: 'Tulsi Puja', 
      description: 'Worship of the sacred Tulsi plant', 
      duration: '10 mins',
      mantra: 'Om Tulasi Devyai Namah',
      benefits: 'Purification, healing, protection, connection to Vishnu',
      procedure: 'Water the Tulsi plant, circumambulate, offer flowers and water',
      items: ['Tulsi plant', 'Water', 'Flowers', 'Lamp']
    },
    { 
      title: 'Shani Puja', 
      description: 'Ritual to appease Saturn', 
      duration: '25 mins',
      mantra: 'Om Sham Shaneshcharaya Namah',
      benefits: 'Relief from Saturn-related troubles, discipline, patience',
      procedure: 'Offer black sesame seeds, iron items, mustard oil, recite mantra on Saturday',
      items: ['Shani image', 'Black sesame seeds', 'Mustard oil', 'Black cloth', 'Iron items']
    },
    { 
      title: 'Chandra Puja', 
      description: 'Worship of the Moon deity', 
      duration: '15 mins',
      mantra: 'Om Chandraya Namah',
      benefits: 'Mental peace, emotional balance, intuition, good sleep',
      procedure: 'Perform on full moon, offer white flowers, milk, and rice pudding',
      items: ['Silver items', 'White flowers', 'Milk', 'Rice pudding']
    },
    { 
      title: 'Mangala Puja', 
      description: 'Ritual to Mars for strength and courage', 
      duration: '15 mins',
      mantra: 'Om Angarakaya Namah',
      benefits: 'Courage, strength, victory over enemies, land prosperity',
      procedure: 'Perform on Tuesday, offer red flowers, red sandalwood paste',
      items: ['Mangala image', 'Red flowers', 'Red lentils', 'Red cloth']
    },
    { 
      title: 'Navagraha Puja', 
      description: 'Ritual to the nine planets', 
      duration: '45 mins',
      mantra: 'Om Navagrahaya Namah',
      benefits: 'Planetary balance, removal of negative planetary influences',
      procedure: 'Offer specific items to each planet, recite respective mantras',
      items: ['Navagraha yantra', 'Different colored items for each planet', 'Nine types of grains']
    },
    { 
      title: 'Kuber Puja', 
      description: 'Ritual to the lord of wealth', 
      duration: '20 mins',
      mantra: 'Om Yakshaya Kuberaya Namah',
      benefits: 'Material prosperity, abundance, financial wisdom',
      procedure: 'Offer yellow flowers, coins, gold items, and recite mantras',
      items: ['Kuber image', 'Yellow flowers', 'Coins', 'Gold items', 'Sweets']
    },
    { 
      title: 'Rudra Abhishek Puja', 
      description: 'Special anointment ritual to Lord Shiva', 
      duration: '40 mins',
      mantra: 'Om Namah Shivaya',
      benefits: 'Deep purification, spiritual evolution, divine blessings',
      procedure: 'Anoint Shiva Lingam with various substances while reciting Rudram',
      items: ['Shiva Lingam', 'Milk', 'Curd', 'Honey', 'Ghee', 'Sugar', 'Panchamrit']
    },
    { 
      title: 'Gayatri Puja', 
      description: 'Worship of the supreme Vedic mantra personified as a goddess', 
      duration: '30 mins',
      mantra: 'Om Bhur Bhuvah Swaha',
      benefits: 'Spiritual illumination, purification, divine wisdom',
      procedure: 'Perform sandhya vandana, light ghee lamp, recite Gayatri Mantra 108 times',
      items: ['Gayatri image', 'Yellow flowers', 'Ghee lamp', 'Sacred thread']
    },
    { 
      title: 'Sai Baba Puja', 
      description: 'Devotional worship to Shirdi Sai Baba', 
      duration: '20 mins',
      mantra: 'Om Sai Namo Namah',
      benefits: 'Grace, miracles, fulfillment of wishes, spiritual guidance',
      procedure: 'Offer flowers, incense, and perform aarti on Thursday',
      items: ['Sai Baba image', 'White flowers', 'Incense', 'Oil lamp', 'Coconut']
    },
  ];

  const festivePujas = [
    { 
      title: 'Diwali Lakshmi Puja', 
      description: 'Celebration of light and prosperity', 
      season: 'October/November',
      mantra: 'Om Shreem Mahalakshmiye Namah',
      benefits: 'Prosperity, divine blessings, removal of darkness and ignorance',
      procedure: 'Clean house, make rangoli, light diyas, perform Lakshmi puja in evening',
      items: ['Lakshmi-Ganesh idols', 'New clothes', 'Sweets', 'Diyas', 'Rangoli colors']
    },
    { 
      title: 'Navratri Durga Puja', 
      description: 'Nine nights honoring Goddess Durga', 
      season: 'March/April & September/October',
      mantra: 'Om Aim Hreem Kleem Chamundaye Vichche',
      benefits: 'Divine feminine energy, removal of obstacles, spiritual awakening',
      procedure: 'Nine days of fasting, chanting, and worship of different forms of goddess',
      items: ['Durga idol/image', 'Red cloth', 'Kumkum', 'Fruits', 'Coconut']
    },
    { 
      title: 'Janmashtami Krishna Puja', 
      description: 'Celebration of Lord Krishna\'s birth', 
      season: 'August/September',
      mantra: 'Om Namo Bhagavate Vasudevaya',
      benefits: 'Divine love, spiritual wisdom, joyful consciousness',
      procedure: 'Fast until midnight, decorate Krishna cradle, sing bhajans, break fast after birth time',
      items: ['Krishna idol', 'Cradle', 'Butter', 'Milk', 'Flute', 'Peacock feather']
    },
    { 
      title: 'Maha Shivaratri Puja', 
      description: 'Night dedicated to Lord Shiva', 
      season: 'February/March',
      mantra: 'Om Namah Shivaya',
      benefits: 'Spiritual awakening, divine consciousness, removal of karma',
      procedure: 'All-night vigil, offer bilva leaves every 3 hours, perform abhishekam',
      items: ['Shiva Lingam', 'Bilva leaves', 'Milk', 'Yogurt', 'Honey', 'Rudraksha']
    },
    { 
      title: 'Chhath Puja', 
      description: 'Worship of Sun God and Chhathi Maiya', 
      season: 'October/November',
      mantra: 'Om Adityaya Namah',
      benefits: 'Good health, prosperity, longevity, family well-being',
      procedure: 'Four-day ritual with fasting, standing in water, offering arghya to setting and rising sun',
      items: ['Bamboo basket', 'Sugarcane', 'Thekua (sweet)', 'Fruits', 'Coconut']
    },
    { 
      title: 'Raksha Bandhan Puja', 
      description: 'Sacred bond between brothers and sisters', 
      season: 'July/August',
      mantra: 'Om Namah Shivaya',
      benefits: 'Protection, strengthening of family bonds, brotherly duties',
      procedure: 'Sister ties rakhi on brother\'s wrist, applies tilak, brother gives gifts and promises protection',
      items: ['Rakhi thread', 'Kumkum', 'Rice', 'Sweets', 'Diya', 'Gifts']
    },
    { 
      title: 'Holi Narasimha Puja', 
      description: 'Color festival with worship of Lord Narasimha', 
      season: 'March',
      mantra: 'Om Namo Narasimhaya',
      benefits: 'Victory of good over evil, protection from negative energies',
      procedure: 'Holika bonfire the night before, playing with colors next day, evening puja',
      items: ['Narasimha image', 'Colors', 'Sweets', 'Thandai (drink)', 'Coconut']
    },
    { 
      title: 'Guru Purnima Puja', 
      description: 'Honoring spiritual teachers and gurus', 
      season: 'July',
      mantra: 'Om Guruve Namah',
      benefits: 'Spiritual guidance, knowledge, blessings from the teacher lineage',
      procedure: 'Worship of guru\'s feet, study of spiritual texts, offering of fruits and flowers',
      items: ['Guru\'s paduka/image', 'White flowers', 'Fruits', 'Books', 'Incense']
    },
    { 
      title: 'Kartik Purnima Puja', 
      description: 'Full moon of Kartik month with special significance', 
      season: 'November',
      mantra: 'Om Vishnuve Namah',
      benefits: 'Spiritual merit, prosperity, removal of sins',
      procedure: 'Take holy bath in sacred rivers before sunrise, light lamps, perform arati',
      items: ['Clay lamps', 'Oil', 'Cotton wicks', 'Flowers', 'Incense']
    },
    { 
      title: 'Makar Sankranti Puja', 
      description: 'Harvest festival marking sun\'s transit into Capricorn', 
      season: 'January 14th',
      mantra: 'Om Suryaya Namah',
      benefits: 'Health, prosperity, new beginnings, positive change',
      procedure: 'Holy bath, offering to Sun God, flying kites, distributing til-gur (sesame-jaggery)',
      items: ['Sesame seeds', 'Jaggery', 'Sugarcane', 'Rice', 'Kites']
    },
    { 
      title: 'Basant Panchami Puja', 
      description: 'Spring festival honoring Goddess Saraswati', 
      season: 'January/February',
      mantra: 'Om Saraswatyai Namah',
      benefits: 'Knowledge, learning, arts, music, creativity',
      procedure: 'Wear yellow clothes, place books near goddess, offer yellow flowers',
      items: ['Saraswati image', 'Yellow flowers', 'Books', 'Yellow cloth', 'Instruments']
    },
    { 
      title: 'Ram Navami Puja', 
      description: 'Birthday celebration of Lord Rama', 
      season: 'March/April',
      mantra: 'Om Sri Ramaya Namah',
      benefits: 'Righteousness, moral strength, ideal character',
      procedure: 'Continuous recitation of Ramayana, decorate cradle, perform aarti at noon',
      items: ['Rama idol', 'Cradle', 'Bow and arrow', 'Sweets', 'Panchamrit']
    },
    { 
      title: 'Ganesh Chaturthi Puja', 
      description: 'Festival honoring Lord Ganesha', 
      season: 'August/September',
      mantra: 'Om Gam Ganapataye Namah',
      benefits: 'Removal of obstacles, success in new beginnings, wisdom',
      procedure: 'Install clay Ganesh idol, perform 16-step puja, immersion on final day',
      items: ['Ganesh idol', 'Red flowers', 'Modak (sweet)', '21 durva grass', 'Red cloth']
    },
    { 
      title: 'Sharad Purnima Puja', 
      description: 'Autumn full moon celebration', 
      season: 'October',
      mantra: 'Om Chandra Devaya Namah',
      benefits: 'Health, beauty, prosperity, spiritual energy',
      procedure: 'Prepare rice kheer, leave under moonlight, consume as prasad next morning',
      items: ['Silver/steel vessel', 'Rice kheer', 'White flowers', 'Moonstone']
    },
    { 
      title: 'Kumbh Mela Rituals', 
      description: 'Largest spiritual gathering for holy bath', 
      season: 'Rotates between four locations over 12 years',
      mantra: 'Om Ganga Maiya Namah',
      benefits: 'Spiritual purification, liberation from rebirth cycle',
      procedure: 'Holy bath in sacred rivers on auspicious dates, attend saints\' discourses',
      items: ['Copper/brass pot', 'Sacred water', 'Saffron clothes', 'Rudraksha']
    },
    { 
      title: 'Bhai Dooj Puja', 
      description: 'Brother-sister festival after Diwali', 
      season: 'October/November',
      mantra: 'Om Yama Devaya Namah',
      benefits: 'Sibling bond, brotherly protection, long life',
      procedure: 'Sister applies tilak on brother\'s forehead, performs aarti, brother gives gifts',
      items: ['Tilak material', 'Aarti thali', 'Sweets', 'Gifts', 'Coconut']
    },
    { 
      title: 'Tulsi Vivah Puja', 
      description: 'Marriage ceremony of Tulsi plant with Lord Vishnu', 
      season: 'November',
      mantra: 'Om Tulasi Devyai Namah',
      benefits: 'Marital happiness, prosperity, connection to Vishnu',
      procedure: 'Decorate Tulsi plant as bride, Vishnu/Shaligram as groom, perform marriage ceremony',
      items: ['Tulsi plant', 'Shaligram/Vishnu idol', 'Wedding items', 'Sugarcane', 'Sweets']
    },
    { 
      title: 'Karwa Chauth Puja', 
      description: 'Fasting by married women for husband\'s longevity', 
      season: 'October/November',
      mantra: 'Om Somaya Namah',
      benefits: 'Marital happiness, husband\'s long life, family prosperity',
      procedure: 'Day-long fast, evening puja with karwa (pot), view moon through sieve, husband offers water',
      items: ['Karwa (pot)', 'Sieve', 'Red clothes', 'Mehendi', 'Sweets']
    },
    { 
      title: 'Vata Savitri Puja', 
      description: 'Married women worship Banyan tree for husband\'s life', 
      season: 'May/June',
      mantra: 'Om Savitri Devi Namah',
      benefits: 'Husband\'s longevity, overcoming difficulties, family well-being',
      procedure: 'Tie thread around banyan tree, circle it 108 times, offer water and milk',
      items: ['Red thread', 'Banyan tree', 'Water pot', 'Fruits', 'Incense']
    },
    { 
      title: 'Gudi Padwa Puja', 
      description: 'Maharashtrian New Year celebration', 
      season: 'March/April',
      mantra: 'Om Brahmane Namah',
      benefits: 'New beginnings, prosperity, good fortune throughout the year',
      procedure: 'Raise gudi (cloth-decorated bamboo) outside home, perform puja, prepare special food',
      items: ['Bamboo stick', 'Silk cloth', 'Neem leaves', 'Sugar crystals', 'Coconut']
    },
  ];

  const astrologicalRituals = [
    { 
      title: 'Navagraha Shanti Puja', 
      description: 'Ritual to pacify the nine planets', 
      remedy: 'For career obstacles',
      mantra: 'Om Navagrahaya Namah',
      benefits: 'Balance planetary influences, remove obstacles, improve fortune',
      procedure: 'Offer specific items to each planet, recite respective mantras, wear recommended gemstones',
      items: ['Navagraha yantra', 'Nine different colors of cloth', 'Specific offerings for each planet']
    },
    { 
      title: 'Rahu-Ketu Puja', 
      description: 'Ritual for the shadow planets', 
      remedy: 'For removal of obstacles',
      mantra: 'Om Rahave Namah',
      benefits: 'Relief from Rahu-Ketu afflictions, spiritual transformation',
      procedure: 'Perform on Saturday during Rahu Kalam, offer black sesame, urad dal',
      items: ['Rahu-Ketu yantra', 'Black sesame seeds', 'Urad dal', 'Mustard oil', 'Black cloth']
    },
    { 
      title: 'Mangal Dosha Puja', 
      description: 'Ritual to neutralize Mars afflictions', 
      remedy: 'For marriage obstacles',
      mantra: 'Om Angarakaya Namah',
      benefits: 'Removes obstacles in marriage, neutralizes Mars-related problems',
      procedure: 'Perform on Tuesday, offer red flowers, sweets, recite mantras 108 times',
      items: ['Mangal yantra', 'Red flowers', 'Red cloth', 'Coral', 'Red lentils']
    },
    { 
      title: 'Chandra Puja', 
      description: 'Ritual for the Moon', 
      remedy: 'For mental peace',
      mantra: 'Om Chandraya Namah',
      benefits: 'Mental stability, emotional balance, peace of mind',
      procedure: 'Perform on Monday, offer white flowers, milk, rice, and silver items',
      items: ['Moon yantra', 'White flowers', 'Milk', 'Rice', 'Silver items', 'White cloth']
    },
    { 
      title: 'Shani Puja', 
      description: 'Ritual to pacify Saturn', 
      remedy: 'For career & health issues',
      mantra: 'Om Sham Shaneshcharaya Namah',
      benefits: 'Relief from Saturn-related troubles, discipline, life lessons',
      procedure: 'Perform on Saturday, offer black sesame, oil, iron items, recite Shani Stotra',
      items: ['Shani yantra', 'Black sesame seeds', 'Mustard oil', 'Iron items', 'Black cloth']
    },
    { 
      title: 'Brihaspati Puja', 
      description: 'Ritual for Jupiter, the guru of gods', 
      remedy: 'For knowledge & expansion',
      mantra: 'Om Guruve Namah',
      benefits: 'Knowledge, wisdom, expansion, spiritual growth, abundance',
      procedure: 'Perform on Thursday, offer yellow flowers, ghee, yellow items',
      items: ['Jupiter yantra', 'Yellow flowers', 'Ghee', 'Bananas', 'Yellow cloth', 'Gold items']
    },
    { 
      title: 'Surya Graha Shanti Puja', 
      description: 'Ritual for the Sun', 
      remedy: 'For vitality & success',
      mantra: 'Om Hreem Suryaya Namah',
      benefits: 'Vitality, leadership, success, authority, father-related issues',
      procedure: 'Perform on Sunday at sunrise, offer red flowers, copper items, recite Aditya Hridayam',
      items: ['Sun yantra', 'Red flowers', 'Copper items', 'Red sandalwood', 'Wheat', 'Jaggery']
    },
    { 
      title: 'Chandra Graha Shanti Puja', 
      description: 'Ritual for lunar balance', 
      remedy: 'For emotional stability',
      mantra: 'Om Somaya Namah',
      benefits: 'Emotional healing, intuition, motherhood, comfort, peace',
      procedure: 'Perform on Monday evening, offer white flowers, milk, wear pearl',
      items: ['Moon yantra', 'White flowers', 'Milk', 'Pearl', 'White rice', 'Silver items']
    },
    { 
      title: 'Kuja Dosha Nivaran Puja', 
      description: 'Ritual to remove Mars afflictions in birth chart', 
      remedy: 'For marriage compatibility',
      mantra: 'Om Mangalaya Namah',
      benefits: 'Removes marriage obstacles, enhances relationship harmony',
      procedure: 'Perform Kuja Dosha Nivaran ritual on Tuesday, offer red items',
      items: ['Mars yantra', 'Coral', 'Red cloth', 'Red flowers', 'Sweets', 'Copper items']
    },
    { 
      title: 'Ketu Puja', 
      description: 'Ritual for the south node of the moon', 
      remedy: 'For spiritual growth',
      mantra: 'Om Ketave Namah',
      benefits: 'Spiritual insight, liberation from past karma, psychic abilities',
      procedure: 'Perform with Rahu puja, offer multicored items, durva grass',
      items: ['Ketu yantra', 'Multicolored cloth', 'Durva grass', 'Frankincense', 'Honey']
    },
    { 
      title: 'Budh Puja', 
      description: 'Ritual for Mercury', 
      remedy: 'For intelligence & communication',
      mantra: 'Om Budhaya Namah',
      benefits: 'Intelligence, communication skills, business acumen, studies',
      procedure: 'Perform on Wednesday, offer green items, recite Mercury mantras',
      items: ['Mercury yantra', 'Green items', 'Emerald', 'Mung dal', 'Green cloth']
    },
    { 
      title: 'Guru Chandal Dosh Nivaran Puja', 
      description: 'Ritual to neutralize Jupiter-Rahu conjunction', 
      remedy: 'For spiritual confusion',
      mantra: 'Om Guru Rahave Namah',
      benefits: 'Clears spiritual confusion, helps find true guru, removes obstacles',
      procedure: 'Special puja when Jupiter and Rahu are conjunct, offer special items',
      items: ['Special yantra', 'Turmeric', 'Yellow and black clothes', 'Mixed grains']
    },
    { 
      title: 'Pitra Dosha Puja', 
      description: 'Ritual to appease ancestors', 
      remedy: 'For ancestral blessings',
      mantra: 'Om Pitra Devaya Namah',
      benefits: 'Ancestral blessings, relief from generational issues',
      procedure: 'Perform Shraddha rituals, offer water and food to ancestors',
      items: ['Sesame seeds', 'Black til', 'Rice balls (pinda)', 'Water pot', 'Milk']
    },
    { 
      title: 'Naga Dosha Puja', 
      description: 'Ritual to remove serpent-related afflictions', 
      remedy: 'For skin issues & infertility',
      mantra: 'Om Nag Devaya Namah',
      benefits: 'Helps with skin problems, infertility, removes snake-related curses',
      procedure: 'Worship Naga deity, offer milk and turmeric, perform Naga Pratishtha',
      items: ['Naga image', 'Milk', 'Turmeric', 'Flowers', 'Nagpanchami offerings']
    },
    { 
      title: 'Sade Sati Shanti Puja', 
      description: 'Ritual during Saturn\'s 7.5 year transit', 
      remedy: 'For Saturn\'s long transit',
      mantra: 'Om Shanicharaya Namah',
      benefits: 'Eases difficulties during Saturn\'s 7.5 year transit period',
      procedure: 'Long-term Saturn remedies, recite Shani Stotra, donate black items',
      items: ['Shani yantra', 'Black sesame', 'Iron items', 'Oil', 'Black urad dal']
    },
    { 
      title: 'Purnima Chandra Shanti Puja', 
      description: 'Full moon ritual for lunar problems', 
      remedy: 'For mind-related issues',
      mantra: 'Om Chandra Devaya Namah',
      benefits: 'Mental clarity, emotional healing, feminine energy balance',
      procedure: 'Perform on full moon night, offer white items, coconut water',
      items: ['Silver items', 'White flowers', 'Rice', 'Coconut', 'Camphor']
    },
    { 
      title: 'Shukra Puja', 
      description: 'Ritual for Venus', 
      remedy: 'For relationship harmony',
      mantra: 'Om Shukraya Namah',
      benefits: 'Love, relationships, beauty, luxury, artistic talents',
      procedure: 'Perform on Friday, offer white flowers, wear diamond or zircon',
      items: ['Venus yantra', 'White flowers', 'Diamond/zircon', 'Curd', 'Silver items']
    },
    { 
      title: 'Vish Yog Nivaran Puja', 
      description: 'Ritual to neutralize poisonous planetary combinations', 
      remedy: 'For harmful combinations',
      mantra: 'Om Vishayogaya Namah',
      benefits: 'Neutralizes harmful planetary combinations in birth chart',
      procedure: 'Identify toxic combinations in chart, perform specific remedies',
      items: ['Special yantra', 'Specific offerings based on combinations', 'Protective amulet']
    },
    { 
      title: 'Mahadasha Nivaran Puja', 
      description: 'Ritual at the beginning of planetary periods', 
      remedy: 'For planetary transition periods',
      mantra: 'Om Dashanathaya Namah',
      benefits: 'Smoothens transition between planetary periods (dashas)',
      procedure: 'Perform at the beginning of new dasha period, specific planet remedies',
      items: ['Dasha lord yantra', 'Items specific to the planet', 'Customized offerings']
    },
    { 
      title: 'Astrology Chart Rituals', 
      description: 'Comprehensive rituals based on birth chart', 
      remedy: 'For holistic improvement',
      mantra: 'Om Jyotish Devaya Namah',
      benefits: 'Overall improvement of life based on birth chart analysis',
      procedure: 'Complete analysis of chart, remedies for all afflictions',
      items: ['Personal birth chart', 'Customized yantra', 'Specific gemstones', 'Tailored mantras']
    },
  ];

  const specialRituals = [
    { 
      title: 'Griha Pravesh Puja', 
      description: 'Housewarming ceremony', 
      icon: <Home className="h-4 w-4" />,
      mantra: 'Om Vastupurushaya Namah',
      benefits: 'Purifies new home, invites positive energies, protection',
      procedure: 'Perform on auspicious day, enter with right foot, light lamp in northeast',
      items: ['Kalash with water', 'Coconut', 'Mango leaves', 'Cow', 'Rice', 'New clothes']
    },
    { 
      title: 'Saraswati Puja for Students', 
      description: 'Special ritual for academic success', 
      icon: <BookOpen className="h-4 w-4" />,
      mantra: 'Om Aim Saraswatyai Namah',
      benefits: 'Academic success, creativity, knowledge enhancement',
      procedure: 'Place books near deity, offer white flowers, perform during exams',
      items: ['Saraswati image', 'White flowers', 'Books', 'White cloth', 'Pen/pencil']
    },
    { 
      title: 'Kali Puja for Protection', 
      description: 'Powerful ritual for spiritual protection', 
      icon: <Flame className="h-4 w-4" />,
      mantra: 'Om Kreem Kalikaye Namah',
      benefits: 'Protection from negative energies, spiritual awakening, courage',
      procedure: 'Perform at night, offer red flowers, recite Kali mantras',
      items: ['Kali image', 'Red flowers', 'Red cloth', 'Sweets', 'Oil lamp']
    },
    { 
      title: 'Satyanarayan Katha', 
      description: 'Story recitation ritual to Lord Vishnu', 
      icon: <BookOpen className="h-4 w-4" />,
      mantra: 'Om Satyanarayanaya Namah',
      benefits: 'Fulfillment of wishes, prosperity, well-being',
      procedure: 'Perform on full moon day, recite story, distribute prasad',
      items: ['Vishnu image', 'Panchagavya', 'Banana leaf', 'Betel nut', 'Five fruits']
    },
    { 
      title: 'Sudarshan Homa', 
      description: 'Fire ritual with Sudarshan mantra', 
      icon: <Flame className="h-4 w-4" />,
      mantra: 'Om Sudarshanaya Namah',
      benefits: 'Destroys enemies, removes obstacles, spiritual protection',
      procedure: 'Perform fire ritual, offer ghee with recitation of Sudarshan mantra',
      items: ['Fire altar', 'Ghee', 'Sudarshan yantra', 'Sandalwood', 'Herbs']
    },
    { 
      title: 'Rudra Abhishek', 
      description: 'Sacred bathing ritual of Lord Shiva', 
      icon: <SunMoon className="h-4 w-4" />,
      mantra: 'Om Namah Shivaya',
      benefits: 'Purification, spiritual evolution, divine blessings',
      procedure: 'Anoint Shiva Lingam with panchamrit while reciting Rudram',
      items: ['Shiva Lingam', 'Milk', 'Curd', 'Honey', 'Ghee', 'Sugar']
    },
    { 
      title: 'Vastu Shanti Puja', 
      description: 'Ritual to balance energies in living space', 
      icon: <Home className="h-4 w-4" />,
      mantra: 'Om Vastupurushaya Namah',
      benefits: 'Harmonizes living space, removes negative energies',
      procedure: 'Perform before moving or renovating, draw yantra, offer to directions',
      items: ['Vastu yantra', 'Five elements representation', 'Coconut', 'Copper pot']
    },
    { 
      title: 'Wedding Rituals', 
      description: 'Sacred ceremonies for marriage', 
      icon: <HeartHandshake className="h-4 w-4" />,
      mantra: 'Om Kalyana Devaya Namah',
      benefits: 'Sacred union, divine blessings for marital life',
      procedure: 'Multiple ceremonies including haldi, mehendi, saptapadi (seven steps)',
      items: ['Sacred fire', 'Mangalsutra', 'Sindoor', 'Toe rings', 'Wedding clothes']
    },
    { 
      title: 'Namkaran Sanskar', 
      description: 'Naming ceremony for newborns', 
      icon: <Baby className="h-4 w-4" />,
      mantra: 'Om Namakarana Namah',
      benefits: 'Auspicious beginning of life, divine protection for child',
      procedure: 'Perform on 11th or 12th day after birth, whisper name in child\'s ear',
      items: ['Horoscope chart', 'Honey', 'Ghee', 'New clothes', 'Sacred fire']
    },
    { 
      title: 'Annaprashan Puja', 
      description: 'First solid food ceremony for babies', 
      icon: <Baby className="h-4 w-4" />,
      mantra: 'Om Annapurna Devyai Namah',
      benefits: 'Blessings for health, proper nourishment, long life',
      procedure: 'Performed at 6 months, feed rice pudding, place objects for future prediction',
      items: ['Rice pudding', 'Various objects (book, pen, money, clay)', 'New clothes']
    },
    { 
      title: 'Upanayan Sanskar', 
      description: 'Sacred thread ceremony', 
      icon: <BookOpen className="h-4 w-4" />,
      mantra: 'Om Upanayanaya Namah',
      benefits: 'Initiation into spiritual learning, Vedic education beginning',
      procedure: 'Boy wears sacred thread, is taught Gayatri mantra, symbolic rebirth',
      items: ['Sacred thread', 'Deerskin', 'Staff', 'New clothes', 'Sacred fire']
    },
    { 
      title: 'Pitra Tarpan', 
      description: 'Ritual offering to ancestors', 
      icon: <SunMoon className="h-4 w-4" />,
      mantra: 'Om Pitra Devaya Namah',
      benefits: 'Peace for ancestors, removal of ancestral curses, family prosperity',
      procedure: 'Perform with water and black sesame seeds, offer prayers to ancestors',
      items: ['Black sesame seeds', 'Kush grass', 'Water pot', 'Rice balls (pinda)']
    },
    { 
      title: 'Shradh Puja', 
      description: 'Annual ritual for deceased ancestors', 
      icon: <Calendar className="h-4 w-4" />,
      mantra: 'Om Swadhisthaya Namah',
      benefits: 'Peace for departed souls, ancestral blessings',
      procedure: 'Perform on death anniversary, offer food, clothing, water',
      items: ['Kush grass', 'Black sesame', 'Rice balls', 'Water', 'Food offerings']
    },
    { 
      title: 'Kumbh Vivah', 
      description: 'Symbolic marriage with a pot', 
      icon: <HeartHandshake className="h-4 w-4" />,
      mantra: 'Om Kumbhaya Namah',
      benefits: 'Alternative for those who can\'t marry, spiritual fulfillment',
      procedure: 'Perform wedding rituals with sacred pot symbolizing spouse',
      items: ['Decorated pot', 'Wedding items', 'Sacred fire', 'Flowers', 'New clothes']
    },
    { 
      title: 'Garbha Sanskar', 
      description: 'Pregnancy rituals for child development', 
      icon: <Baby className="h-4 w-4" />,
      mantra: 'Om Garbhaya Namah',
      benefits: 'Healthy pregnancy, physical and mental development of child',
      procedure: 'Monthly rituals during pregnancy, meditations, music therapy',
      items: ['Specific fruits for each month', 'Yogurt', 'Milk', 'Sacred texts']
    },
    { 
      title: 'Vidyarambh Puja', 
      description: 'Ceremony to begin education', 
      icon: <BookOpen className="h-4 w-4" />,
      mantra: 'Om Saraswatyai Namah',
      benefits: 'Auspicious beginning of education, successful learning',
      procedure: 'Child writes first letters guided by guru, offering to Saraswati',
      items: ['Writing slate', 'Rice', 'Books', 'Lamp', 'Saraswati image']
    },
    { 
      title: 'Bhoomi Puja', 
      description: 'Ground-breaking ceremony before construction', 
      icon: <Home className="h-4 w-4" />,
      mantra: 'Om Vasudharaya Namah',
      benefits: 'Blessings for successful construction, permission from earth',
      procedure: 'Perform before construction begins, dig small hole, offer to earth',
      items: ['Coconut', 'Copper coins', 'Five types of grains', 'Honey', 'Milk']
    },
    { 
      title: 'Sundarkand Path', 
      description: 'Recitation of Ramayana\'s fifth chapter', 
      icon: <BookOpen className="h-4 w-4" />,
      mantra: 'Om Hanumate Namah',
      benefits: 'Removes obstacles, protection, success in difficult tasks',
      procedure: 'Recite Sundarkand chapter, offer red items to Hanuman',
      items: ['Ramayana text', 'Red flowers', 'Oil lamp', 'Sindoor', 'Sweets']
    },
    { 
      title: 'Sudarshan Chakra Puja', 
      description: 'Worship of Vishnu\'s divine discus', 
      icon: <RotateCw className="h-4 w-4" />,
      mantra: 'Om Sudarshanaya Namah',
      benefits: 'Protection from enemies, removal of obstacles, spiritual energy',
      procedure: 'Draw or worship Sudarshan Chakra yantra, recite specific mantras',
      items: ['Sudarshan yantra', 'Yellow flowers', 'Ghee lamp', 'Conch', 'Kumkum']
    },
    { 
      title: 'Mundan Ceremony', 
      description: 'First hair-cutting ceremony', 
      icon: <Baby className="h-4 w-4" />,
      mantra: 'Om Namakarana Namah',
      benefits: 'Removes negative energies from past life, healthy hair growth',
      procedure: 'Shave child\'s head (typically at 1-3 years), offer hair to deity/river',
      items: ['Silver scissors', 'New clothes', 'Sweets', 'Coconut', 'Offerings']
    },
  ];

  const yagnasAndHavans = [
    { 
      title: 'Maha Mrityunjaya Homa', 
      description: 'For health and overcoming fear of death', 
      duration: '3-4 hours',
      mantra: 'Om Tryambakam Yajamahe',
      benefits: 'Protection from untimely death, health, removing fear',
      procedure: 'Sacred fire ritual with ghee offerings while reciting Mahamrityunjaya mantra',
      items: ['Fire altar', 'Ghee', 'Havan samagri', 'Rudraksha', 'Bilva leaves']
    },
    { 
      title: 'Ganapati Homa', 
      description: 'For removing obstacles', 
      duration: '2-3 hours',
      mantra: 'Om Gam Ganapataye Namah',
      benefits: 'Removal of obstacles, success in new beginnings',
      procedure: 'Fire ceremony with offerings to Lord Ganesha, recitation of mantras',
      items: ['Fire altar', 'Modak', 'Red flowers', 'Durva grass', 'Red sandalwood']
    },
    { 
      title: 'Lakshmi Kubera Homa', 
      description: 'For wealth and prosperity', 
      duration: '3 hours',
      mantra: 'Om Hreem Shreem Kleem',
      benefits: 'Financial abundance, prosperity, removal of money obstacles',
      procedure: 'Sacred fire with special offerings to Goddess Lakshmi and Lord Kubera',
      items: ['Fire altar', 'Gold/silver coins', 'Rice', 'Lotus', 'Saffron', 'Ghee']
    },
    { 
      title: 'Sudarshan Homa', 
      description: 'For protection from negative energies', 
      duration: '4 hours',
      mantra: 'Om Sudarshanaya Namah',
      benefits: 'Divine protection, removal of negative energies, obstacles',
      procedure: 'Special fire ritual with Sudarshan mantra and chakra visualization',
      items: ['Fire altar', 'Ghee', 'Sudarshan yantra', 'Lotus seeds', 'Yellow flowers']
    },
    { 
      title: 'Rudra Homa', 
      description: 'For strength and transformation', 
      duration: '5-7 hours',
      mantra: 'Om Namah Shivaya',
      benefits: 'Powerful transformation, purification, spiritual power',
      procedure: 'Intensive fire ritual with Rudra mantras and specific offerings',
      items: ['Fire altar', 'Bilva leaves', 'Milk', 'Ghee', 'Rudraksha', 'Cow dung cakes']
    },
    { 
      title: 'Navagraha Homa', 
      description: 'For planetary positions', 
      duration: '6-8 hours',
      mantra: 'Om Navagrahaya Namah',
      benefits: 'Balances all nine planets, removes astrological obstacles',
      procedure: 'Nine-part fire ceremony with specific offerings for each planet',
      items: ['Fire altar', 'Nine types of grains', 'Nine colored cloths', 'Specific planetary offerings']
    },
    { 
      title: 'Chandi Homa', 
      description: 'Powerful ritual for Divine Mother', 
      duration: '8-10 hours',
      mantra: 'Om Dum Durgaye Namah',
      benefits: 'Divine feminine protection, removal of enemies, spiritual power',
      procedure: 'Intensive fire ceremony with recitation of Chandi Path',
      items: ['Fire altar', 'Red flowers', 'Sindoor', 'Ghee', 'Fruits', 'Special herbs']
    },
    { 
      title: 'Dhanvantri Homa', 
      description: 'For health and healing', 
      duration: '3 hours',
      mantra: 'Om Dhanvantaraye Namah',
      benefits: 'Physical healing, good health, longevity, medical knowledge',
      procedure: 'Fire ceremony with medicinal herbs and offerings to Lord Dhanvantri',
      items: ['Fire altar', 'Medicinal herbs', 'Ghee', 'Tulsi', 'Neem', 'Sandalwood']
    },
    { 
      title: 'Saraswati Homa', 
      description: 'For knowledge and education', 
      duration: '2-3 hours',
      mantra: 'Om Aim Saraswatyai Namah',
      benefits: 'Academic success, knowledge, creativity, artistic talents',
      procedure: 'Fire ceremony with white flower offerings, book worship',
      items: ['Fire altar', 'White flowers', 'Books', 'White rice', 'Ghee', 'White cloth']
    },
    { 
      title: 'Maha Lakshmi Homa', 
      description: 'For abundance and prosperity', 
      duration: '3-4 hours',
      mantra: 'Om Shreem Mahalakshmiye Namah',
      benefits: 'Financial prosperity, wealth, abundance in all areas',
      procedure: 'Fire ceremony with special offerings on Friday, lotus flowers',
      items: ['Fire altar', 'Lotus', 'Gold items', 'Rice', 'Coins', 'Red flowers']
    },
    { 
      title: 'Vishnu Homa', 
      description: 'For protection and sustenance', 
      duration: '4-5 hours',
      mantra: 'Om Namo Bhagavate Vasudevaya',
      benefits: 'Divine protection, balance, sustenance, dharmic life',
      procedure: 'Fire ceremony with Tulsi offerings, recitation of Vishnu mantras',
      items: ['Fire altar', 'Tulsi leaves', 'Yellow flowers', 'Ghee', 'Conch shell']
    },
    { 
      title: 'Shatru Nashak Homa', 
      description: 'For defeating enemies and obstacles', 
      duration: '3 hours',
      mantra: 'Om Shatrunashanaya Namah',
      benefits: 'Removes enemies, obstacles, negative influences',
      procedure: 'Specific fire ritual for removing obstacles, special mantras',
      items: ['Fire altar', 'Chili peppers', 'Black mustard', 'Salt', 'Lemons']
    },
    { 
      title: 'Bhairav Homa', 
      description: 'For immediate results and protection', 
      duration: '4 hours',
      mantra: 'Om Hreem Batuk Bhairavaya Namah',
      benefits: 'Immediate results, protection, removal of black magic',
      procedure: 'Nighttime fire ritual with specific offerings to Lord Bhairav',
      items: ['Fire altar', 'Black sesame', 'Alcohol (symbolic)', 'Meat (symbolic)', 'Black flag']
    },
    { 
      title: 'Baglamukhi Homa', 
      description: 'For victory over enemies', 
      duration: '4-5 hours',
      mantra: 'Om Hreem Baglamukhaye Namah',
      benefits: 'Victory in court cases, debates, paralysis of enemies',
      procedure: 'Fire ceremony with yellow offerings, specific tantric mantras',
      items: ['Fire altar', 'Yellow flowers', 'Turmeric', 'Yellow cloth', 'Lemons']
    },
    { 
      title: 'Sankat Mochan Hanuman Homa', 
      description: 'For removing difficulties', 
      duration: '3 hours',
      mantra: 'Om Hanumate Namah',
      benefits: 'Removes difficulties, provides courage and strength',
      procedure: 'Fire ceremony on Tuesday or Saturday with red offerings',
      items: ['Fire altar', 'Red flowers', 'Sindoor', 'Red sandalwood', 'Coconut']
    },
    { 
      title: 'Sarpa Dosha Homa', 
      description: 'For removal of snake-related curses', 
      duration: '3-4 hours',
      mantra: 'Om Nag Devaya Namah',
      benefits: 'Removes ancestral snake curses, helps with fertility issues',
      procedure: 'Special fire ceremony with Naga mantras and specific offerings',
      items: ['Fire altar', 'Milk', 'Turmeric', 'Naga yantra', 'White flowers']
    },
    { 
      title: 'Kanya Puja Homa', 
      description: 'For seeking blessing of divine feminine', 
      duration: '4 hours',
      mantra: 'Om Kanya Devyai Namah',
      benefits: 'Divine feminine blessings, prosperity, spiritual growth',
      procedure: 'Worship of young girls as divine mother, fire ceremony',
      items: ['Fire altar', 'New clothes for girls', 'Sweets', 'Red bangles', 'Fruits']
    },
    { 
      title: 'Santan Gopal Homa', 
      description: 'For child birth and progeny', 
      duration: '3 hours',
      mantra: 'Om Santan Gopalaya Namah',
      benefits: 'Blesses with children, removes obstacles to conception',
      procedure: 'Fire ceremony with special offerings to Lord Krishna',
      items: ['Fire altar', 'Cow milk', 'Butter', 'Tulsi', 'Conch', 'Yellow items']
    },
    { 
      title: 'Bhagwat Homa', 
      description: 'For devotion and spiritual elevation', 
      duration: '7 days',
      mantra: 'Om Bhagavate Namah',
      benefits: 'Spiritual elevation, devotion, divine grace',
      procedure: 'Week-long fire ceremony with recitation of Bhagavad Gita',
      items: ['Fire altar', 'Bhagavad Gita', 'Tulsi', 'Yellow flowers', 'Various fruits']
    },
    { 
      title: 'Gayatri Yagna', 
      description: 'For spiritual illumination', 
      duration: '24 hours',
      mantra: 'Om Bhur Bhuvah Swaha',
      benefits: 'Spiritual awakening, purification, divine wisdom',
      procedure: 'Continuous fire ceremony with Gayatri mantra recitation',
      items: ['Fire altar', 'Ghee', 'Sandalwood', 'Yellow flowers', 'Special herbs']
    },
  ];

  const mantraGuides = [
    { 
      title: 'Gayatri Mantra', 
      description: 'For knowledge and enlightenment', 
      repetitions: '108 times',
      mantra: 'Om Bhur Bhuvah Swaha, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat',
      benefits: 'Spiritual illumination, purification, divine wisdom, highest knowledge',
      procedure: 'Face east, preferably at sunrise or sunset, use rudraksha mala for counting',
      items: ['Rudraksha mala', 'Yellow clothes', 'Copper vessel with water', 'Sacred thread']
    },
    { 
      title: 'Mahamrityunjaya Mantra', 
      description: 'For health and overcoming fear', 
      repetitions: '108 times',
      mantra: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat',
      benefits: 'Healing, longevity, freedom from fear of death, protection from accidents',
      procedure: 'Chant during illness, before surgery, or daily for general protection',
      items: ['Rudraksha mala', 'Bilva leaves', 'Shiva Lingam (optional)', 'Water']
    },
    { 
      title: 'Om Namah Shivaya', 
      description: 'Universal mantra for Lord Shiva', 
      repetitions: '108 times',
      mantra: 'Om Namah Shivaya',
      benefits: 'Spiritual awakening, purification, destruction of negative karma',
      procedure: 'Can be chanted anytime, anywhere, especially powerful on Mondays',
      items: ['Rudraksha mala', 'Vibhuti (sacred ash)', 'Water', 'Bilva leaf']
    },
    { 
      title: 'Hare Krishna Maha Mantra', 
      description: 'For devotion and joy', 
      repetitions: 'As many as possible',
      mantra: 'Hare Krishna Hare Krishna, Krishna Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare',
      benefits: 'Pure devotion, spiritual joy, liberation, love of God',
      procedure: 'Chant aloud with devotion, can be done individually or in groups',
      items: ['Tulsi mala', 'Tulsi plant nearby', 'Picture of Krishna', 'Ghee lamp']
    },
    { 
      title: 'Lakshmi Mantra', 
      description: 'For wealth and prosperity', 
      repetitions: '108 times',
      mantra: 'Om Shreem Mahalakshmiyei Namah',
      benefits: 'Material prosperity, financial growth, abundance, success',
      procedure: 'Chant on Friday evenings, with lotus flower or coins nearby',
      items: ['Lotus flower', 'Coins', 'Red cloth', 'Oil or ghee lamp', 'Incense']
    },
    { 
      title: 'Ganesh Mantra', 
      description: 'For removing obstacles', 
      repetitions: '108 times',
      mantra: 'Om Gam Ganapataye Namah',
      benefits: 'Removal of obstacles, success in new ventures, intelligence',
      procedure: 'Chant before beginning any new project or daily for general protection',
      items: ['Modak (sweet)', 'Red flowers', 'Red cloth', 'Durva grass']
    },
    { 
      title: 'Durga Saptashati', 
      description: 'For divine protection and power', 
      repetitions: 'Complete text',
      mantra: 'Om Dum Durgayei Namah',
      benefits: 'Protection, courage, spiritual power, destruction of enemies',
      procedure: 'Recite complete text or chapters, especially during Navratri',
      items: ['Red flowers', 'Sindoor', 'Red cloth', 'Oil lamp', 'Incense']
    },
    { 
      title: 'Hanuman Chalisa', 
      description: 'Forty verses to Lord Hanuman', 
      repetitions: 'Once or more daily',
      mantra: 'Shri Guru Charan Saroj Raj...',
      benefits: 'Courage, strength, protection from negative energies',
      procedure: 'Recite on Tuesdays and Saturdays for best results',
      items: ['Red flowers', 'Sindoor', 'Oil lamp', 'Picture of Hanuman']
    },
    { 
      title: 'Vishnu Sahasranama', 
      description: 'Thousand names of Lord Vishnu', 
      repetitions: 'Once daily',
      mantra: 'Vishvam Vishnur Vashatkaro...',
      benefits: 'All-round protection, spiritual evolution, fulfillment of desires',
      procedure: 'Recite full text or selected portions, especially on Ekadashi',
      items: ['Tulsi leaves', 'Yellow flowers', 'Water', 'Conch shell']
    },
    { 
      title: 'Surya Mantra', 
      description: 'For vitality and health', 
      repetitions: '12 times',
      mantra: 'Om Hreem Suryaya Namah',
      benefits: 'Health, vitality, success, leadership, spiritual light',
      procedure: 'Chant at sunrise, facing the sun (eyes closed or indirect view)',
      items: ['Copper vessel with water', 'Red flowers', 'Red sandalwood paste']
    },
    { 
      title: 'Saraswati Mantra', 
      description: 'For knowledge and arts', 
      repetitions: '108 times',
      mantra: 'Om Aim Saraswatyei Namah',
      benefits: 'Learning ability, knowledge, artistic talents, eloquence',
      procedure: 'Chant before studying or practicing arts, especially on Basant Panchami',
      items: ['White flowers', 'Books', 'Paper and pen', 'White cloth']
    },
    { 
      title: 'Shani Mantra', 
      description: 'For relief from Saturn\'s influence', 
      repetitions: '108 times',
      mantra: 'Om Sham Shanaishcharaya Namah',
      benefits: 'Relief from Saturn\'s difficulties, patience, discipline',
      procedure: 'Chant on Saturdays, preferably before sunrise or during Saturn hours',
      items: ['Black sesame seeds', 'Iron items', 'Black cloth', 'Oil lamp']
    },
    { 
      title: 'Maa Kali Mantra', 
      description: 'For spiritual transformation', 
      repetitions: '108 times',
      mantra: 'Om Kreem Kalikaye Namah',
      benefits: 'Spiritual transformation, destruction of ego, divine protection',
      procedure: 'Chant at night, especially on new moon or Kali Puja night',
      items: ['Red flowers', 'Skull mala (symbolic)', 'Sweets', 'Oil lamp']
    },
    { 
      title: 'Sai Baba Mantra', 
      description: 'For grace and miracles', 
      repetitions: '108 times',
      mantra: 'Om Sai Namo Namah',
      benefits: 'Grace, problem-solving, faith, guidance',
      procedure: 'Chant on Thursdays for best results, with sincere faith',
      items: ['Sai Baba picture', 'Incense', 'Flowers', 'Coconut']
    },
    { 
      title: 'Navagraha Mantras', 
      description: 'For planetary balance', 
      repetitions: 'Specific for each planet',
      mantra: 'Various mantras for nine planets',
      benefits: 'Balances planetary influences, removes obstacles',
      procedure: 'Chant specific mantras for each planet on their respective days',
      items: ['Navagraha yantra', 'Planet-specific offerings', 'Oil lamp']
    },
    { 
      title: 'Narasimha Mantra', 
      description: 'For protection and courage', 
      repetitions: '108 times',
      mantra: 'Om Ugram Viram Mahavishnum Jwalantam Sarvatomukham, Nrisimham Bhishanam Bhadram Mrityumrityum Namaamyaham',
      benefits: 'Protection from enemies, courage, spiritual strength',
      procedure: 'Chant during dangers or for protection, especially at dusk',
      items: ['Honey', 'Yellow flowers', 'Oil lamp', 'Conch shell']
    },
    { 
      title: 'Ganesha Atharva Shirsha', 
      description: 'Advanced Ganesha worship text', 
      repetitions: 'Once daily',
      mantra: 'Om Namaste Ganapataye...',
      benefits: 'Deep connection with Ganesha, success, wisdom',
      procedure: 'Recite full text, especially before important endeavors',
      items: ['Modak', 'Red flowers', 'Red sandalwood paste', 'Durva grass']
    },
    { 
      title: 'Devi Mantra', 
      description: 'For divine feminine energy', 
      repetitions: '108 times',
      mantra: 'Om Aim Hreem Kleem Chamundaye Vichche',
      benefits: 'Divine feminine power, protection, spiritual awakening',
      procedure: 'Chant during Navratri or on full moon nights for best results',
      items: ['Red flowers', 'Kumkum', 'Bangles', 'Sweets', 'Mirror']
    },
    { 
      title: 'Rudram', 
      description: 'Powerful Shiva mantra from Yajurveda', 
      repetitions: 'Once or 11 times',
      mantra: 'Namaste Rudra Manyava...',
      benefits: 'Intense purification, spiritual evolution, divine blessings',
      procedure: 'Recite with correct pronunciation, especially on Shivaratri',
      items: ['Bilva leaves', 'Sacred ash', 'Rudraksha', 'Water', 'Milk']
    },
    { 
      title: 'Baglamukhi Mantra', 
      description: 'For victory over enemies', 
      repetitions: '108 times',
      mantra: 'Om Hleem Baglamukhiye Sarvadushta Shatro Stambyam Jihvam Keelaya Keelaya Bagalamukhi Sarvadushta Stambhnam Kuru Kuru Swaha',
      benefits: 'Victory in conflicts, paralyzes enemies, stops negative speech',
      procedure: 'Chant with focus on yellow color, visualizing enemies becoming still',
      items: ['Yellow flowers', 'Turmeric', 'Yellow cloth', 'Lemons']
    },
  ];

  const handleRitualClick = (ritual: RitualItem) => {
    setSelectedRitual(ritual);
    setIsDialogOpen(true);
  };

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Check for login parameter in URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('login') === 'true') {
      setIsLoginDialogOpen(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  // Get user location and search for priests on Google
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          handleSearchAfterNotification();
        },
        (error) => {
          console.error('Error getting location:', error);
          // If location access is denied, use a default location or show error
          setUserLocation({ latitude: 28.6139, longitude: 77.2090 }); // Default to Delhi
          handleSearchAfterNotification();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      // Use default location if geolocation is not supported
      setUserLocation({ latitude: 28.6139, longitude: 77.2090 }); // Default to Delhi
      handleSearchAfterNotification();
    }
  };

  const handleSearchAfterNotification = () => {
    if (userLocation) {
      setIsMapDialogOpen(true);
      setMapSearchQuery(`Hindu Priests near ${userLocation.latitude},${userLocation.longitude}`);
    }
  };
  
  // Fetch nearby priests
  const fetchNearbyPriests = async (location: UserLocation) => {
    try {
      // In a production app, you would use a geospatial query
      // For now, we'll fetch all priests as a simple demo
      const priestsRef = collection(db, "priests");
      const querySnapshot = await getDocs(priestsRef);
      
      const priests: Priest[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Priest, 'id'>;
        priests.push({ id: doc.id, ...data });
      });
      
      setNearbyPriests(priests);
      setIsLoadingPriests(false);
      setIsPriestDialogOpen(true);
    } catch (error) {
      console.error("Error fetching priests:", error);
      setIsLoadingPriests(false);
    }
  };
  
  // Handle newsletter subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setSubscriptionError('');
    
    try {
      // Add email to Firestore
      await addDoc(collection(db, "subscribers"), {
        email,
        timestamp: Timestamp.now(),
      });
      
      // Call Firebase function to send email
      const sendConfirmationEmail = httpsCallable(functions, 'sendConfirmationEmail');
      await sendConfirmationEmail({ email });
      
      setSubscriptionSuccess(true);
      setEmail('');
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setSubscriptionError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };
  
  // Handle login with Google
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsLoginDialogOpen(false);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  
  // Handle login with Facebook
  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      setIsLoginDialogOpen(false);
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Show category dialog
  const handleBellIconClick = () => {
    setShowCategoryDialog(true);
  };

  // Features section
  const features = [
    { title: 'Interactive Guides', description: 'Step-by-step audio and video tutorials', icon: <Video className="h-4 w-4" />, onClick: () => {} },
    { title: 'Daily Puja Reminders', description: 'Notifications based on Hindu calendar', icon: <Bell className="h-4 w-4" />, onClick: handleBellIconClick },
    { title: 'Virtual Puja Booking', description: 'Connect with priests for online rituals', icon: <Video className="h-4 w-4" />, onClick: getUserLocation },
    { title: 'Puja Samagri Delivery', description: 'Order necessary items online', icon: <Briefcase className="h-4 w-4" />, onClick: () => {} },
    { title: 'Live Streaming', description: 'Join pujas remotely', icon: <Video className="h-4 w-4" />, onClick: () => {} },
    { title: 'Muhurat Finder', description: 'Find auspicious times for rituals', icon: <Clock className="h-4 w-4" />, onClick: () => {} }
  ];

  const renderPujaItems = (items, type) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-md transition-all border-border/40 cursor-pointer"
            onClick={() => handleRitualClick(item)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                {item.icon && <div className="p-2 bg-muted rounded-full">{item.icon}</div>}
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                {type === 'daily' && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" /> {item.duration}
                  </Badge>
                )}
                {type === 'festive' && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3" /> {item.season}
                  </Badge>
                )}
                {type === 'astrological' && (
                  <Badge variant="outline" className="text-xs">
                    <RotateCw className="mr-1 h-3 w-3" /> {item.remedy}
                  </Badge>
                )}
                {type === 'yagna' && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="mr-1 h-3 w-3" /> {item.duration}
                  </Badge>
                )}
                {type === 'mantra' && (
                  <Badge variant="outline" className="text-xs">
                    <RotateCw className="mr-1 h-3 w-3" /> {item.repetitions}
                  </Badge>
                )}
                <Button size="sm" variant="ghost" className="text-xs">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <ThemeProvider>
      <Layout>
        <div className="container mx-auto px-4 pt-24 pb-8"> {/* Increased top padding to prevent header overlap */}
          {/* User profile indicator - only shown when logged in */}
          {user && (
            <div className="flex justify-end mb-4">
              <div className="flex items-center bg-muted/30 rounded-full p-1 pr-3">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user.photoURL} alt={user.displayName} />
                  <AvatarFallback>{user.displayName?.substring(0, 2) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user.displayName || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-hindu-orange/30 text-hindu-orange bg-hindu-orange/5">
              Spiritual Practices
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Hindu Puja & Rituals</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides for traditional Hindu ceremonies, pujas, and sacred rituals to connect with the divine.
            </p>
          </div>

          <Tabs defaultValue="daily-pujas" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full flex flex-wrap h-auto mb-8">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 py-2"
                >
                  {category.icon}
                  <span>{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="daily-pujas" className="mt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Daily Pujas (Nitya Puja)</h2>
                <p className="text-muted-foreground">Traditional pujas performed as part of daily devotional practice.</p>
              </div>
              {renderPujaItems(dailyPujas, 'daily')}
            </TabsContent>

            <TabsContent value="festive-pujas" className="mt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Festive Pujas (Parv Pujas)</h2>
                <p className="text-muted-foreground">Special pujas for important Hindu festivals and celebrations.</p>
              </div>
              {renderPujaItems(festivePujas, 'festive')}
            </TabsContent>

            <TabsContent value="astrological" className="mt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Astrological Rituals (Graha Pujas)</h2>
                <p className="text-muted-foreground">Rituals based on planetary positions and astrological remedies.</p>
              </div>
              {renderPujaItems(astrologicalRituals, 'astrological')}
            </TabsContent>

            <TabsContent value="special-rituals" className="mt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Special Life Rituals (Vishesha Vidhi)</h2>
                <p className="text-muted-foreground">Sacred ceremonies performed at significant life events.</p>
              </div>
              {renderPujaItems(specialRituals, 'special')}
            </TabsContent>

            <TabsContent value="yagna-havan" className="mt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Yagnya & Havan Rituals</h2>
                <p className="text-muted-foreground">Sacred fire ceremonies for spiritual purification and divine blessings.</p>
              </div>
              {renderPujaItems(yagnasAndHavans, 'yagna')}
            </TabsContent>

            <TabsContent value="mantra-guide" className="mt-4">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Mantra Chanting Guides</h2>
                <p className="text-muted-foreground">Correct pronunciation and chanting practices for sacred mantras.</p>
              </div>
              {renderPujaItems(mantraGuides, 'mantra')}
            </TabsContent>
          </Tabs>

          {/* Features section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">App Features</h2>
              <p className="text-muted-foreground">Enhance your spiritual practice with these helpful tools</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="flex flex-col items-center text-center p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={feature.onClick}
                >
                  <div className="p-3 bg-hindu-orange/10 rounded-full mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
          
          {/* CTA section */}
          <div className="mt-16 bg-gradient-to-r from-hindu-orange/20 to-hindu-gold/20 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Connect with a Priest</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Arrange for personalized guidance or book an online puja session with qualified Hindu priests.
            </p>
            <Button 
              className="bg-gradient-to-r from-hindu-orange to-hindu-gold hover:from-hindu-orange/90 hover:to-hindu-gold/90"
              onClick={getUserLocation}
            >
              Book a Session
            </Button>
          </div>

          {/* Newsletter Section */}
          <div className="mt-16 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Receive updates on new mantras, upcoming live darshans, and spiritual wisdom directly to your inbox.
            </p>
            
            {subscriptionSuccess ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4 max-w-md mx-auto">
                Subscription successful! Please check your email for confirmation.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="max-w-xs"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit" 
                  disabled={isSubscribing}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </form>
            )}
            
            {subscriptionError && (
              <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
                <AlertDescription>{subscriptionError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Category Dialog */}
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Daily Puja Reminders</DialogTitle>
                <DialogDescription>
                  Choose categories to receive notifications for
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center gap-2">
                    <input type="checkbox" id={category.id} className="h-4 w-4" />
                    <label htmlFor={category.id} className="text-sm font-medium flex items-center gap-2">
                      {category.icon} {category.label}
                    </label>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSearchAfterNotification}>
                  Save Preferences & Continue
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Priest Connection Dialog */}
          <Dialog open={isPriestDialogOpen} onOpenChange={setIsPriestDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nearby Hindu Priests</DialogTitle>
                <DialogDescription>
                  Connect with qualified priests in your area for personalized guidance
                </DialogDescription>
              </DialogHeader>
              
              {isLoadingPriests ? (
                <div className="py-10 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-hindu-orange mb-4" />
                  <p className="text-sm text-muted-foreground">Searching for priests near you...</p>
                </div>
              ) : nearbyPriests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  {nearbyPriests.map((priest) => (
                    <Card key={priest.id} className="overflow-hidden">
                      <div className="flex p-4">
                        <Avatar className="h-16 w-16 mr-4">
                          <AvatarImage src={priest.photoUrl} alt={priest.name} />
                          <AvatarFallback>{priest.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{priest.name}</CardTitle>
                          <CardDescription className="mb-1">{priest.specialization}</CardDescription>
                          <div className="flex items-center text-xs text-muted-foreground mb-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {priest.address}
                          </div>
                          <div className="flex items-center text-xs">
                            <Badge variant="outline" className="mr-2">{priest.experience}+ Years</Badge>
                            {priest.available && 
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Available</Badge>
                            }
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <CardFooter className="p-3 flex justify-between bg-muted/20">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost" className="text-xs flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="ghost" className="text-xs flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            Email
                          </Button>
                        </div>
                        <Button size="sm" className="text-xs bg-hindu-orange hover:bg-hindu-orange/90 text-white">
                          Book Session
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-muted-foreground mb-4">No priests found in your area</p>
                  <Button 
                    variant="outline" 
                    onClick={() => getUserLocation()}
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Newsletter Subscription Dialog */}
          <Dialog open={isNewsletterDialogOpen} onOpenChange={setIsNewsletterDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Subscribe to Newsletter</DialogTitle>
                <DialogDescription>
                  Stay updated with latest puja schedules, festivals, and spiritual guidance
                </DialogDescription>
              </DialogHeader>
              
              {subscriptionSuccess ? (
                <div className="py-8 text-center">
                  <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                    Subscription successful! Please check your email for confirmation.
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSubscriptionSuccess(false);
                      setIsNewsletterDialogOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    {subscriptionError && (
                      <Alert variant="destructive">
                        <AlertDescription>{subscriptionError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubscribing}>
                      {isSubscribing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Login Dialog */}
          <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Login to Your Account</DialogTitle>
                <DialogDescription>
                  Access your saved rituals, bookings, and personalized recommendations
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-6">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={handleFacebookLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                  Continue with Facebook
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium">Email</label>
                  <Input id="login-email" type="email" placeholder="your@email.com" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium">Password</label>
                  <Input id="login-password" type="password" />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Detail Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              {selectedRitual && (
                <>
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-2xl">{selectedRitual.title}</DialogTitle>
                      <DialogClose className="p-1 rounded-full hover:bg-muted">
                        <X className="h-4 w-4" />
                      </DialogClose>
                    </div>
                    <DialogDescription className="text-base text-foreground/80">
                      {selectedRitual.description}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h3 className="text-lg font-medium border-b pb-2 mb-3">Sacred Mantra</h3>
                      <div className="bg-muted/50 p-4 rounded-lg italic text-foreground/90">
                        "{selectedRitual.mantra}"
                      </div>
                      
                      {(selectedRitual.duration || selectedRitual.season || selectedRitual.remedy || selectedRitual.repetitions) && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium border-b pb-2 mb-3">Details</h3>
                          <div className="space-y-2">
                            {selectedRitual.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Duration: {selectedRitual.duration}</span>
                              </div>
                            )}
                            {selectedRitual.season && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Season: {selectedRitual.season}</span>
                              </div>
                            )}
                            {selectedRitual.remedy && (
                              <div className="flex items-center gap-2">
                                <RotateCw className="h-4 w-4 text-muted-foreground" />
                                <span>Remedy: {selectedRitual.remedy}</span>
                              </div>
                            )}
                            {selectedRitual.repetitions && (
                              <div className="flex items-center justify-center gap-2 mt-3">
                                <Repeat className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Chant {selectedRitual.repetitions} times</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium border-b pb-2 mb-3">Benefits</h3>
                      <p className="text-foreground/80">{selectedRitual.benefits}</p>
                      
                      <h3 className="text-lg font-medium border-b pb-2 mb-3 mt-6">Procedure</h3>
                      <p className="text-foreground/80">{selectedRitual.procedure}</p>
                      
                      {selectedRitual.items && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium border-b pb-2 mb-3">Items Required</h3>
                          <ul className="list-disc list-inside space-y-1 text-foreground/80">
                            {selectedRitual.items.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button className="bg-gradient-to-r from-hindu-orange to-hindu-gold hover:from-hindu-orange/90 hover:to-hindu-gold/90">
                      Book This Ritual
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Google Maps Search Dialog */}
          <Dialog 
            open={isMapDialogOpen} 
            onOpenChange={setIsMapDialogOpen}
          >
            <DialogContent className="max-w-5xl h-[80vh] p-0 gap-0">
              <DialogHeader className="p-4 pb-2">
                <DialogTitle>Hindu Priests Near You</DialogTitle>
                <DialogDescription>
                  Showing results for priests in your area
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 h-full">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyCz9ipWeMCe9vjtJA3k1BxaWrezuR_bWAs&q=${encodeURIComponent(mapSearchQuery)}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <DialogFooter className="p-4 pt-2">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default PujaRituals; 