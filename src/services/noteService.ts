import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: string;
}

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search } = params;
  const query: Record<string, unknown> = { page, perPage };
  if (search) query.search = search;
  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: query,
  });
  return response.data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${id}`);
  return response.data;
}




