import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyC0j2DROvG6v0PXZx0F_qiQuxYR6QDNGBU",
  authDomain: "divinity-harmony.firebaseapp.com",
  projectId: "divinity-harmony",
  storageBucket: "divinity-harmony.appspot.com",
  messagingSenderId: "711540812083",
  appId: "1:711540812083:web:aizaSyC0j2DROvG6v0PXZx0F_qiQuxYR6QDNGBU"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection references
const usersRef = collection(db, 'users');
const priestsRef = collection(db, 'priests');
const subscribersRef = collection(db, 'subscribers');
const ritualsRef = collection(db, 'rituals');
const bookingsRef = collection(db, 'bookings');

// User Management
export const createUser = async (user: any) => {
  const userDoc = doc(db, 'users', user.uid);
  
  const userData = {
    uid: user.uid,
    displayName: user.displayName || null,
    email: user.email || null,
    phoneNumber: user.phoneNumber || null,
    photoURL: user.photoURL || null,
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),
    provider: user.providerData[0]?.providerId || 'unknown'
  };
  
  await setDoc(userDoc, userData, { merge: true });
  return userData;
};

export const getUserProfile = async (uid: string) => {
  const userDoc = doc(db, 'users', uid);
  const userSnapshot = await getDoc(userDoc);
  
  if (userSnapshot.exists()) {
    return { id: userSnapshot.id, ...userSnapshot.data() };
  } else {
    return null;
  }
};

export const updateUserProfile = async (uid: string, data: any) => {
  const userDoc = doc(db, 'users', uid);
  await updateDoc(userDoc, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Newsletter Subscription
export const addSubscriber = async (email: string, userData?: any) => {
  // Check if subscriber already exists
  const q = query(subscribersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    // Add new subscriber
    const subscriberData = {
      email,
      userId: userData?.uid || null,
      subscribed: true,
      subscribedAt: Timestamp.now(),
      interests: [],
      ...userData
    };
    
    const docRef = await addDoc(subscribersRef, subscriberData);
    return { id: docRef.id, ...subscriberData };
  } else {
    // Update existing subscriber
    const subscriberDoc = querySnapshot.docs[0];
    await updateDoc(subscriberDoc.ref, {
      subscribed: true,
      resubscribedAt: Timestamp.now(),
      ...userData
    });
    
    return { id: subscriberDoc.id, ...subscriberDoc.data() };
  }
};

export const unsubscribe = async (email: string) => {
  const q = query(subscribersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const subscriberDoc = querySnapshot.docs[0];
    await updateDoc(subscriberDoc.ref, {
      subscribed: false,
      unsubscribedAt: Timestamp.now()
    });
    
    return { success: true };
  }
  
  return { success: false, error: 'Subscriber not found' };
};

// Priest Management
export const addPriest = async (priestData: any) => {
  const docRef = await addDoc(priestsRef, {
    ...priestData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
  
  return { id: docRef.id, ...priestData };
};

export const getPriestsNearby = async (location: { latitude: number, longitude: number }, radius: number = 50) => {
  // This is a simple implementation - for real geospatial queries, consider using Firebase extensions or GeoFirestore
  // In production, you would use GeoPoint and geoQuery
  const querySnapshot = await getDocs(priestsRef);
  
  // Filter and sort priests by distance (simplified)
  const priests = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return priests;
};

// Ritual Bookings
export const createBooking = async (bookingData: any) => {
  const docRef = await addDoc(bookingsRef, {
    ...bookingData,
    status: 'pending',
    createdAt: Timestamp.now()
  });
  
  return { id: docRef.id, ...bookingData };
};

export const getUserBookings = async (userId: string) => {
  const q = query(
    bookingsRef, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export default db;

/*
Recommended Firestore Security Rules for these collections:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Global functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Newsletter subscribers
    match /subscribers/{subscriberId} {
      allow read: if isAdmin();
      allow create: if true; // Anyone can subscribe
      allow update: if isAdmin() || 
        (isAuthenticated() && resource.data.userId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Priests profiles
    match /priests/{priestId} {
      allow read: if true; // Public data
      allow write: if isAdmin();
    }
    
    // Ritual bookings
    match /bookings/{bookingId} {
      allow read: if isAdmin() || 
        (isAuthenticated() && resource.data.userId == request.auth.uid) ||
        (isAuthenticated() && resource.data.priestId == request.auth.uid);
      allow create: if isAuthenticated();
      allow update: if isAdmin() || 
        (isAuthenticated() && resource.data.userId == request.auth.uid) ||
        (isAuthenticated() && resource.data.priestId == request.auth.uid);
      allow delete: if isAdmin();
    }
    
    // Rituals catalog
    match /rituals/{ritualId} {
      allow read: if true; // Public data
      allow write: if isAdmin();
    }
  }
}
*/ 