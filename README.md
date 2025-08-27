# EchoPilot - AI-powered Meeting Intelligence

EchoPilot is a production-ready SaaS web application that automatically joins, listens, summarizes, and tracks action items from browser-based or desktop meetings. Built with modern technologies and a premium design system.

## 🚀 Features

### **Core Features**
- **AI-Powered Meeting Assistant**: Automatically transcribe and summarize meetings
- **Smart Action Item Tracking**: Extract and manage tasks from conversations
- **Multi-Platform Support**: Works with Zoom, Teams, Meet, Webex, and more
- **Real-time Dashboard**: Comprehensive overview of meetings and productivity metrics
- **Advanced Search & Filters**: Find meetings, summaries, and action items quickly
- **Responsive Design**: Optimized for desktop and mobile devices
- **Glassmorphism UI**: Modern, premium design with smooth animations

### **Advanced AI Features (Phase 2)**
- **Smart Task Allocation**: AI-powered task assignment based on meeting context, participant roles, and organizational structure
- **Cross-Meeting Intelligence**: Connects insights across multiple meetings and builds institutional memory
- **Predictive Analytics**: Anticipates needs and optimizes team workflows proactively
- **Team Intelligence Dashboard**: Comprehensive view of team performance, insights, and predictions
- **Meeting Pattern Recognition**: Learns team meeting habits and suggests optimizations
- **Resource Forecasting**: Predicts future resource needs based on meeting data
- **Workload Prediction**: Analyzes individual and team workload patterns
- **Risk Detection**: Identifies potential issues and provides mitigation strategies

### **Open Source AI Services**
- **Transcription**: Web Speech API for real-time transcription + Audio file processing
- **Summary Generation**: Local text analysis and extractive summarization
- **Sentiment Analysis**: Rule-based sentiment detection
- **Topic Extraction**: Frequency-based topic identification
- **Action Item Detection**: Keyword-based action item extraction

## 🛠️ Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Services**: 
  - Web Speech API (Real-time Transcription)
  - Local Text Analysis (Summaries & Sentiment)
  - Open-source AI Engines (Task Allocation, Intelligence)
- **Calendar Integration**: Google Calendar API
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
echopilot/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard page
│   ├── team-intelligence/ # Team Intelligence dashboard
│   ├── demo/              # Advanced features demo
│   ├── meetings/          # Meetings page
│   ├── summaries/         # Summaries page
│   ├── action-items/      # Action items page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── Layout.tsx         # Main layout with sidebar
│   ├── Dashboard.tsx      # Dashboard component
│   ├── TeamIntelligenceDashboard.tsx # Advanced AI dashboard
│   ├── AdvancedFeaturesDemo.tsx # Interactive demo component
│   ├── Meetings.tsx       # Meetings list component
│   ├── Summaries.tsx      # Summaries component
│   ├── ActionItems.tsx    # Action items component
│   └── Settings.tsx       # Settings component
├── lib/                   # Utility functions and services
│   ├── api.ts            # API service layer
│   ├── supabase.ts       # Supabase client
│   ├── utils.ts          # Utility functions
│   ├── ai-task-allocation.ts # AI task allocation engine
│   ├── cross-meeting-intelligence.ts # Cross-meeting insights
│   ├── predictive-analytics.ts # Predictive analytics engine
│   ├── open-source-transcription.ts # Open-source transcription
│   └── open-source-summary.ts # Open-source summary generation
├── types/                 # TypeScript type definitions
│   └── index.ts          # Main types file
├── constants/             # Application constants
│   └── design-system.json # Design system configuration
├── styles/                # Global styles
│   └── globals.css       # Tailwind CSS and custom styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- AssemblyAI API key (optional)
- OpenAI API key (optional)
- Google Calendar API credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/echopilot.git
   cd echopilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI Services
   NEXT_PUBLIC_ASSEMBLY_AI_KEY=your_assemblyai_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
   
   # Calendar Integration
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your_calendar_id
   
   # API
   NEXT_PUBLIC_API_URL=https://api.echopilot.com
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Set up authentication
   - Create necessary database tables (see Database Schema below)

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🗄️ Database Schema

### Tables

```sql
-- Users table (handled by Supabase Auth)
-- profiles table for additional user data

-- Meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER NOT NULL,
  participants TEXT[] NOT NULL,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  recording_url TEXT,
  transcript_url TEXT,
  summary TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Action Items table
CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  assignee TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcripts table
CREATE TABLE transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  segments JSONB NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Summaries table
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  key_points TEXT[],
  sentiment TEXT NOT NULL DEFAULT 'neutral',
  topics TEXT[],
  ai_generated BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications JSONB NOT NULL DEFAULT '{}',
  calendar JSONB NOT NULL DEFAULT '{}',
  transcription JSONB NOT NULL DEFAULT '{}',
  summary JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Configuration

### Design System

The application uses a comprehensive design system defined in `constants/design-system.json`:

- **Colors**: Primary, secondary, accent, and semantic color palettes
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation and depth system
- **Transitions**: Animation timing and easing functions
- **Glassmorphism**: Backdrop blur and transparency effects

### Tailwind CSS

Custom Tailwind configuration with:
- Extended color palette
- Custom animations and keyframes
- Responsive utilities
- Component classes for common patterns

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Set environment variables**
   - Add all environment variables in Vercel dashboard

3. **Deploy**
   - Vercel will automatically deploy on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔌 API Integration

### AssemblyAI (Transcription)

```typescript
import { api } from '@/lib/api';

// Transcribe audio
const result = await api.transcription.transcribeAudio(audioUrl);
```

### OpenAI (Summaries)

```typescript
import { api } from '@/lib/api';

// Generate summary
const summary = await api.summary.generateSummary(transcript, {
  includeKeyPoints: true,
  includeActionItems: true,
  maxLength: 500
});
```

### Google Calendar

```typescript
import { api } from '@/lib/api';

// Sync meetings
const events = await api.calendar.syncMeetings();
```

## 🎨 Customization

### Themes

The application supports custom theming through CSS variables and Tailwind configuration:

```css
:root {
  --primary-50: #f0f9ff;
  --primary-500: #0ea5e9;
  --primary-900: #0c4a6e;
}
```

### Components

All components are built with customization in mind:
- Props for different variants
- CSS classes for styling overrides
- Consistent design tokens

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions
- Optimized navigation for small screens

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control
- **Data Validation**: TypeScript and runtime validation
- **API Security**: CORS and rate limiting
- **Environment Variables**: Secure configuration management

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.echopilot.com](https://docs.echopilot.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/echopilot/issues)
- **Discord**: [Join our community](https://discord.gg/echopilot)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Supabase](https://supabase.com/) for the backend infrastructure
- [AssemblyAI](https://www.assemblyai.com/) for transcription services
- [OpenAI](https://openai.com/) for AI summarization

---

Built with ❤️ by the EchoPilot Team
