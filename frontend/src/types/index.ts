export type IssueSeverity = 'critical' | 'warning' | 'passed';

export type IssueStatus = 'open' | 'corrected' | 'added' | 'updated' | 'ignored';

export interface BoundingBox {
  id: string;
  field: string;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
  severity: IssueSeverity;
}

export interface ValidationIssue {
  id: string;
  field: string;
  displayName: string;
  severity: IssueSeverity;
  invoiceValue: string;
  enteredValue: string;
  title: string;
  description: string;
  whyItMatters: string;
  correctionGuidance: string;
  suggestedCorrection: string;
  sourceReference: string;
  status: IssueStatus;
  resolvedValue?: string;
  isBlocking?: boolean;
  boxId?: string;
}

export interface UploadedDocument {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png';
  status: 'extracted' | 'processing' | 'queued' | 'error';
  progress?: number;
  uploadedAt: string;
  extractedSummary?: {
    invoiceNumber: string;
    seller: string;
    buyer: string;
    totalAmount: string;
    currency: string;
  };
}

export interface ShipmentDetails {
  shipmentNumber: string;
  productDescription: string;
  quantity: number | string;
  totalWeight: number | string;
  length: number | string;
  width: number | string;
  height: number | string;
  declaredValue: number | string;
  currency: string;
  originCountry: string;
  destinationCountry: string;
  invoiceNumber: string;
  seller: string;
  buyer: string;
}

export interface ExceptionNote {
  field: string;
  reason: string;
  savedAt: string;
  author: string;
}

export interface ValidationSummary {
  shipmentId: string;
  readinessInitial: number;
  readinessCurrent: number;
  criticalIssuesCount: number;
  warningsCount: number;
  checksPassedCount: number;
  hasBlockingIssues: boolean;
}

export interface AuditRecord {
  field: string;
  original: string;
  corrected: string;
  status: 'Corrected' | 'Added' | 'Updated' | 'Needs note' | 'Ignored' | 'Passed';
  statusType: 'success' | 'warning' | 'info' | 'danger';
  note?: string;
}

/**
 * Contracts for PaddleOCR and Qwen LLM Integration
 */
export interface PaddleOcrResult {
  fileName: string;
  extractedFields: {
    invoiceNo: string;
    invoiceDate: string;
    sellerName: string;
    sellerAddress: string;
    buyerName: string;
    buyerAddress: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
      hsCode?: string;
    }>;
    subtotal: number;
    tax?: number;
    totalAmount: number;
    currency: string;
    grossWeightKg?: number;
  };
  rawConfidence: number;
  processingTimeMs: number;
}

export interface QwenAnalysisRequest {
  shipmentDetails: ShipmentDetails;
  extractedInvoice: PaddleOcrResult['extractedFields'];
  complianceRuleset?: string;
}

export interface QwenAnalysisResponse {
  shipmentId: string;
  readinessScore: number;
  issues: ValidationIssue[];
  aiNotes: string[];
  recommendedHsCode?: {
    code: string;
    confidence: number;
    description: string;
  };
}

