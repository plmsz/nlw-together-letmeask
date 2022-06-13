yarn add firebase  
https://firebase.google.com/docs/auth/web/google-signin
https://firebase.google.com/docs/database/web/start

yarn add node-sass@6.0.0 (node 16)
yarn add react-router-dom
yarn add @types/react-router-dom
 
 # Futuro?
 - logout
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
~~~tsx
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
  return <button className='button'{...props} />;
}
~~~

## disableButton

~~~scss
&:not(disabled):hover {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
~~~

# useeffect e eventlistener
 - Toda vez que vc declara um event.listener vc tem obrigação de desacadstrar o eventlistener, no final do useefect
~~~tsx
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
  ~~~

  # alterar regras do firebase
  {
  "rules": {
    ".read": true,
    ".write": true
  }
}