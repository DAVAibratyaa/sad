# Laudos.AI - Radiology Report Generation System

A modern, AI-powered radiology report generation system with voice transcription, text enhancement, and template management capabilities.

## Features

- 🎙️ Voice Recording & Transcription
  - Uses Groq's Whisper Large V3 Turbo for fast, accurate transcription
  - Supports multiple languages
  - Real-time feedback during recording
  - Automatic noise handling

- 🤖 AI-Powered Section Classification
  - Uses Deepseek-chat via OpenRouter
  - Automatically determines appropriate report sections
  - High accuracy for medical terminology
  - Cost-effective processing

- ✨ Text Enhancement
  - Medical terminology verification
  - Formatting standardization
  - Clarity improvements
  - Structure maintenance

- 📝 Rich Interface
  - Three-column layout
  - Section navigation
  - Content editing
  - Study info & templates
  - Rich text editing
  - Template system

## Prerequisites

- Node.js 18+
- npm or yarn
- API keys for:
  - Groq API (for speech-to-text)
  - OpenRouter (for AI processing)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DAVAibratyaa/sad.git
cd sad
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and add your API keys.

## Running the Application

1. Start the development server:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### Creating a New Report

1. Open the application
2. Fill in study information
3. Use voice dictation or templates to add content
4. Edit and enhance text as needed
5. Save or export the report

### Voice Dictation

1. Select target section
2. Click the microphone button
3. Speak clearly
4. Click stop when finished
5. Wait for processing

### Template Usage

1. Access templates from right sidebar
2. Browse available templates
3. Click to insert into current section
4. Modify as needed

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
