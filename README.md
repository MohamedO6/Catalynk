# Catalynk Platform

A comprehensive startup ecosystem platform built with Expo and React Native.

## 🚀 Quick Setup

### 1. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file with your actual Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to **Settings > API**
4. Copy your:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### 3. Configure OAuth Providers

#### Google OAuth Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **APIs & Services > Credentials**
5. Create **OAuth 2.0 Client ID**
6. Set **Authorized redirect URIs**:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
7. Copy your **Client ID** and **Client Secret**

#### GitHub OAuth Setup:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name**: Catalynk
   - **Homepage URL**: `http://localhost:8081` (for development)
   - **Authorization callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy your **Client ID** and **Client Secret**

#### Configure in Supabase:
1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Providers**
3. Enable **Google**:
   - Add your Google Client ID
   - Add your Google Client Secret
4. Enable **GitHub**:
   - Add your GitHub Client ID
   - Add your GitHub Client Secret

### 4. Database Setup

The app requires a `profiles` table in your Supabase database. Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('founder', 'freelancer', 'investor')),
  bio TEXT,
  skills TEXT[],
  location TEXT,
  website TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'founder')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5. Install Dependencies & Run

```bash
npm install
npm run dev
```

## 🔧 Troubleshooting

### OAuth Issues

**"Server IP address could not be found"**
- Make sure you're using your actual Supabase project URL, not the placeholder
- Check that your `.env` file has the correct `EXPO_PUBLIC_SUPABASE_URL`

**"Invalid redirect URI"**
- Ensure your OAuth redirect URIs exactly match: `https://your-project-ref.supabase.co/auth/v1/callback`
- No trailing slashes or extra characters

**"OAuth provider not configured"**
- Verify you've enabled the provider in Supabase Dashboard
- Check that Client ID and Client Secret are correctly entered

### Network Errors

- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure you have internet connectivity

## 📱 Features

- **Multi-role Authentication**: Founder, Freelancer, Investor roles
- **Social Login**: Google and GitHub OAuth
- **Project Management**: Create and browse startup projects
- **Community Features**: Discussion forums and networking
- **Investment Portal**: For investors to discover opportunities
- **Responsive Design**: Works on web, iOS, and Android

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth)
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native

## 📄 License

MIT License - see LICENSE file for details.