import { off, onValue, ref } from 'firebase/database';
import { listeners } from 'process';
import { useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type QuestionsType = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  hasLiked: boolean;
};

type FirebaseQuestions = Record<
  string,
  {
    content: string;
    author: {
      name: string;
      avatar: string;
    };
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, { authorId: string }>;
  }
>;
export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionsType[]>([]);
  const [title, setTitle] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const db = database;
    const reference = ref(db, `rooms/${roomId}`);
    onValue(
      reference,
      (snapshot) => {
        const room = snapshot.val();
        const firebaseQuestions: FirebaseQuestions = room.questions;
        const parsedQuestions = Object.entries(firebaseQuestions).map(
          ([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted,
              isAnswered: value.isAnswered,
              likeCount: Object.values(value.likes ?? {}).length,
              hasLiked: Object.values(value.likes ?? {}).some(
                (like) => like.authorId === user?.id
              ),
            };
          }
        );
        setTitle(room.title);
        setQuestions(parsedQuestions);
      },
      {
        onlyOnce: false,
      }
    );
    return () => {
      off(reference, 'value');
    };
  }, [roomId, user?.id]);

  return { title, questions };
}
