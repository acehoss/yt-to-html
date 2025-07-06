describe('YouTube URL Parsing', () => {
  const extractVideoId = (url: string): string | null => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : null;
  };

  it('should extract video ID from standard YouTube URL', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from short YouTube URL', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from YouTube URL with timestamp', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s';
    expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  it('should extract video ID from YouTube URL with playlist', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf';
    expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
  });

  it('should return null for invalid URL', () => {
    const url = 'https://example.com/video';
    expect(extractVideoId(url)).toBeNull();
  });

  it('should return null for URL without video ID', () => {
    const url = 'https://www.youtube.com/';
    expect(extractVideoId(url)).toBeNull();
  });
});