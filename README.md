# Student Productivity Dashboard

A complete, professional student productivity application built with React, TypeScript, and Supabase. Features a modern, responsive design with dark mode support.

## Features

### 1. Task Management (To-Do List)
- Create, edit, and delete tasks
- Three priority levels: Low, Medium, High
- Mark tasks as complete/incomplete
- Add due dates to tasks
- Visual priority indicators with color coding

### 2. Timetable Creator
- Weekly schedule organizer
- Add classes with subject, time, and location
- Color-coded entries for easy identification
- Organized by days of the week
- Quick view of your entire week

### 3. Notes Section
- Create and manage multiple notes
- Auto-save functionality (saves after 1 second of inactivity)
- Categorize notes for better organization
- Rich text editing area
- Real-time save status indicator

### 4. Analytics Dashboard
- Visual task completion statistics
- Doughnut chart for completed vs pending tasks
- Bar chart for tasks by priority
- Key metrics: Total tasks, Completed, Pending, Completion rate
- Recent activity timeline

### 5. Dark Mode
- Toggle between light and dark themes
- Preference saved to local storage
- Smooth transitions between themes
- Optimized for readability in both modes

### 6. Authentication
- Secure user authentication via Supabase
- Email and password sign up/sign in
- Protected routes and data
- User-specific data isolation

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account (credentials already configured)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

The `.env` file is already configured with Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The database tables have been automatically created with the following structure:

- **todos**: Task management with priority levels
- **timetable**: Weekly schedule entries
- **notes**: Note-taking with categories

All tables include Row Level Security (RLS) policies to ensure data privacy.

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Auth.tsx           # Authentication component
│   │   ├── Dashboard.tsx      # Main dashboard layout
│   │   ├── TodoList.tsx       # Task management
│   │   ├── Timetable.tsx      # Schedule creator
│   │   ├── Notes.tsx          # Notes with autosave
│   │   └── Analytics.tsx      # Charts and statistics
│   ├── contexts/
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── ThemeContext.tsx   # Dark mode state
│   ├── lib/
│   │   └── supabase.ts        # Supabase client & types
│   ├── App.tsx                # Main app component
│   ├── main.tsx              # App entry point
│   └── index.css             # Global styles
├── .env                       # Environment variables
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## Usage Guide

### Getting Started

1. **Sign Up**: Create a new account with your email and password
2. **Sign In**: Use your credentials to access the dashboard
3. **Navigate**: Use the sidebar to switch between different sections

### Using Tasks

1. Click "Add Task" button
2. Fill in task details (title, description, priority, due date)
3. Click the circle icon to mark tasks as complete
4. Delete tasks using the trash icon

### Creating a Timetable

1. Click "Add Class" button
2. Select day, subject, start time, and end time
3. Optionally add location and choose a color
4. View your organized weekly schedule

### Taking Notes

1. Click "New Note" to create a note
2. Select a note from the list to edit
3. Add title, category, and content
4. Changes are automatically saved after 1 second

### Viewing Analytics

1. Navigate to the Analytics section
2. View task completion statistics
3. Check priority distribution
4. Review recent activity

### Dark Mode

- Click the Moon/Sun icon in the sidebar
- Theme preference is automatically saved
- Works across all components

## Features Breakdown

### Security
- Row Level Security (RLS) on all database tables
- User authentication required for all operations
- Data isolation per user account

### Responsive Design
- Mobile-friendly interface
- Collapsible sidebar on mobile
- Touch-optimized controls
- Adaptive layouts for all screen sizes

### Performance
- Optimized re-renders with React hooks
- Debounced autosave for notes
- Efficient database queries
- Fast build with Vite

## Troubleshooting

### Common Issues

1. **Build Errors**: Run `npm install` to ensure all dependencies are installed
2. **Authentication Issues**: Check that Supabase credentials are correct in `.env`
3. **Dark Mode Not Working**: Clear browser cache and reload
4. **Charts Not Displaying**: Ensure you have tasks created in the system

## Database Schema

### todos
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- description (text)
- priority (Low | Medium | High)
- completed (boolean)
- due_date (timestamp)
- created_at (timestamp)
- updated_at (timestamp)

### timetable
- id (uuid, primary key)
- user_id (uuid, foreign key)
- day (text)
- subject (text)
- start_time (text)
- end_time (text)
- location (text)
- color (text)
- created_at (timestamp)

### notes
- id (uuid, primary key)
- user_id (uuid, foreign key)
- title (text)
- content (text)
- category (text)
- created_at (timestamp)
- updated_at (timestamp)

## Contributing

This is a student project designed for learning and productivity enhancement. Feel free to fork and customize for your needs.

## License

MIT License - Feel free to use this project for learning and personal use.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the usage guide
3. Ensure all dependencies are installed correctly

---

Built by dhivya.
