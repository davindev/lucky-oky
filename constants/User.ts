interface User {
  id: number;
  nickname: string;
}

interface UserWithUpdater extends User {
  setUser?: React.Dispatch<React.SetStateAction<User>>;
}

export const DEFAULT_USER: UserWithUpdater = { id: 0, nickname: '' };
