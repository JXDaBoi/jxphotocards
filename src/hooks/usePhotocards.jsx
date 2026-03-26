import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export function usePhotocards() {
  const [photocards, setPhotocards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'photocards'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotocards(cards);
      setLoading(false);
    }, (error) => {
      console.error("Error loading photocards:", error);
      alert("Database Error: " + error.message + " (Make sure Firestore Rules allow reading!)");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addPhotocard = async (data) => {
    return await addDoc(collection(db, 'photocards'), {
      ...data,
      createdAt: serverTimestamp()
    });
  };

  const deletePhotocard = async (id) => {
    return await deleteDoc(doc(db, 'photocards', id));
  };

  const updatePhotocard = async (id, data) => {
    return await updateDoc(doc(db, 'photocards', id), data);
  };

  return { photocards, loading, addPhotocard, deletePhotocard, updatePhotocard };
}
