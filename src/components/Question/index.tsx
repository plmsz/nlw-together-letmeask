import './styles.scss';
import { ReactNode } from 'react';

type QuestionProps = {
  children?: ReactNode;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted: boolean;
  isAnswered: boolean;
};

export function Question({ content, author, children }: QuestionProps) {
  return (
    <div className='question'>
      <p>{content}</p>
      <footer>
        <div className='user-info'>
          <img
            src={author.avatar}
            alt={author.name}
            referrerPolicy='no-referrer'
          />
          <span>{author.name}</span>
        </div>
        <div>{children}</div>
      </footer>
    </div>
  );
}
