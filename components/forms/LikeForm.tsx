"use client"

import React, { useEffect, useState } from 'react';
import { updateDoc } from "@/lib/actions/thread.actions";
// Assurez-vous d'importer fetchlike depuis son fichier
import { fetchlike } from '@/lib/actions/thread.actions';

interface Props {
  user: string;
  id: string;
};

const Like = ({ user, id }: Props) => {
  const [likeCount, setLikeCount] = useState(0);
    const [userLiked, setUserLiked] = useState(false);

useEffect(() => {
    const fetchLikes = async () => {
        try {
        const { totalLikeCount, userLiked } = await fetchlike(id, user);
        setLikeCount(totalLikeCount);
        setUserLiked(userLiked);
        } catch (error) {
        console.error('Erreur lors de la récupération du nombre de likes:', error);
        }
    };

    fetchLikes();
    }, [id, user]);

  const handleLikeClick = async () => {
    try { 
      await updateDoc(id, user);
      // Mettre à jour le nombre de likes après le clic
      const { totalLikeCount, userLiked } = await fetchlike(id, user);
        setLikeCount(totalLikeCount);
        setUserLiked(userLiked);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du document:', error);
    }
  };

  return (
    <div className="flex items-center">
        <button
          onClick={handleLikeClick} 
          className={`flex items-center justify-center h-8 w-8 rounded-full bg-slate-800 ${userLiked ? '' : 'hover:animate-bounce hover:scale-125'}`}>
            {userLiked ? '❤️' : '🖤'}
        </button>
        <span className="ml-2 text-white">{likeCount}</span>
    </div>
  );
};


export default Like;
