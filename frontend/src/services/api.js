
import axios from 'axios';

const API_URL = 'http://localhost:5002/api/items';

export const getMediaItems = () => axios.get(API_URL);
export const getMediaItem = (id) => axios.get(`${API_URL}/${id}`);
export const createMediaItem = (data) => axios.post(API_URL, data);
export const updateMediaItem = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteMediaItem = (id) => axios.delete(`${API_URL}/${id}`);
