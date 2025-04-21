export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
}

export interface UserStore {
  user: User;
}
