// sectionApi.ts
import axiosClient from './axiosClient'
import { Section, UpdateSectionParams } from './Types'

const sectionApi = {
  create: (boardId: string): Promise<Section> =>
    axiosClient.post(`boards/${boardId}/sections`),

  update: (
    boardId: string,
    sectionId: string,
    params: UpdateSectionParams
  ): Promise<Section> =>
    axiosClient.put(`boards/${boardId}/sections/${sectionId}`, params),

  delete: (boardId: string, sectionId: string): Promise<Section> =>
    axiosClient.delete(`boards/${boardId}/sections/${sectionId}`)
}

export default sectionApi
