import axiosClient from "./axiosClient"
import { SignupParams, LoginParams } from './Types'

interface VerifyTokenResponse {
  user: {
    username: string
    _id: string
  }
}
// Defining the authApi object that contains methods for user authentication.
const authApi = {
  signup: (params: SignupParams) => axiosClient.post('auth/signup', params),
  login: (params: LoginParams) => axiosClient.post('auth/login', params),
  verifyToken: (): Promise<VerifyTokenResponse> => axiosClient.post('auth/verify-token')
}

export default authApi