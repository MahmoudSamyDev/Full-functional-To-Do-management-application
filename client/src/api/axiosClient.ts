import axios from 'axios';

// query-string: Used to serialize query parameters in a cleaner way than the default axios serializer.
import queryString from 'query-string';


const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/v1/`;

// getToken: Gets the stored token from localStorage (usually set during login) to be attached to all future requests for authorization.
const getToken = () => localStorage.getItem('token');

// axiosClient: A customized axios instance with a base URL and request/response interceptors.
const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: params => queryString.stringify({ params })
});

// This interceptor runs before every request:
// request interceptor: Adds the 'Content-Type' and 'Authorization' headers to all requests.
// It uses the getToken function to retrieve the token from localStorage and attaches it to the Beare request headers.
axiosClient.interceptors.request.use(async config => {
  config.headers.set('Content-Type', 'application/json');
  config.headers.set('authorization', `Bearer ${getToken()}`);
  return config;
});

// This runs after a response is received
// response interceptor: If the response has data, it returns that data. Otherwise, it just returns the response.
// If there's an error, it checks if the error has a response. If not, it alerts the user.
// If there is a response, it throws the error response to be handled by the UI.
axiosClient.interceptors.response.use(response => {
  if (response && response.data) return response.data
  return response
}, err => {
  if (!err.response) {
    return alert(err)
  }
  throw err.response
});

// Exporting the Client
export default axiosClient;