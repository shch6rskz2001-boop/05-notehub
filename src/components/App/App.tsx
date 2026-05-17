import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import axios from 'axios';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteForm from '../NoteForm/NoteForm';
import Modal from '../Modal/Modal';
import type { Note } from '../../types/note';
import css from './App.module.css';

interface BackendNote {
  id: string;
  title: string;
  body: string;
  tag: string;
}

interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}


const notehubApi = axios.create({
  baseURL: 'https://goit.study',
});

notehubApi.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const queryClient = useQueryClient();
  const [inputValue, setInputValue] = useState('');
  const [searchParam, setSearchParam] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchParam(value);
    setPage(1); 
  }, 500);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };


  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', searchParam, page],
    queryFn: async () => {
      const response = await notehubApi.get('/notes', {
        params: {
          ...(searchParam ? { search: searchParam } : {}),
          page,
          perPage: 12,
        },
      });

      const backendData = Array.isArray(response.data) ? response.data : response.data.data || [];
      const backendPages = response.data.pages || 1;

      
      const transformed: Note[] = backendData.map((note: BackendNote) => ({
        id: note.id,
        title: note.title,
        content: note.body,
        tag: note.tag || 'general',
      }));

      return {
        notesList: transformed,
        totalPagesCount: backendPages,
      };
    },
  });

  
  const notes = data?.notesList || [];
  const totalPages = data?.totalPagesCount || 1;

  
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await notehubApi.delete(`/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  
  const createMutation = useMutation({
    mutationFn: async (noteData: NewNoteData) => {
      await notehubApi.post('/notes', {
        title: noteData.title,
        body: noteData.content,
        tag: noteData.tag,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
    },
  });

  const handleAddNoteSubmit = (values: NewNoteData) => {
    createMutation.mutate(values);
  };

  return (
    <div className={css.app} style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <header 
        className={css.toolbar} 
        style={{ 
          backgroundColor: '#1f1f2e', 
          padding: '20px 40px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <h1 style={{ color: '#ffffff', fontSize: '24px', margin: 0, fontWeight: '600' }}>
          Notehub Application
        </h1> 

        <SearchBox value={inputValue} onChange={handleSearchChange} />

        {totalPages > 1 && (
          <Pagination 
            pageCount={totalPages} 
            forcePage={page} 
            onPageChange={setPage} 
          />
        )}

        <button 
          style={{ padding: '8px 16px', backgroundColor: '#4a90e2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          onClick={() => setIsModalOpen(true)}
        >
          Add Note
        </button>
      </header>

      <main style={{ padding: '20px' }}>
        {(isLoading || createMutation.isPending || deleteMutation.isPending) && (
          <p style={{ textAlign: 'center' }}>Processing...</p>
        )}
        {isError && <p style={{ textAlign: 'center', color: 'red' }}>Error loading data</p>}

        {!isLoading && notes.length > 0 && (
          <NoteList notes={notes} onDelete={handleDeleteNote} />
        )}

        {!isLoading && notes.length === 0 && searchParam !== '' && (
          <p style={{ textAlign: 'center', color: '#666' }}>Нічого не знайдено за вашим запитом.</p>
        )}

        {!isLoading && notes.length === 0 && searchParam === '' && (
          <p style={{ textAlign: 'center', color: '#666' }}>Your note collection is empty.</p>
        )}
      </main>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm 
            onSubmit={handleAddNoteSubmit} 
            onClose={() => setIsModalOpen(false)} 
          />
        </Modal>
      )}
    </div>
  );
}

export default App;








