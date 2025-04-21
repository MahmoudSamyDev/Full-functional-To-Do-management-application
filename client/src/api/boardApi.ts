import axiosClient from './axiosClient'

const boardApi = {
  create: () => axiosClient.post('boards'),
  getAll: () => axiosClient.get('boards'),
  updatePosition: (params) => axiosClient.put('boards', params),
  getOne: (id: number) => axiosClient.get(`boards/${id}`),
  delete: (id: number) => axiosClient.delete(`boards/${id}`),
  update: (id: number, params) => axiosClient.put(`boards/${id}`, params),
  getFavourites: () => axiosClient.get('boards/favourites'),
}

export default boardApi