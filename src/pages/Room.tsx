import logoImg from '../assets/images/logo.svg';
import { Button } from './../components/Button';
import '../styles/room.scss';
import { RoomCode } from './../components/RoomCode';
import { useParams } from 'react-router-dom';
import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { child, database, push, ref, set, onValue } from '../services/firebase';

type RoomParams = {
  id: string;
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
type Questions = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted: boolean;
  isAnswered: boolean;
};

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const [newQuestion, setNewQuestion] = useState('');
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Questions[]>([]);
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

  async function hanldeSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }
    if (!user) {
      throw new Error('Você deve estar logado.');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const newQuestionKey = push(
      child(ref(database), `rooms/${roomId}/questions`)
    ).key;
    await set(
      ref(database, `rooms/${roomId}/questions/${newQuestionKey}`),
      question
    );

    setNewQuestion('');
  }

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <RoomCode code={roomId || ''} />
        </div>
      </header>
      <main className='content'>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          <span>
            {questions.length > 0 && questions.length > 1
              ? `${questions.length} perguntas`
              : `${questions.length} pergunta`}
          </span>
        </div>
        <form onSubmit={hanldeSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className='form-footer'>
            {user ? (
              <div className='user-info'>
                <img src={user?.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button> faça seu login.</button>
              </span>
            )}
            <Button type='submit' disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
