export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userId: number;
}

export interface State extends User {}

export interface UserStore extends State {
  setUser: (user: User) => void;
}
