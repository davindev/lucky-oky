import { createContext, useState } from 'react';

import { DEFAULT_USER } from '@/constants/User';

interface Props {
  children: React.ReactNode;
}

export const UserContext = createContext(DEFAULT_USER);

export default function Provider({ children }: Props) {
  const [user, setUser] = useState(DEFAULT_USER);

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
