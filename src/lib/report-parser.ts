import type { Vulnerability } from '@/types';

const SEVERITY_MAP: { [key: string]: Vulnerability['severity'] } = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const parseLines = (locationString: string): number[] => {
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

export const parseVulnerabilityReport = (report: string): Vulnerability[] => {
  if (!report || typeof report !== 'string') return [];

  const vulnerabilities: Vulnerability[] = [];
  const sections = report.split('###').filter(s => s.trim() !== '');

  for (const section of sections) {
    const content = section.trim();
    const lines = content.split('\n');
    const titleLine = lines.shift() || '';

    const severityMatch = titleLine.match(/(High|Medium|Low)/i);
    const severity: Vulnerability['severity'] = severityMatch ? SEVERITY_MAP[severityMatch[0].toLowerCase()] : 'Unknown';
    const title = titleLine.replace(/(High|Medium|Low)\sSeverity:?/i, '').trim();

    const body = lines.join('\n');
    
    let description = "No description provided.";
    let location = "";
    let recommendation = "No recommendation provided.";

    const descMatch = body.match(/(?:\*\*Description:\*\*|Description:)([\s\S]*?)(?=\n\*\*|$)/i);
    if(descMatch) description = descMatch[1].trim();

    const locMatch = body.match(/(?:\*\*Location:\*\*|Location:)([\s\S]*?)(?=\n\*\*|$)/i);
    if(locMatch) location = locMatch[1].trim();

    const recMatch = body.match(/(?:\*\*Recommendation:\*\*|Recommendation:)([\s\S]*?)(?=\n\*\*|$)/i);
    if(recMatch) recommendation = recMatch[1].trim();


    if (title) {
      vulnerabilities.push({
        id: title.replace(/\s+/g, '-') + Math.random(),
        severity,
        title,
        description,
        location,
        recommendation,
        lines: parseLines(location),
      });
    }
  }
  return vulnerabilities;
};
