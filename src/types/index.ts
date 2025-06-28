export interface Vulnerability {
  id: string;
  severity: 'High' | 'Medium' | 'Low' | 'Unknown';
  title: string;
  description: string;
  location: string;
  recommendation: string;
  lines: number[];
}
