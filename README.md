# Daily Task App

A modern web application for managing daily tasks with motivational quotes, built with React and Supabase.

## Features

- ✅ User authentication (Email/Password and Google OAuth)
- ✅ Daily task management (Create, Update, Delete, Mark Complete)
- ✅ Daily motivational quotes
- ✅ Task history view
- ✅ Responsive design
- ✅ Real-time data sync with Supabase

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier works)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Settings** > **API**
3. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

1. Create a `.env.local` file in the root directory
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL to create the tasks table:

```sql
-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tasks
CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. Configure Google OAuth (Optional but Recommended)

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Enable **Google** provider
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase
4. Add your app's redirect URL in Supabase:
   - Go to **Authentication** > **URL Configuration**
   - Add your site URL (e.g., `http://localhost:5173` for development)

### 6. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Auth/          # Authentication components
│   ├── Task/          # Task management components
│   ├── Quote/         # Daily quote component
│   └── Layout/        # Header and layout components
├── hooks/             # Custom React hooks
│   ├── useAuth.js     # Authentication hook
│   ├── useTasks.js    # Task management hook
│   └── useQuote.js    # Quote hook
├── lib/
│   └── supabase.js    # Supabase client configuration
├── pages/             # Page components
│   ├── Home.jsx       # Main dashboard
│   └── History.jsx    # Task history page
├── App.jsx            # Main app component with routing
└── main.jsx           # Entry point
```

## Usage

1. **Sign Up/Login**: Create an account or sign in with email/password or Google
2. **Add Tasks**: Enter tasks you want to accomplish today
3. **Complete Tasks**: Check off tasks as you complete them
4. **View History**: Navigate to History page to see past tasks
5. **Get Motivated**: Read the daily motivational quote on the home page

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Supabase** - Backend (Auth + Database)
- **CSS** - Styling

## License

MIT

