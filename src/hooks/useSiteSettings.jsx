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

export function useSiteSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'config', 'site_settings');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...defaultSettings, ...docSnap.data() });
      } else {
        // If config doesn't exist yet, we initialize it automatically on first admin fetch
        setSettings(defaultSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error("Config Error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateSettings = async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    await setDoc(doc(db, 'config', 'site_settings'), updated, { merge: true });
    setSettings(updated);
  };

  return { settings, loading, updateSettings };
}
