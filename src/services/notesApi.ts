import axios from 'axios';
import type { Note } from '../types/note';

const notehubApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

notehubApi.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const fetchNotes = async (search?: string): Promise<Note[]> => {
  const response = await notehubApi.get<Note[]>('/notes', {
    params: search ? { search } : {}, 
  });
  return response.data;
};

export const deleteNoteRequest = async (id: string): Promise<void> => {
  await notehubApi.delete(`/notes/${id}`);
};




