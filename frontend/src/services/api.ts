import {
  ShipmentDetails,
  UploadedDocument,
  ValidationIssue,
  PaddleOcrResult,
  QwenAnalysisResponse,
  ExceptionNote,
  AuditRecord
} from '../types';

/**
 * Service Layer Configuration
 * Toggle between local Mock Engine and real Backend (.NET Web API / PaddleOCR / Qwen)
 */
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCK_FALLBACK = true;

export const INITIAL_SHIPMENT_DETAILS: ShipmentDetails = {
  shipmentNumber: '0412',
  productDescription: 'Leather Handbags',
  quantity: 100,
  totalWeight: 118,
  length: 40,
  width: 30,
  height: 20,
  declaredValue: 4800,
  currency: 'USD',
  originCountry: 'India',
  destinationCountry: 'USA',
  invoiceNumber: 'INV-0412',
  seller: 'ABC Exports',
  buyer: 'Global Traders'
};

export const INITIAL_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-1',
    fileName: 'invoice_0412.pdf',
    fileSize: '1.2 MB',
    fileType: 'pdf',
    status: 'extracted',
    uploadedAt: 'Today, 10:14 AM',
    extractedSummary: {
      invoiceNumber: 'INV-0412',
      seller: 'ABC Exports',
      buyer: 'Global Traders',
      totalAmount: '$4,800',
      currency: 'USD'
    }
  },
  {
    id: 'doc-2',
    fileName: 'packing_list.jpg',
    fileSize: '840 KB',
    fileType: 'jpg',
    status: 'processing',
    progress: 60,
    uploadedAt: 'Today, 10:15 AM'
  }
];

export const INITIAL_ISSUES: ValidationIssue[] = [
  {
    id: 'issue-1',
    field: 'declared_value',
    displayName: 'Declared value',
    severity: 'critical',
    invoiceValue: '$4,800',
    enteredValue: '$3,900',
    title: 'Declared value',
    description: 'The invoice total is $4,800, but the entered declared value is $3,900. Confirm the invoice total before updating.',
    whyItMatters: 'Customs may question or delay the shipment if the declared value does not match the invoice total.',
    correctionGuidance: 'Update declared value to $4,800 and review the invoice total before continuing.',
    suggestedCorrection: 'Update declared value to $4,800',
    sourceReference: 'invoice_0412.pdf - Invoice total',
    status: 'open',
    isBlocking: true,
    boxId: 'box-total'
  },
  {
    id: 'issue-2',
    field: 'hs_code',
    displayName: 'HS code',
    severity: 'critical',
    invoiceValue: 'Missing',
    enteredValue: '—',
    title: 'HS code',
    description: 'The HS code is missing from the invoice and has not been entered. Add the correct HS code for this shipment.',
    whyItMatters: 'Missing HS codes can block customs submission and delay clearance until the classification is confirmed.',
    correctionGuidance: 'Add the correct HS code from the invoice or supplier documentation before continuing.',
    suggestedCorrection: 'Add HS Code: 4202.21 (Handbags with outer surface of leather)',
    sourceReference: 'invoice_0412.pdf - Line items table',
    status: 'open',
    isBlocking: true,
    boxId: 'box-hscode'
  },
  {
    id: 'issue-3',
    field: 'gross_weight',
    displayName: 'Gross weight',
    severity: 'warning',
    invoiceValue: '118 kg',
    enteredValue: '96 kg',
    title: 'Gross weight',
    description: 'The invoice shows 118 kg, but the entered gross weight is 96 kg. Review and confirm the correct weight.',
    whyItMatters: 'Weight mismatches can affect freight costs, customs calculations, and shipment compliance.',
    correctionGuidance: 'Review the invoice and shipment details, then update the gross weight to 118 kg if confirmed.',
    suggestedCorrection: 'Update gross weight to 118 kg (or document why net weight 96 kg was retained)',
    sourceReference: 'invoice_0412.pdf - Gross weight field',
    status: 'open',
    isBlocking: false,
    boxId: 'box-weight'
  },
  {
    id: 'issue-4',
    field: 'quantity',
    displayName: 'Quantity',
    severity: 'warning',
    invoiceValue: '240',
    enteredValue: '204',
    title: 'Quantity',
    description: 'The invoice specifies 240 units, but the entered shipment quantity is 204. Align units to prevent customs holds.',
    whyItMatters: 'Discrepancy in unit quantities can trigger physical inspection or tariff penalty.',
    correctionGuidance: 'Update entered quantity to 240 units to match commercial invoice line items.',
    suggestedCorrection: 'Update quantity to 240 units',
    sourceReference: 'invoice_0412.pdf - Quantity summary',
    status: 'open',
    isBlocking: false,
    boxId: 'box-quantity'
  },
  {
    id: 'issue-5',
    field: 'description',
    displayName: 'Description',
    severity: 'warning',
    invoiceValue: 'Too generic',
    enteredValue: '"Clothes"',
    title: 'Product description specificity',
    description: 'The product description "Clothes" is overly generic. Customs requires specific merchandise descriptions like "Leather Handbags".',
    whyItMatters: 'Vague descriptions lead to high rate of secondary inspection and clearance delays.',
    correctionGuidance: 'Provide specific commodity description matching the commercial invoice items.',
    suggestedCorrection: 'Update product description to "Leather Handbags (outer surface of bovine leather)"',
    sourceReference: 'invoice_0412.pdf - Goods description',
    status: 'open',
    isBlocking: false,
    boxId: 'box-desc'
  },
  {
    id: 'issue-6',
    field: 'consignee_address',
    displayName: 'Consignee address',
    severity: 'passed',
    invoiceValue: 'Match',
    enteredValue: 'Match',
    title: 'Consignee address match',
    description: 'The buyer and consignee addresses match between invoice and delivery manifest.',
    whyItMatters: 'Consignee alignment verifies legal importer of record.',
    correctionGuidance: 'No action required.',
    suggestedCorrection: 'Confirmed matching.',
    sourceReference: 'invoice_0412.pdf - Consignee block',
    status: 'open',
    isBlocking: false,
    boxId: 'box-consignee'
  }
];

export const INITIAL_AUDIT_RECORDS: AuditRecord[] = [
  {
    field: 'Declared value',
    original: '$3,900',
    corrected: '$4,800',
    status: 'Corrected',
    statusType: 'success'
  },
  {
    field: 'HS code',
    original: 'Missing',
    corrected: 'Added · 4202.21',
    status: 'Added',
    statusType: 'success'
  },
  {
    field: 'Quantity',
    original: '204',
    corrected: '240',
    status: 'Corrected',
    statusType: 'success'
  },
  {
    field: 'Description',
    original: '"Clothes"',
    corrected: '[Specific description added]',
    status: 'Updated',
    statusType: 'success'
  },
  {
    field: 'Gross weight',
    original: '96 kg',
    corrected: '96 kg retained\nInvoice: 118 kg · Mismatch ignored',
    status: 'Needs note',
    statusType: 'warning',
    note: ''
  }
];

export const ApiService = {
  /**
   * PaddleOCR Hook:
   * Sends the uploaded commercial invoice document to PaddleOCR backend
   */
  async extractDocumentWithPaddleOcr(file: File): Promise<PaddleOcrResult> {
    if (!USE_MOCK_FALLBACK) {
      const formData = new FormData();
      formData.append('document', file);
      const res = await fetch(`${API_BASE_URL}/ocr/extract`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('PaddleOCR extraction failed');
      return await res.json();
    }

    // Simulated high-fidelity PaddleOCR response
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      fileName: file.name,
      extractedFields: {
        invoiceNo: 'INV-0412',
        invoiceDate: '2026-04-12',
        sellerName: 'ABC Exports Ltd.',
        sellerAddress: '12 Industrial Estate, New Delhi, India',
        buyerName: 'Global Traders Inc.',
        buyerAddress: '450 Logistics Blvd, Dallas, TX 75261, USA',
        items: [
          {
            description: 'Women Leather Handbags (Bovine leather)',
            quantity: 240,
            unitPrice: 20,
            totalPrice: 4800,
            hsCode: '4202.21'
          }
        ],
        subtotal: 4800,
        totalAmount: 4800,
        currency: 'USD',
        grossWeightKg: 118
      },
      rawConfidence: 0.984,
      processingTimeMs: 720
    };
  },

  /**
   * Qwen Model Hook:
   * Cross-references entered shipment data with PaddleOCR extracted invoice data
   */
  async runQwenComplianceAnalysis(
    _shipment: ShipmentDetails,
    _extracted: PaddleOcrResult['extractedFields']
  ): Promise<QwenAnalysisResponse> {
    if (!USE_MOCK_FALLBACK) {
      const res = await fetch(`${API_BASE_URL}/qwen/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipment: _shipment, invoice: _extracted })
      });
      if (!res.ok) throw new Error('Qwen analysis failed');
      return await res.json();
    }

    // Simulated Qwen reasoning analysis
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      shipmentId: '0412',
      readinessScore: 62,
      issues: INITIAL_ISSUES,
      aiNotes: [
        'Declared value now matches the $4,800 invoice total. Quantity is aligned to 240; an HS code and a more specific description have been added for review.',
        'Gross weight remains 96 kg against 118 kg on the invoice. This warning was ignored, not resolved. A reason is required before submission.'
      ],
      recommendedHsCode: {
        code: '4202.21',
        confidence: 0.96,
        description: 'Handbags with outer surface of leather or composition leather'
      }
    };
  },

  /**
   * .NET Backend Web API: Save Shipment draft
   */
  async saveDraft(data: Partial<ShipmentDetails>): Promise<{ success: boolean; id: string }> {
    if (!USE_MOCK_FALLBACK) {
      const res = await fetch(`${API_BASE_URL}/shipments/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return await res.json();
    }
    return { success: true, id: '0412' };
  },

  /**
   * .NET Backend Web API: Final Customs Submission
   */
  async submitCustomsClearance(
    shipmentId: string,
    notes: ExceptionNote[],
    audit: AuditRecord[]
  ): Promise<{ success: boolean; submissionReference: string; submittedAt: string }> {
    if (!USE_MOCK_FALLBACK) {
      const res = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, audit })
      });
      return await res.json();
    }
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      success: true,
      submissionReference: `UPS-CB-2026-${shipmentId}-X99`,
      submittedAt: new Date().toISOString()
    };
  }
};
