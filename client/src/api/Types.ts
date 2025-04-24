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
  position: number;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
}

export interface UpdateBoardPositionParams {
  boards: string[];
}

export interface UpdateBoardParams {
  title?: string;
  description?: string;
  position?: number;
}

// Types.ts (extend it with task-related types)

export interface Task {
  _id: string;
  board: string; // board ID
  title: string;
  content?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskParams {
  title: string;
  content?: string;
  sectionId: string;
}

export interface UpdateTaskParams {
  title?: string;
  content?: string;
  columnId?: string;
}

export interface UpdateTaskPositionParams {
  resourceColumnId: string;
  destinationColumnId: string;
  resourceTask: Task[];
  destinationTask: Task[];
}

// types.ts (add this if not already there)

export interface Section {
  _id: string;
  board: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];

}

export interface UpdateSectionParams {
  title?: string;
}
