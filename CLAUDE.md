# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a YouTube Metadata and Captions Extractor service built with TypeScript, Node.js, and Express. It provides a web interface and API for extracting video metadata and transcripts from YouTube videos in multiple formats (HTML, Markdown, JSON).

## Development Commands

### Running the Application
```bash
npm run dev   # Development with hot reload (using tsx)
npm run build # Build TypeScript to JavaScript
npm start     # Run production server from dist/
```

### Dependencies
- Written in TypeScript with strict type checking
- Install dependencies with: `npm install`
- Key dependencies: Express, youtubei.js (YouTube.js), node-fetch
- Development dependencies: TypeScript, tsx, Jest, ts-jest

### Testing
```bash
npm test          # Run all tests
npm run test:watch # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```
- Test framework: Jest with TypeScript support
- Tests located in `src/__tests__/`

## Architecture Overview

### Main Application Structure
The entire application is contained in `src/index.ts` which serves both:
1. **Frontend**: A single-page application with theme switching, URL validation, and clipboard operations
2. **Backend API**: Express server with CORS support providing the `/getMetadataAndCaptions` endpoint

### Key API Endpoint
- `GET /getMetadataAndCaptions?videoId={id}&format={format}`
  - `videoId`: YouTube video ID (extracted from various URL formats)
  - `format`: Output format - `html` (default), `markdown`, or `json`

### Core Functionality Flow
1. Extract video ID from YouTube URL (supports multiple URL formats)
2. Initialize YouTube.js client with `Innertube.create()`
3. Fetch video info using `yt.getInfo(videoId)`
4. Get transcript using `info.getTranscript()`
5. Format output based on requested format

## Important Implementation Details

### YouTube.js Integration
- Uses `youtubei.js` (YouTube.js) instead of deprecated ytdl-core
- Accesses YouTube's private InnerTube API
- Built-in transcript support - no XML parsing needed
- Automatic handling of different caption languages

### Error Handling
- Returns appropriate error messages for:
  - Invalid video IDs
  - Videos without captions
  - Network failures
  - Parsing errors

### Frontend Features
- Real-time YouTube URL validation with visual feedback
- Theme persistence using localStorage
- Modal for displaying fetched content
- Clipboard operations for quick copying

### CORS Configuration
CORS is enabled for all routes to allow cross-origin requests, making the API accessible from other domains.

## Working with this Codebase

When making changes:
- The entire application logic is in `src/index.ts` - no separate route files or controllers
- Frontend code is embedded as a template literal in the root route handler
- Use TypeScript types for better code safety
- Run `npm run typecheck` before committing to catch type errors
- Maintain the existing error handling patterns
- Test with various YouTube URL formats to ensure compatibility
- Run tests with `npm test` to ensure nothing breaks

### Type Safety
- Express request/response types are properly typed
- YouTube.js has built-in TypeScript support
- Use strict TypeScript settings in tsconfig.json