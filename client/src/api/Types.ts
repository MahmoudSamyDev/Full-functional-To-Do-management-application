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

// types.ts (or extend existing)
export interface Board {
  _id: string;
  title: string;
  description?: string;
  favourite: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBoardPositionParams {
  boards: string[];
}

export interface UpdateBoardParams {
  title?: string;
  description?: string;
  favourite?: boolean;
  position?: number;
}