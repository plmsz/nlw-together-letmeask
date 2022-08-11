import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from './../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { child, database, ref } from '../services/firebase';
import { get } from 'firebase/database';
import { on } from 'stream';
import { once } from 'events';

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }
    navigate('rooms/new');
  }
  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = ref(database);

    get(child(roomRef, `rooms/${roomCode}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          navigate(`rooms/${roomCode}`);
        } else {
          alert('Room does not exist');
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }

  return (
    <div id='page-auth'>
      <aside>
        <img src={illustrationImg} alt='' />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={logoImg} alt='Letmeask' />
          <button onClick={handleCreateRoom} className='create-room'>
            <img src={googleIconImg} alt='' />
            Crie sua sala com o Google
          </button>
          <div className='separator'>ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type='text'
              placeholder='Digite o código da sala'
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type='submit'>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
