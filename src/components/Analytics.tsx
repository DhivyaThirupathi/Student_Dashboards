import React, { useState, useEffect } from 'react';
import { supabase, Todo } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { TrendingUp, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const Analytics: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user!.id);

    if (!error && data) {
      setTodos(data as Todo[]);
    }
  };

  const completedTasks = todos.filter((t) => t.completed).length;
  const pendingTasks = todos.filter((t) => !t.completed).length;
  const totalTasks = todos.length;

  const highPriority = todos.filter((t) => t.priority === 'High').length;
  const mediumPriority = todos.filter((t) => t.priority === 'Medium').length;
  const lowPriority = todos.filter((t) => t.priority === 'Low').length;

  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

  const completionData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#059669', '#D97706'],
        borderWidth: 2,
      },
    ],
  };

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [highPriority, mediumPriority, lowPriority],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
        borderColor: ['#DC2626', '#D97706', '#059669'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB',
        },
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#D1D5DB' : '#374151',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#E5E7EB',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold mt-2">{totalTasks}</p>
            </div>
            <Circle className="w-12 h-12 text-blue-300" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2">{completedTasks}</p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-300" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2">{pendingTasks}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-yellow-300" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold mt-2">{completionRate}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Task Completion Status</h3>
          {totalTasks > 0 ? (
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut data={completionData} options={chartOptions} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">No tasks to display</p>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Tasks by Priority</h3>
          {totalTasks > 0 ? (
            <div className="h-64">
              <Bar data={priorityData} options={barChartOptions} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 dark:text-gray-400">No tasks to display</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {todos.slice(0, 5).map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {todo.completed ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                  {todo.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Priority: {todo.priority} • {new Date(todo.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
          {todos.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};
