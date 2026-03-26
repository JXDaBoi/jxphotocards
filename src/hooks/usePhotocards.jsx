import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

export function usePhotocards(ownerUid) {
  const [photocards, setPhotocards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerUid && ownerUid !== undefined) return;

    // Use a basic where query to avoid composite index requirements, we will sort natively
    const q = ownerUid 
      ? query(collection(db, 'photocards'), where('ownerUid', '==', ownerUid))
      : query(collection(db, 'photocards'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let cards = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Native fast-sort to replace the FireStore desc orderBy requirement
      cards.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setPhotocards(cards);
      setLoading(false);
    }, (error) => {
      console.error("Error loading photocards:", error);
      alert("Database Error: " + error.message + " (Make sure Firestore Rules allow reading!)");
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addPhotocard = async (data, explicitUid = null) => {
    return await addDoc(collection(db, 'photocards'), {
      ...data,
      ownerUid: explicitUid || ownerUid,
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
