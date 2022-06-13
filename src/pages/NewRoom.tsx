import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { ref, database, set, push, child } from '../services/firebase';
import '../styles/auth.scss';
import { Button } from './../components/Button';
import { useAuth } from './../contexts/useAuth';

export function NewRoom() {
  const { user } = useAuth();
  const [newRoom, setNewRoom] = useState('');
  const navigate = useNavigate()
  async function handleCreateRoom(event: FormEvent) {
    event?.preventDefault();

    if (newRoom.trim() === '') {
      return;
    }
    const db = database;

    const newRoomKey = push(child(ref(db), 'rooms')).key;

    await set(ref(db, `rooms/${newRoomKey}`), {
      title: newRoom,
      authorId: user?.id,
    });

    navigate(`/rooms/${newRoomKey}`)
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
          <h2>Criar nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type='text'
              placeholder='Nome da sala'
              name=''
              id=''
              onChange={(ev) => setNewRoom(ev.target.value)}
              value={newRoom}
            />
            <Button type='submit'>Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to='/'>Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
