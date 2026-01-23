export interface UserInfo {
  id: string;
  email: string;
  role: string;
  registration_step: string;
  has_uploaded_documents: boolean;
}

export interface AppContext {
  user: UserInfo | null;
  accessToken?: string;
}
