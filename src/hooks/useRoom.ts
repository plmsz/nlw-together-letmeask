import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../services/firebase';

type QuestionsTyoe = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted: boolean;
  isAnswered: boolean;
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
  }
>;
export function useRoom(roomId: string) {
  const [questions, setQuestions] = useState<QuestionsTyoe[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const db = database;

    onValue(
      ref(db, `rooms/${roomId}`),
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
  }, [roomId]);
  return { title, questions };
}
