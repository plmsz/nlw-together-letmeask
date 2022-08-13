import logoImg from '../assets/images/logo.svg';
import { Button } from './../components/Button';
import '../styles/room.scss';
import { RoomCode } from './../components/RoomCode';
import { useNavigate, useParams } from 'react-router-dom';
import { database, ref } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import { remove, update } from 'firebase/database';
import deleteImg from '../assets/images/delete.svg';

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id || '';
  const { title, questions } = useRoom(roomId);
  const navigate = useNavigate();

  async function handleEndRoom() {
    const dbRef = ref(database, `rooms/${roomId}`);
    await update(dbRef, {
      endedAt: new Date(),
    });
    navigate('/');
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      const dbRef = ref(database, `rooms/${roomId}/questions/${questionId}`);
      await remove(dbRef);
    }
  }
  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <div>
            <RoomCode code={roomId || ''} />
            <Button isOutlined onClick={handleEndRoom}>Encerrar a sala</Button>
          </div>
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
        <div className='question-list'>
          {questions.map((question) => (
            <Question {...question} key={question.id}>
              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt='Remover pergunta' />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  );
}
