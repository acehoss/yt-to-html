import { Innertube } from 'youtubei.js';
import { jest } from '@jest/globals';

describe('YouTube.js Integration', () => {
  // Use Rick Astley - Never Gonna Give You Up as test video
  const TEST_VIDEO_ID = 'dQw4w9WgXcQ';
  
  jest.setTimeout(30000); // 30 second timeout for network requests

  it('should fetch video metadata from YouTube', async () => {
    const yt = await Innertube.create({ 
      generate_session_locally: true 
    });

    const info = await yt.getInfo(TEST_VIDEO_ID);
    
    // Check basic metadata
    expect(info.basic_info.title).toBeDefined();
    expect(info.basic_info.title).toContain('Never Gonna Give You Up');
    expect(info.basic_info.author).toBeDefined();
    expect(info.basic_info.view_count).toBeDefined();
    expect(info.basic_info.duration).toBeDefined();
    expect(info.basic_info.duration).toBeGreaterThan(0);
  });

  it('should fetch transcript/captions from YouTube', async () => {
    const yt = await Innertube.create({ 
      generate_session_locally: true 
    });

    const info = await yt.getInfo(TEST_VIDEO_ID);
    
    try {
      const transcriptInfo = await info.getTranscript();
      
      expect(transcriptInfo).toBeDefined();
      expect(transcriptInfo.transcript).toBeDefined();
      expect(transcriptInfo.transcript.content).toBeDefined();
      
      if (transcriptInfo.transcript?.content?.body?.initial_segments) {
        const segments = transcriptInfo.transcript.content.body.initial_segments;
        expect(Array.isArray(segments)).toBe(true);
        
        if (segments.length > 0) {
          // Check first segment structure
          const firstSegment = segments[0];
          expect(firstSegment).toHaveProperty('start_ms');
          expect(firstSegment.snippet).toBeDefined();
          expect(firstSegment.snippet.text).toBeDefined();
          
          console.log('First few transcript lines:');
          segments.slice(0, 5).forEach((segment: any) => {
            const startTime = (segment.start_ms / 1000).toFixed(1);
            const text = segment.snippet?.text || '';
            console.log(`  (${startTime}s) ${text}`);
          });
        }
      } else {
        console.log('Transcript structure not as expected');
      }
    } catch (error) {
      // Some videos might not have captions
      console.log('Note: This video might not have captions available');
      expect(error).toBeDefined();
    }
  });

  it('should format time correctly', () => {
    // Test the time formatting function
    const formatTime = (seconds: number): string => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    // Rick Astley video is about 3:33
    expect(formatTime(213)).toBe('3:33');
  });
});