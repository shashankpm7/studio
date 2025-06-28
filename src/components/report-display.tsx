'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Vulnerability } from '@/types';
import { parseVulnerabilityReport } from '@/lib/report-parser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SeverityIcon } from '@/components/icons';
import CodeViewer from './code-viewer';
import { Separator } from './ui/separator';

interface ReportDisplayProps {
  report: string;
  code: string;
}

export default function ReportDisplay({ report, code }: ReportDisplayProps) {
  const [activeVulnerability, setActiveVulnerability] = useState<Vulnerability | null>(null);

  const vulnerabilities = useMemo(() => parseVulnerabilityReport(report), [report]);

  const highlightedLines = useMemo(() => {
    if (activeVulnerability) {
      return activeVulnerability.lines;
    }
    return vulnerabilities.flatMap(v => v.lines);
  }, [vulnerabilities, activeVulnerability]);

  const summary = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0, Unknown: 0 };
    vulnerabilities.forEach(v => counts[v.severity]++);
    return counts;
  }, [vulnerabilities]);

  useEffect(() => {
    // Reset active vulnerability when report changes
    setActiveVulnerability(null);
  }, [report]);

  if (vulnerabilities.length === 0) {
    return (
       <Card className="mt-8 animate-in fade-in-50 duration-500">
         <CardHeader>
           <CardTitle className="font-headline text-2xl">Scan Complete</CardTitle>
         </CardHeader>
         <CardContent>
           <p>Congratulations! The AI scan found no vulnerabilities in your smart contract.</p>
         </CardContent>
       </Card>
    );
  }

  return (
    <Card className="mt-8 animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Vulnerability Report</CardTitle>
        <CardDescription>
          Found {vulnerabilities.length} potential vulnerabilities. Select an issue to see details and highlighted code.
        </CardDescription>
        <div className="flex flex-wrap gap-4 pt-4">
            {summary.High > 0 && <div className="flex items-center gap-2"><SeverityIcon severity="High" /> {summary.High} High Severity</div>}
            {summary.Medium > 0 && <div className="flex items-center gap-2"><SeverityIcon severity="Medium" /> {summary.Medium} Medium Severity</div>}
            {summary.Low > 0 && <div className="flex items-center gap-2"><SeverityIcon severity="Low" /> {summary.Low} Low Severity</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="max-h-[600px] overflow-y-auto pr-2">
            <Accordion type="single" collapsible className="w-full" onValueChange={(id) => setActiveVulnerability(vulnerabilities.find(v => v.id === id) || null)}>
              {vulnerabilities.map(vuln => (
                <AccordionItem value={vuln.id} key={vuln.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 text-left">
                       <SeverityIcon severity={vuln.severity} className="h-5 w-5 flex-shrink-0" />
                       <span>{vuln.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{vuln.description}</p>
                    </div>
                    {vuln.location && (
                      <div>
                        <h4 className="font-semibold mb-1">Location</h4>
                        <p className="text-sm text-muted-foreground font-mono">{vuln.location}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-1">Recommendation</h4>
                      <p className="text-sm text-muted-foreground">{vuln.recommendation}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative">
             <CodeViewer code={code} highlightedLines={highlightedLines} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
