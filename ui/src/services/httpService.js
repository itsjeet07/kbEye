import axios from 'axios';

axios.interceptors.response.use(null, (error) => {
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
