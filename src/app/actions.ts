'use server';

import { aiPoweredVulnerabilityDetection } from '@/ai/flows/ai-powered-vulnerability-detection';

interface ScanState {
  report?: string;
  code?: string;
  error?: string;
}

export async function scanContractAction(
  prevState: ScanState | null,
  formData: FormData
): Promise<ScanState | null> {
  try {
    const smartContractCode = formData.get('smartContractCode') as string;
    const blockchainType = formData.get('blockchainType') as string;

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
    
    if (result && result.vulnerabilityReport) {
      return { report: result.vulnerabilityReport, code: smartContractCode };
    } else {
      return { error: "The AI failed to generate a report. Please try again." };
    }

  } catch (e) {
    console.error(e);
    return { error: "An unexpected error occurred. Please check the logs." };
  }
}
