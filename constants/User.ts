interface User {
  nickname: string;
}

interface UserWithUpdater extends User {
  setUser?: React.Dispatch<React.SetStateAction<User>>;
}

export const DEFAULT_USER: UserWithUpdater = { nickname: '' };
