export const parseLines = (locationString: string): number[] => {
  if (!locationString) return [];
  const lines: number[] = [];
  const cleanedString = locationString.replace(/[^0-9,-]/g, '');
  const parts = cleanedString.split(',');

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          lines.push(i);
        }
      }
    } else {
      const line = Number(part);
      if(!isNaN(line)) {
        lines.push(line);
      }
    }
  }
  return [...new Set(lines)].sort((a, b) => a - b);
};
