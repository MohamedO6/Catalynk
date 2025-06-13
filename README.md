# PodSnap - AI-Powered Podcast Creation Platform

A revolutionary cross-platform application that lets users create professional podcast episodes using AI — with no microphone or camera required.

## 🚀 Features

### Core Functionality
- **AI Script Generation**: Generate engaging podcast scripts using OpenAI GPT-4
- **Voice AI**: Convert scripts to natural-sounding voiceovers with ElevenLabs
- **Video AI**: Create personalized video introductions using Tavus avatars
- **NFT Publishing**: Mint podcasts as NFTs on Algorand blockchain
- **Custom Domains**: Create podcast websites with Entri (username.mypodsnap.tech)

### User Tiers
- **Free**: 5-minute episodes, basic features
- **Pro**: Unlimited length, premium voices, video generation, analytics

### Community Features
- Reddit-style feed with upvoting/downvoting
- Episode sharing and discovery
- "Roast My Podcast" section for feedback
- Community discussions and tips

### Technology Stack
- **Frontend**: React Native with Expo
- **Authentication**: Supabase Auth with OAuth
- **Database**: PostgreSQL via Supabase
- **AI Services**: OpenAI, ElevenLabs, Tavus
- **Blockchain**: Algorand for NFT minting
- **Subscriptions**: RevenueCat (mobile) / Stripe (web)
- **Domains**: Entri + IONOS integration
- **Deployment**: Netlify (web), TestFlight (iOS), APK (Android)

## 🛠️ Setup Instructions

### 1. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update your `.env` file with your API keys:
   ```env
   # Supabase
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # AI Services
   EXPO_PUBLIC_ELEVENLABS_API_KEY=your-elevenlabs-key
   EXPO_PUBLIC_TAVUS_API_KEY=your-tavus-key
   EXPO_PUBLIC_OPENAI_API_KEY=your-openai-key

   # Blockchain
   EXPO_PUBLIC_ALGORAND_NODE_URL=https://testnet-api.algonode.cloud
   EXPO_PUBLIC_ALGORAND_INDEXER_URL=https://testnet-idx.algonode.cloud

   # Domain Services
   EXPO_PUBLIC_ENTRI_API_KEY=your-entri-key

   # RevenueCat
   EXPO_PUBLIC_REVENUECAT_API_KEY=your-revenuecat-key
   ```

### 2. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  script TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  duration INTEGER DEFAULT 0,
  audio_url TEXT,
  video_url TEXT,
  image_url TEXT,
  nft_id TEXT,
  plays INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'discussion' CHECK (type IN ('episode', 'discussion', 'roast')),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view published episodes" ON episodes FOR SELECT USING (status = 'published');
CREATE POLICY "Users can manage own episodes" ON episodes FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Anyone can view posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = author_id);
```

### 3. Install Dependencies & Run

```bash
npm install
npm start
```

## 🎯 Key Features Implementation

### AI Script Generation
- Uses OpenAI GPT-4 to generate engaging podcast scripts
- Customizable duration and topic
- Pro users get longer episodes and better prompts

### Voice AI Integration
- ElevenLabs integration for natural voiceovers
- Multiple voice options for Pro users
- High-quality audio generation

### Video AI Integration
- Tavus integration for AI avatar videos
- Personalized video introductions
- Professional presenter-style videos

### Blockchain NFT Minting
- Algorand blockchain integration
- Mint episodes as unique NFTs
- Ownership verification and trading

### Custom Domain Creation
- Entri API integration
- Automatic subdomain creation (username.mypodsnap.tech)
- Custom podcast website generation

### Community Features
- Reddit-style voting system
- Episode sharing and discovery
- Community discussions and feedback

## 📱 Platform Support

- **Web**: Full-featured web application
- **iOS**: Native iOS app via Expo
- **Android**: Native Android app via Expo

## 🔐 Authentication

- Supabase Auth with email/password
- OAuth support (Google, GitHub, LinkedIn)
- Secure session management

## 💰 Monetization

- **Free Tier**: Basic features, 5-minute episodes
- **Pro Tier**: Advanced AI features, unlimited duration, analytics
- RevenueCat for mobile subscriptions
- Stripe for web payments

## 🚀 Deployment

- **Web**: Netlify automatic deployment
- **iOS**: TestFlight distribution
- **Android**: APK distribution

## 📄 License

MIT License - see LICENSE file for details.