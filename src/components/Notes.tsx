import React, { useState, useEffect, useRef } from 'react';
import { supabase, Note } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, FileText, Save } from 'lucide-react';

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setCategory(selectedNote.category);
    }
  }, [selectedNote]);

  useEffect(() => {
    if (selectedNote && (title !== selectedNote.title || content !== selectedNote.content || category !== selectedNote.category)) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      setIsSaving(true);
      saveTimeoutRef.current = setTimeout(() => {
        autoSave();
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, category]);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user!.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setNotes(data as Note[]);
    }
  };

  const createNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          user_id: user!.id,
          title: 'New Note',
          content: '',
          category: 'General',
        },
      ])
      .select()
      .single();

    if (!error && data) {
      await fetchNotes();
      setSelectedNote(data as Note);
    }
  };

  const autoSave = async () => {
    if (!selectedNote) return;

    const { error } = await supabase
      .from('notes')
      .update({
        title,
        content,
        category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedNote.id);

    if (!error) {
      setIsSaving(false);
      await fetchNotes();
      const updatedNote = notes.find((n) => n.id === selectedNote.id);
      if (updatedNote) {
        setSelectedNote({ ...updatedNote, title, content, category });
      }
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (!error) {
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setTitle('');
        setContent('');
        setCategory('General');
      }
      fetchNotes();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h2>
        <button
          onClick={createNote}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          <Plus className="w-5 h-5" />
          New Note
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
            <h3 className="text-lg font-semibold text-white">All Notes</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
            {notes.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No notes yet</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                    selectedNote?.id === note.id ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {note.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {note.content || 'Empty note'}
                      </p>
                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {note.category}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="flex-shrink-0 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          {selectedNote ? (
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-semibold text-white bg-transparent border-none outline-none placeholder-blue-100 flex-1"
                  placeholder="Note title..."
                />
                <div className="flex items-center gap-2 text-white text-sm">
                  {isSaving ? (
                    <>
                      <Save className="w-4 h-4 animate-pulse" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Saved
                    </>
                  )}
                </div>
              </div>
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Study, Personal, Work"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-96 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Start typing your notes..."
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <FileText className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
