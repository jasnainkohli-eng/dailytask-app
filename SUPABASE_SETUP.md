# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Daily Task App.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Daily Task App (or any name you prefer)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest region to you
5. Click "Create new project"
6. Wait for the project to be set up (takes 1-2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, click on **Settings** (gear icon)
2. Click on **API** in the left sidebar
3. You'll see:
   - **Project URL**: Copy this
   - **anon/public key**: Copy this
4. Add these to your `.env.local` file:
   ```env
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

## Step 3: Create the Database Table

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the following SQL:

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

-- Create policy to allow users to view their own tasks
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

4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

## Step 4: Enable Email Authentication

1. Go to **Authentication** > **Providers** in the left sidebar
2. Under **Email**, make sure it's enabled (it should be by default)
3. You can customize email templates if you want

## Step 5: Set Up Google OAuth (Optional)

### A. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API"
   - Click on it and click **Enable**
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - If prompted, configure the OAuth consent screen first
   - Choose **Web application**
   - Name: Daily Task App
   - **Authorized redirect URIs**: Add this (replace with your project ref):
     ```
     https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     You can find your project ref in your Supabase project URL
   - Click **Create**
   - Copy the **Client ID** and **Client Secret**

### B. Configure Google in Supabase

1. In Supabase dashboard, go to **Authentication** > **Providers**
2. Find **Google** and click to expand
3. Toggle **Enable Google provider**
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

### C. Configure Redirect URLs

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Under **Redirect URLs**, add:
   - `http://localhost:5173` (for development)
   - `http://localhost:5173/` (with trailing slash)
   - Add your production URL when you deploy

## Step 6: Test Your Setup

1. Make sure your `.env.local` file has the correct values
2. Start your development server: `npm run dev`
3. Try signing up with email/password
4. Try signing in with Google (if you set it up)

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` file
- Make sure you're using the **anon/public** key, not the service_role key
- Restart your dev server after changing `.env.local`

### "Row Level Security policy violation"
- Make sure you ran all the SQL policies
- Check that RLS is enabled on the tasks table
- Verify the policies are created correctly

### Google OAuth not working
- Check that your redirect URI matches exactly in both Google Console and Supabase
- Make sure Google+ API is enabled
- Verify Client ID and Secret are correct
- Check browser console for specific error messages

### Can't see tasks after creating them
- Check browser console for errors
- Verify you're logged in (check user object in React DevTools)
- Check Supabase dashboard > Table Editor to see if tasks are being created

## Next Steps

Once everything is set up:
1. Your app should be ready to use!
2. You can view your data in Supabase dashboard > **Table Editor**
3. You can monitor authentication in **Authentication** > **Users**

