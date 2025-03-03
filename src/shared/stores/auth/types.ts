export interface State {
  token: string;
}

export interface AuthStore extends State {
  setToken: (token: string) => void;
}
