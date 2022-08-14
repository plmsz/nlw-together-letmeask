# Futuro?

- mensagens de erro com hot toast - alert
- responsividade
- modal - confirm
- nome da sala - fix
- ao criar sala - ir para adminroom
- tema dark/light - preferencia do usuario - stage 4
- logout
- icones de marcar como respondida e destaque - transformar em função
- lista de salas no input
- reabrir uma sala
- apenas admin acessa rota de admin (pessoa que criou a sala poder acessa-lá)
- PWA

# Firebase
yarn add firebase  
https://firebase.google.com/docs/auth/web/google-signin
https://firebase.google.com/docs/database/web/start

yarn add node-sass@6.0.0 (node 16)
yarn add react-router-dom
yarn add @types/react-router-dom


# Sass

No máximo 2 níveis

```scss
#page-auth {
  display: flex;
  align-items: stretch;
  height: 100vh;

  aside {
    flex: 7;
    background-color: #835afd;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 120px 80px;

    img {
      max-width: 320px;
    }
  }

  main {
    flex: 8;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 320px;
    align-items: stretch;
    text-align: center;

    > img { /* imagem filha direto do main-content *//
      align-self: center;
    }
  }
}
```

## Fazer um separador

```scss
.separator {
  font-size: 14px;
  color: #a8a8b3;
  margin: 32px 0;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #a8a8b3;
    margin-right: 16px;
  }
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #a8a8b3;
    margin-left: 16px;
  }
}
```

# Componetizando um botão

spread operator

```tsx
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(props: ButtonProps) {
  return <button className='button' {...props} />;
}
```

## disableButton

```scss
&:not(disabled):hover {
  filter: brightness(0.9);
}

&:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

# useeffect e eventlistener

- Toda vez que vc declara um event.listener vc tem obrigação de descadastrar o eventlistener, no final do useefect

```tsx
useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      const { displayName, photoURL, uid } = user;
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google account');
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  });

  return () => {
    unsubscribe();
  };
}, []);
```
```tsx
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
```
# alterar regras do firebase

{
"rules": {
".read": true,
".write": true
}
}

---

https://firebase.google.com/docs/rules/basics?hl=pt_br&authuser=0#realtime-database
https://firebase.google.com/docs/rules?hl=pt_br&authuser=0

{
"rules": {
"rooms": {
".read": false,
".write": "auth != null",
"$roomId": {
".read": true,
".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.id)",
"questions": {
".read": true,
".write": "auth != null && (!data.exists() || data.parent().child('authorId').val() == auth.id)",
"likes": {
".read": true,
".write": "auth != null && (!data.exists() || data.child('authorId').val() == auth.id)",  
 }
}
}
}
}
}

# Copiar para área de transferência

```tsx
type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }

  return (
    <button className='room-code' onClick={copyRoomCodeToClipboard}>
      <span>Sala #{props.code}</span>
    </button>
  );
}
```

# Record - tipando um objeto

- chave é uma string e valor é um objeto

```tsx
type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    isHighlighted: boolean;
    isAnswered: boolean;
  }
>;
```
-likes é um objeto que a chave é uma string e o valor é um objeto que o valor é uma string
```tsx
type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, { authorId: string }>;
  }
>;

# Objeto em array

```tsx
//objeto
/* {
  -N4TZOJDBaCXwWutHFrt: {content: "o que é useref?", isAnswered: false}, 
  -N4TZcRUe9-wpVBOO_X2: {content: 'como usar o useffect?', isAnswered: false} */
const parsedQuestions = Object.entries(firebaseQuestions).map(
  ([key, value]) => {
    return {
      id: key,
      content: value.content,
    };
  }
);
// retorna
// [
// {id: '-N4TZOJDBaCXwWutHFrt', content: 'o que é useref?'}
// {id: '-N4TZcRUe9-wpVBOO_X2', content: 'como usar o useffect?'}
// ]
```

# Evento de retrieving data

O value fica escutando sempre que qualquer informação mudar. o que torna não muita perfomático
https://firebase.google.com/docs/database/admin/retrieve-data#node.js_1

# scss sibiling
& - o proprio eleemnto + (irmão)
logo aplica a partir da segunda question
````scss
.question {
  background: #fefefe;

  & + .question {
    margin-top: 8px;
  }
  }
    ```
````
# noreferrer
a imagem aparecia intermitente
https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy

<img src={user.avatar} alt={user.name} referrerPolicy='no-referrer'/>

# pacote classnames
<div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}`}>

# hosting
https://firebase.google.com/docs/hosting/quickstart?hl=pt-br

npm install -g firebase-tools
firebase login
firebase init

https://create-react-app.dev/docs/deployment#firebase

* caso faça a github action

yarn build

firebase deploy