// importing the preconfigured Axios instance.
import axiosClient from "./axiosClient"

// Importing parameter types for the API functions.
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

// Exporting the authApi object for use in other parts of the application.
// This allows other modules to import and use the authentication methods defined in this file.
export default authApi