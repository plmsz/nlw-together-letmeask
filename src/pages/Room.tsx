import logoImg from '../assets/images/logo.svg';
import { Button } from './../components/Button';
import '../styles/room.scss';
import { RoomCode } from './../components/RoomCode';
import { useParams } from 'react-router-dom';
import { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { child, database, push, ref, set } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();
  const roomId = params.id || '';
  const [newQuestion, setNewQuestion] = useState('');
  const { user } = useAuth();
  const { title, questions } = useRoom(roomId);
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
        <div className='question-list'>
          {questions.map((question) => (
            <Question {...question} key={question.id} />
          ))}
        </div>
      </main>
    </div>
  );
}
