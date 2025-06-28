'use client';

import { useState, useEffect, useMemo, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Vulnerability } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { SeverityIcon } from '@/components/icons';
import CodeViewer from './code-viewer';
import { Button } from './ui/button';
import { generateDetailedReportAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

interface ReportDisplayProps {
  vulnerabilities: Vulnerability[];
  code: string;
  blockchainType: 'ETH' | 'SOL' | 'ETC';
}

function GenerateReportButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate & Download Report'
      )}
    </Button>
  );
}


export default function ReportDisplay({ vulnerabilities, code, blockchainType }: ReportDisplayProps) {
  const [activeVulnerability, setActiveVulnerability] = useState<Vulnerability | null>(null);
  const { toast } = useToast();
  
  const [detailedReportState, formAction] = useActionState(generateDetailedReportAction, null);

  useEffect(() => {
    if (detailedReportState?.report) {
      const doc = new jsPDF();
      const reportText = detailedReportState.report;
      
      doc.setFont("courier", "normal");
      doc.setFontSize(10);
      
      const lines = doc.splitTextToSize(reportText, 180);
      doc.text(lines, 10, 10);
      
      const vulnerabilityName = vulnerabilities.length > 0 ? vulnerabilities[0].title : 'vulnerability';
      const fileName = `${vulnerabilityName.replace(/\s+/g, '_')}_report.pdf`;
      doc.save(fileName);
    }
    if (detailedReportState?.error) {
      toast({
        variant: 'destructive',
        title: 'Report Generation Failed',
        description: detailedReportState.error,
      });
    }
  }, [detailedReportState, toast, vulnerabilities]);


  const highlightedLines = useMemo(() => {
    if (activeVulnerability) {
      return activeVulnerability.lines;
    }
    return vulnerabilities.flatMap(v => v.lines);
  }, [vulnerabilities, activeVulnerability]);

  const summary = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0, Unknown: 0 };
    vulnerabilities.forEach(v => {
      counts[v.severity] = (counts[v.severity] || 0) + 1;
    });
    return counts;
  }, [vulnerabilities]);

  useEffect(() => {
    // Reset active vulnerability when report changes
    setActiveVulnerability(null);
  }, [vulnerabilities]);

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
    <>
      <Card className="mt-8 animate-in fade-in-50 duration-500">
        <CardHeader>
           <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-2xl">Vulnerability Report</CardTitle>
              <CardDescription>
                Found {vulnerabilities.length} potential vulnerabilities. Select an issue to see details and highlighted code.
              </CardDescription>
            </div>
            <form action={formAction}>
              <input type="hidden" name="contractCode" value={code} />
              <input type="hidden" name="vulnerabilities" value={JSON.stringify(vulnerabilities)} />
              <input type="hidden" name="blockchain" value={blockchainType} />
              <GenerateReportButton />
            </form>
          </div>

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
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vuln.description}</p>
                      </div>
                      {vuln.location && (
                        <div>
                          <h4 className="font-semibold mb-1">Location</h4>
                          <p className="text-sm text-muted-foreground font-mono">{vuln.location}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold mb-1">Recommendation</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{vuln.recommendation}</p>
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
    </>
  );
}
