import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export const listTransactions = (): Promise<AxiosResponse> => {
  return api.get('/transactions');
};

export default api;
