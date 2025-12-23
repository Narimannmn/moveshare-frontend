export interface User {
  id: string;
  name: string;
}

export interface AppContext {
  user: User | null;
  accessToken?: string;
}
