# Laudos.AI - Complete Setup and Usage Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [API Configuration](#api-configuration)
4. [Running the Application](#running-the-application)
5. [Features](#features)
6. [Voice Recording](#voice-recording)
7. [Template System](#template-system)
8. [Troubleshooting](#troubleshooting)
9. [Development Guide](#development-guide)
10. [Security Considerations](#security-considerations)

## Prerequisites

### Required Software
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git
- A modern web browser (Chrome, Firefox, Edge)

### Required API Keys
1. Groq API Key (for voice transcription)
   - Sign up at https://console.groq.com
   - Create a new API key
   - Copy the key for later use

2. OpenRouter API Key (for text enhancement)
   - Register at https://openrouter.ai
   - Generate an API key
   - Copy the key for later use

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure environment variables in `.env.local`:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   SITE_URL=http://localhost:3000
   SITE_NAME=Laudos.AI
   ```

## API Configuration

### Groq Whisper API
- Model: whisper-large-v3-turbo
- Language: en (configurable)
- Response format: JSON
- Timeout: 30 seconds
- Rate limits: Check Groq documentation

### OpenRouter/Deepseek
- Model: deepseek/deepseek-chat
- Temperature: 0.3
- Context: Medical transcription enhancement
- Response format: JSON
- Headers required:
  - Authorization
  - HTTP-Referer
  - X-Title
  - Content-Type

## Running the Application

### Development Mode
```bash
npm run dev
```
- Access at http://localhost:3000
- Hot reloading enabled
- Debug logs active

### Production Mode
```bash
npm run build
npm start
```
- Optimized build
- Production-ready
- Error tracking enabled

## Features

### 1. Interface Layout
- Left Sidebar:
  - Section navigation
  - Quick access buttons
  - Status indicators

- Main Content:
  - Rich text editor
  - Voice recording controls
  - Formatting tools
  - Auto-save functionality

- Right Sidebar:
  - Study information
  - Template management
  - Quick actions

### 2. Report Sections
- Procedure
- History
- Technique
- Comparison
- Findings
- Impression

Each section includes:
- Auto-save
- Version history
- Last modified timestamp
- Character count

## Voice Recording

### Recording Process
1. Click microphone icon
2. Speak clearly
3. Click stop when finished
4. Wait for processing

### Processing Pipeline
1. Audio Capture:
   - Format: WebM
   - Sampling: 48kHz
   - Channels: Mono
   - Chunk size: 4096 bytes

2. Transcription:
   - Groq Whisper processing
   - Language detection
   - Noise reduction
   - Text output

3. Enhancement:
   - Medical terminology check
   - Formatting improvement
   - Section classification
   - Error correction

### Best Practices
- Use high-quality microphone
- Speak at normal pace
- Maintain consistent volume
- Use clear medical terminology

## Template System

### Template Categories
1. Normal Studies
2. Common Findings
3. Emergency Cases
4. Follow-up Templates

### Template Management
- Create new templates
- Edit existing ones
- Categorize templates
- Mark favorites
- Search functionality

### Template Variables
- Patient information
- Study details
- Date formatting
- Custom fields

## Troubleshooting

### Common Issues

1. Voice Recording
   ```
   Error: Permission denied
   Solution: Grant microphone access in browser
   ```

2. API Connection
   ```
   Error: API key invalid
   Solution: Check .env.local configuration
   ```

3. Template Loading
   ```
   Error: Templates not found
   Solution: Verify template directory structure
   ```

### Error Recovery
1. Check browser console
2. Verify API status
3. Clear browser cache
4. Restart application

## Development Guide

### Project Structure
```
my-app/
├── app/
│   ├── page.tsx (Main entry)
│   ├── layout.tsx (Root layout)
│   ├── globals.css (Global styles)
│   └── api/
│       └── transcribe/
│           └── route.ts (API endpoint)
├── components/
│   ├── RadiologyReportInterface.tsx
│   ├── QuickTemplateSelection.tsx
│   └── ui/ (Shadcn components)
└── lib/
    ├── utils.ts
    └── defaultTemplates.ts
```

### Component Architecture
1. RadiologyReportInterface
   - Main container
   - State management
   - Event handlers

2. VoiceRecorder
   - Audio capture
   - Processing status
   - Error handling

3. TemplateSystem
   - Template loading
   - Search functionality
   - Category management

### State Management
```typescript
interface AppState {
  activeSection: string;
  isRecording: boolean;
  isProcessing: boolean;
  reportContent: {
    [section: string]: {
      content: string;
      lastModified: Date;
    }
  };
}
```

### API Integration
1. Transcription Endpoint
   ```typescript
   POST /api/transcribe
   Body: FormData (audio blob)
   Response: {
     text: string;
     metadata: {
       confidence: number;
       processing_time: number;
     }
   }
   ```

2. Enhancement Endpoint
   ```typescript
   POST /api/enhance
   Body: { text: string }
   Response: {
     enhanced: string;
     section: string;
   }
   ```

## Security Considerations

### API Key Protection
- Store in environment variables
- Never expose in client
- Rotate regularly
- Monitor usage

### Data Safety
- HTTPS only
- Input sanitization
- XSS prevention
- CORS configuration

### Access Control
- Rate limiting
- Request validation
- Error handling
- Audit logging

### Compliance
- HIPAA guidelines
- Data encryption
- Access logging
- Backup procedures

## Performance Optimization

### Client-side
1. Code splitting
2. Lazy loading
3. Image optimization
4. Cache management

### Server-side
1. Edge functions
2. Response compression
3. Cache headers
4. Error boundaries

## Maintenance

### Regular Tasks
1. Update dependencies
2. Check API versions
3. Monitor error rates
4. Backup templates

### Monitoring
1. API response times
2. Error frequency
3. User feedback
4. System logs

## Support

### Resources
- Groq Documentation: https://console.groq.com/docs
- OpenRouter Docs: https://openrouter.ai/docs
- Next.js Docs: https://nextjs.org/docs

### Contact
- Technical Support: support@laudos.ai
- Bug Reports: github.com/laudos-ai/issues
- Feature Requests: feedback@laudos.ai

## Version History

### v1.0.0 (Current)
- Initial release
- Voice recording
- Template system
- AI enhancement

### Planned Updates
1. Multi-language support
2. Collaboration features
3. Advanced templates
4. Analytics dashboard

