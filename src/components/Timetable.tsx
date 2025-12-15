import React, { useState, useEffect } from 'react';
import { supabase, TimetableEntry } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Clock, MapPin } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export const Timetable: React.FC = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [day, setDay] = useState('Monday');
  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('timetable')
      .select('*')
      .eq('user_id', user!.id)
      .order('start_time', { ascending: true });

    if (!error && data) {
      setEntries(data as TimetableEntry[]);
    }
  };

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('timetable').insert([
      {
        user_id: user!.id,
        day,
        subject,
        start_time: startTime,
        end_time: endTime,
        location,
        color,
      },
    ]);

    if (!error) {
      setSubject('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      setShowForm(false);
      fetchEntries();
    }
  };

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from('timetable').delete().eq('id', id);

    if (!error) {
      fetchEntries();
    }
  };

  const getEntriesForDay = (dayName: string) => {
    return entries.filter((entry) => entry.day === dayName);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      {showForm && (
        <form onSubmit={addEntry} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Room 201"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg transition ${
                    color === c ? 'ring-4 ring-offset-2 dark:ring-offset-gray-800' : ''
                  }`}
                  style={{ backgroundColor: c, ringColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            >
              Add Class
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DAYS.map((dayName) => {
          const dayEntries = getEntriesForDay(dayName);
          return (
            <div
              key={dayName}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
                <h3 className="text-lg font-semibold text-white">{dayName}</h3>
              </div>
              <div className="p-4 space-y-3">
                {dayEntries.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                    No classes
                  </p>
                ) : (
                  dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-lg p-3 border-l-4 hover:shadow-md transition"
                      style={{ borderColor: entry.color, backgroundColor: `${entry.color}15` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {entry.subject}
                        </h4>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {entry.start_time} - {entry.end_time}
                        </div>
                        {entry.location && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {entry.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
