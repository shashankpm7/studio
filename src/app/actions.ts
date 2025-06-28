'use server';

import { aiPoweredVulnerabilityDetection } from '@/ai/flows/ai-powered-vulnerability-detection';
import { generateVulnerabilityReport } from '@/ai/flows/generate-vulnerability-report';
import type { Vulnerability } from '@/types';
import { parseLines } from '@/lib/report-parser';

interface ScanState {
  vulnerabilities?: Vulnerability[];
  code?: string;
  blockchainType?: 'ETH' | 'SOL' | 'ETC';
  error?: string;
}

export async function scanContractAction(
  prevState: ScanState | null,
  formData: FormData
): Promise<ScanState | null> {
  try {
    const smartContractCode = formData.get('smartContractCode') as string;
    const blockchainType = formData.get('blockchainType') as 'ETH' | 'SOL' | 'ETC';

    if (!smartContractCode || smartContractCode.trim().length < 10) {
      return { error: "Please provide valid smart contract code." };
    }
    if (!blockchainType) {
      return { error: "Please select a blockchain." };
    }

    const result = await aiPoweredVulnerabilityDetection({
      smartContractCode,
      blockchainType,
    });
    
    if (result && result.vulnerabilities) {
      const vulnerabilities = result.vulnerabilities.map((vuln) => ({
        ...vuln,
        id: vuln.title.replace(/\s+/g, '-') + Math.random(),
        lines: parseLines(vuln.location),
      }));
      return { vulnerabilities, code: smartContractCode, blockchainType };
    } else {
      return { error: "The AI failed to generate a report. Please try again." };
    }

  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred. Please check the logs." };
  }
}


interface DetailedReportState {
  report?: string;
  error?: string;
}

export async function generateDetailedReportAction(
  prevState: DetailedReportState | null,
  formData: FormData
): Promise<DetailedReportState | null> {
  try {
    const contractCode = formData.get('contractCode') as string;
    const vulnerabilitiesStr = formData.get('vulnerabilities') as string;
    const blockchain = formData.get('blockchain') as 'ETH' | 'SOL' | 'ETC';

    if (!contractCode || !vulnerabilitiesStr || !blockchain) {
      return { error: 'Missing required information to generate the report.' };
    }
    
    const parsedVulnerabilities: Vulnerability[] = JSON.parse(vulnerabilitiesStr);
    const vulnerabilityTitles = parsedVulnerabilities.map(v => v.title);

    const result = await generateVulnerabilityReport({
      contractCode,
      vulnerabilities: vulnerabilityTitles,
      blockchain,
    });

    if (result.report) {
      return { report: result.report };
    } else {
      return { error: 'The AI failed to generate a detailed report.' };
    }
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while generating the report.' };
  }
}
