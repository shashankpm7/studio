'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast";
import { scanContractAction } from '@/app/actions';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ScanLine } from "lucide-react";
import ReportDisplay from './report-display';

const initialState = null;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <ScanLine className="mr-2 h-4 w-4" />
          Scan Contract
        </>
      )}
    </Button>
  );
}

export default function ChainSentryClient() {
  const [state, formAction] = useActionState(scanContractAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div className="mt-12 md:mt-20">
      <Card className="bg-card/50 border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Vulnerability Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid w-full gap-4">
              <div className="space-y-2">
                <Label htmlFor="smartContractCode">Smart Contract Code</Label>
                <Textarea
                  id="smartContractCode"
                  name="smartContractCode"
                  placeholder="Paste your smart contract code here..."
                  className="min-h-[300px] font-mono text-sm bg-background"
                  required
                />
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4">
                 <div className="space-y-2 w-full md:w-1/3">
                    <Label htmlFor="blockchainType">Blockchain</Label>
                    <Select name="blockchainType" required>
                      <SelectTrigger id="blockchainType">
                        <SelectValue placeholder="Select blockchain" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="SOL">Solana (SOL)</SelectItem>
                        <SelectItem value="ETC">Ethereum Classic (ETC)</SelectItem>
                      </SelectContent>
                    </Select>
                 </div>
                 <div className="w-full md:w-2/3 md:self-end">
                    <SubmitButton />
                 </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {state?.vulnerabilities && state?.code && state?.blockchainType && (
        <div className="mt-8">
          <ReportDisplay 
            vulnerabilities={state.vulnerabilities} 
            code={state.code}
            blockchainType={state.blockchainType}
          />
        </div>
      )}
    </div>
  );
}
