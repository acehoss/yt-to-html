describe('Utility Functions', () => {
  // Helper function to format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  describe('formatTime', () => {
    it('should format seconds to MM:SS for durations under 1 hour', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(59)).toBe('0:59');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(125)).toBe('2:05');
      expect(formatTime(599)).toBe('9:59');
    });

    it('should format seconds to HH:MM:SS for durations over 1 hour', () => {
      expect(formatTime(3600)).toBe('1:00:00');
      expect(formatTime(3661)).toBe('1:01:01');
      expect(formatTime(7199)).toBe('1:59:59');
      expect(formatTime(7200)).toBe('2:00:00');
      expect(formatTime(36000)).toBe('10:00:00');
    });

    it('should handle edge cases', () => {
      expect(formatTime(3599)).toBe('59:59');
      expect(formatTime(3601)).toBe('1:00:01');
    });
  });
});