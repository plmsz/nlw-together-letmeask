import { useContext } from 'react';
import { AuthContext } from './AuthContexts';

export function useAuth() {
  const value = useContext(AuthContext);
  return value;
}
