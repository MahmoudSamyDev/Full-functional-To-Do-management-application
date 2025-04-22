import axiosClient from "./axiosClient";
import { Board, UpdateBoardPositionParams, UpdateBoardParams } from "./Types";

const boardApi = {
    create: (): Promise<Board> => axiosClient.post("boards"),

    getAll: (): Promise<Board[]> => axiosClient.get("boards"),

    updatePosition: (params: UpdateBoardPositionParams): Promise<Board[]> =>
        axiosClient.put("boards", params),

    getOne: (id: string): Promise<Board> => axiosClient.get(`boards/${id}`),

    delete: (id: string): Promise<Board> => axiosClient.delete(`boards/${id}`),

    update: (id: string, params: UpdateBoardParams): Promise<Board> =>
        axiosClient.put(`boards/${id}`, params),

    getFavourites: (): Promise<Board[]> => axiosClient.get("boards/favourites"),
};

export default boardApi;
