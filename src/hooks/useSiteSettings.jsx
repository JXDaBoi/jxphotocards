import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const defaultSettings = {
  showcaseMode: false,
  dashboardEnabled: true,
  forceTheme: 'user', // "user", "light", "dark", "pastel"
  valueTrackerEnabled: false,
  tradeGeneratorEnabled: true,
};

export function useSiteSettings(userId) {
  const [globalSettings, setGlobalSettings] = useState(defaultSettings);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Re-introducing loading state for consistency

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', userId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGlobalSettings({
          ...defaultSettings,
          ...data.settings
        });
        setProfile({
          displayName: data.displayName || 'Unnamed Collector',
          bio: data.bio || '',
          ...data
        });
      } else {
        setGlobalSettings(defaultSettings);
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("User Config Error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const updateSettings = async (newSettings, currentUserId) => {
    if (!currentUserId) return;
    const docRef = doc(db, 'users', currentUserId);
    await setDoc(docRef, { settings: newSettings }, { merge: true });
  };

  const updateProfile = async (newProfileData, currentUserId) => {
    if (!currentUserId) return;
    const docRef = doc(db, 'users', currentUserId);
    await setDoc(docRef, newProfileData, { merge: true });
  };

  return { globalSettings, profile, loading, updateSettings, updateProfile };
}
