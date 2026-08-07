/**
 * APEX PSI SDK
 * Cryptographic verification for JavaScript/TypeScript
 */

import fetch from "node-fetch";

// Configuration
const DEFAULT_API_BASE = "https://sovereign-ai.services/api";

export interface ApexConfig {
  apiBase?: string;
  apiKey?: string;
}

export interface SealOptions {
  content: string;
  metadata?: Record<string, any>;
}

export interface Receipt {
  hash: string;
  signature: string;
  timestamp: string;
  metadata?: Record<string, any>;
  content?: string;
}

export interface VerificationResult {
  valid: boolean;
  details: Record<string, any>;
}

export interface AnchorProof {
  receiptHash: string;
  bitcoinTxId?: string;
  otsFile?: string;
  timestamp: string;
}

export interface CitationResult {
  citation: string;
  format: string;
}

export interface AuditFinding {
  type: string;
  severity: string;
  message: string;
  receiptIndex?: number;
}

export interface AuditReport {
  totalReceipts: number;
  findings: AuditFinding[];
  valid: boolean;
}

export class ApexPSI {
  private apiBase: string;
  private apiKey?: string;

  constructor(config: ApexConfig = {}) {
    this.apiBase = config.apiBase || DEFAULT_API_BASE;
    this.apiKey = config.apiKey;
  }

  private async apiCall<T>(endpoint: string, method: string = "GET", body?: any): Promise<T> {
    const url = `${this.apiBase}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`APEX API error: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Seal content with a cryptographic receipt
   */
  async seal(options: SealOptions): Promise<Receipt> {
    return this.apiCall<Receipt>("/seal", "POST", {
      content: options.content,
      metadata: options.metadata || {},
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Verify a receipt is authentic
   */
  async verify(receipt: Receipt, content?: string): Promise<VerificationResult> {
    return this.apiCall<VerificationResult>("/verify", "POST", {
      receipt,
      content,
    });
  }

  /**
   * Anchor a receipt to Bitcoin via OpenTimestamps
   */
  async anchor(receipt: Receipt): Promise<AnchorProof> {
    return this.apiCall<AnchorProof>("/anchor", "POST", {
      receipt,
    });
  }

  /**
   * Generate a citation for a receipt
   */
  async cite(receipt: Receipt, format: "apa" | "bibtex" | "mla" = "apa"): Promise<CitationResult> {
    return this.apiCall<CitationResult>("/cite", "POST", {
      receipt,
      format,
    });
  }

  /**
   * Audit a chain of receipts
   */
  async audit(receipts: Receipt[], checkAnchoring: boolean = false): Promise<AuditReport> {
    return this.apiCall<AuditReport>("/audit", "POST", {
      receipts,
      checkAnchoring,
    });
  }
}

// Default export
export default ApexPSI;

// Convenience functions
export async function seal(content: string, metadata?: Record<string, any>, config?: ApexConfig): Promise<Receipt> {
  const client = new ApexPSI(config);
  return client.seal({ content, metadata });
}

export async function verify(receipt: Receipt, content?: string, config?: ApexConfig): Promise<VerificationResult> {
  const client = new ApexPSI(config);
  return client.verify(receipt, content);
}

export async function anchor(receipt: Receipt, config?: ApexConfig): Promise<AnchorProof> {
  const client = new ApexPSI(config);
  return client.anchor(receipt);
}

export async function cite(receipt: Receipt, format?: "apa" | "bibtex" | "mla", config?: ApexConfig): Promise<CitationResult> {
  const client = new ApexPSI(config);
  return client.cite(receipt, format);
}

export async function audit(receipts: Receipt[], checkAnchoring?: boolean, config?: ApexConfig): Promise<AuditReport> {
  const client = new ApexPSI(config);
  return client.audit(receipts, checkAnchoring);
}
