// Define request types
export interface SignupParams {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginParams {
  username: string;
  password: string;
}