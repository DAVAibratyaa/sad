# Laudos.AI - Radiology Report Generation System

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- API keys for:
  - Groq API (for speech-to-text)
  - OpenRouter (for AI processing)

### 2. Initial Setup

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd my-app

# Install dependencies
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory with the following content:
```env
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
SITE_URL=https://your-site-url.com
SITE_NAME=Your Site Name
```

### 4. Running the Application

```bash
# Start the development server
npm run dev
# or
yarn dev
```

Access the application at `http://localhost:3000`

## Features Overview

### 1. Voice Recording & Transcription
- Uses Groq's Whisper Large V3 Turbo for fast, accurate transcription
- Supports multiple languages
- Real-time feedback during recording
- Automatic noise handling

### 2. AI-Powered Section Classification
- Uses Deepseek-chat via OpenRouter
- Automatically determines appropriate report sections
- High accuracy for medical terminology
- Cost-effective processing

### 3. Text Enhancement
- Medical terminology verification
- Formatting standardization
- Clarity improvements
- Structure maintenance

### 4. Interface Components
- Three-column layout:
  - Left: Section navigation
  - Center: Content editing
  - Right: Study info & templates
- Rich text editing capabilities
- Template system integration

## Usage Guide

### 1. Creating a New Report

1. Open the application
2. Fill in study information:
   - Patient details
   - Study type
   - Date and ID

### 2. Voice Dictation

1. Select target section (or let AI classify)
2. Click the microphone button
3. Speak clearly
4. Click stop when finished
5. Wait for processing:
   - Transcription
   - Section classification
   - Text enhancement

### 3. Template Usage

1. Access templates from right sidebar
2. Browse available templates
3. Click to insert into current section
4. Modify as needed

### 4. Editing Tools

- Rich text formatting
- Section organization
- Template management
- Real-time saving

## Technical Details

### API Integration

1. Groq Whisper API
```typescript
// Speech to text configuration
model: "whisper-large-v3-turbo"
language: "en"
response_format: "json"
```

2. OpenRouter/Deepseek Integration
```typescript
// AI processing configuration
model: "deepseek/deepseek-chat"
temperature: 0.3 // for classification
temperature: 0.7 // for enhancement
```

### Performance Considerations

- Audio preprocessing for optimal results
- Chunking for long recordings
- Error handling and recovery
- Real-time feedback

## Troubleshooting

### Common Issues

1. Microphone Access
   - Ensure browser permissions are granted
   - Check microphone hardware

2. API Connection
   - Verify API keys
   - Check network connectivity
   - Validate request format

3. Text Processing
   - Check section classification
   - Verify enhancement quality
   - Monitor response times

### Error Messages

- `Failed to access microphone`: Check browser permissions
- `Transcription error`: Verify audio quality and API key
- `Processing error`: Check network and API status

## Support and Resources

- Groq API Documentation: [https://console.groq.com/docs](https://console.groq.com/docs)
- OpenRouter Documentation: [https://openrouter.ai/docs](https://openrouter.ai/docs)
- Project Repository: [Repository URL]

## Updates and Maintenance

### Version Control
- Keep dependencies updated
- Monitor API version changes
- Check for security updates

### Performance Monitoring
- Track API response times
- Monitor error rates
- Assess transcription quality

## Security Considerations

1. API Key Protection
   - Store keys in environment variables
   - Never expose in client-side code
   - Rotate keys periodically

2. Data Handling
   - Implement proper sanitization
   - Handle PHI according to regulations
   - Maintain audit trails

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request
4. Follow coding standards
5. Include tests

## License

[Your License Information]

