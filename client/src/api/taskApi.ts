// taskApi.ts
import axiosClient from './axiosClient'
import {
  Task,
  CreateTaskParams,
  UpdateTaskParams,
  UpdateTaskPositionParams
} from './Types'

const taskApi = {
  create: (boardId: string, params: CreateTaskParams): Promise<Task> =>
    axiosClient.post(`boards/${boardId}/tasks`, params),

  updatePosition: (
    boardId: string,
    params: UpdateTaskPositionParams
  ): Promise<Task[]> =>
    axiosClient.put(`boards/${boardId}/tasks/update-position`, params),

  delete: (boardId: string, taskId: string): Promise<Task> =>
    axiosClient.delete(`boards/${boardId}/tasks/${taskId}`),

  update: (
    boardId: string,
    taskId: string,
    params: UpdateTaskParams
  ): Promise<Task> =>
    axiosClient.put(`boards/${boardId}/tasks/${taskId}`, params)
}

export default taskApi
