import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ShipmentDetails,
  UploadedDocument,
  ValidationIssue,
  AuditRecord,
  ReportItem
} from '../types';
import {
  INITIAL_SHIPMENT_DETAILS,
  INITIAL_DOCUMENTS,
  INITIAL_ISSUES,
  INITIAL_AUDIT_RECORDS,
  ApiService
} from '../services/api';

interface ShipmentContextType {
  currentStep: number;
  setStep: (step: number) => void;
  activeNavTab: 'shipments' | 'reports' | 'help' | 'account';
  setActiveNavTab: (tab: 'shipments' | 'reports' | 'help' | 'account') => void;

  authUser: any | null;
  loginUser: (user: any) => void;
  logoutUser: () => void;

  shipmentDetails: ShipmentDetails;
  updateShipmentDetails: (data: Partial<ShipmentDetails>) => void;

  documents: UploadedDocument[];
  addDocument: (file: File) => void;
  removeDocument: (id: string) => void;

  issues: ValidationIssue[];
  selectedIssue: ValidationIssue | undefined;
  selectedIssueId: string;
  setSelectedIssueId: (id: string) => void;
  filterSeverity: 'all' | 'critical' | 'warning' | 'passed';
  setFilterSeverity: (f: 'all' | 'critical' | 'warning' | 'passed') => void;

  acceptFix: (issueId: string) => void;
  editManually: (issueId: string, customValue: string) => void;
  ignoreIssue: (issueId: string) => void;

  exceptionReason: string;
  setExceptionReason: (val: string) => void;
  isNoteSaved: boolean;
  saveExceptionNote: () => void;

  auditRecords: AuditRecord[];
  readinessScore: number;
  criticalCount: number;
  warningsCount: number;
  checksPassedCount: number;

  reports: ReportItem[];
  addReport: (report: ReportItem) => void;

  isValidating: boolean;
  triggerRevalidation: () => Promise<void>;

  isSubmitting: boolean;
  isSubmitted: boolean;
  submissionRef: string | null;
  submitForCustomsClearance: () => Promise<void>;
  resetDemo: () => void;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const ShipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('crossborder_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const loginUser = (user: any) => {
    setAuthUser(user);
    localStorage.setItem('crossborder_user', JSON.stringify(user));
  };

  const logoutUser = () => {
    setAuthUser(null);
    localStorage.removeItem('crossborder_user');
    localStorage.removeItem('crossborder_token');
  };

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeNavTab, setActiveNavTab] = useState<'shipments' | 'reports' | 'help' | 'account'>('shipments');

  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails>(INITIAL_SHIPMENT_DETAILS);
  const [documents, setDocuments] = useState<UploadedDocument[]>(INITIAL_DOCUMENTS);
  const [issues, setIssues] = useState<ValidationIssue[]>(INITIAL_ISSUES);
  const [selectedIssueId, setSelectedIssueId] = useState<string>('issue-1');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'passed'>('all');

  const [exceptionReason, setExceptionReason] = useState<string>('');
  const [isNoteSaved, setIsNoteSaved] = useState<boolean>(false);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(INITIAL_AUDIT_RECORDS);

  // Stored Reports: Starts completely empty (0 reports)
  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('crossborder_reports');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Last extracted document fields for comparison
  const [lastExtractedFields, setLastExtractedFields] = useState<any>(null);

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionRef, setSubmissionRef] = useState<string | null>(null);

  // Compute live issue counts
  const criticalCount = useMemo(() => {
    return issues.filter((i) => i.severity === 'critical' && i.status === 'open').length;
  }, [issues]);

  const warningsCount = useMemo(() => {
    return issues.filter((i) => i.severity === 'warning' && i.status === 'open').length;
  }, [issues]);

  const checksPassedCount = 14;

  // Dynamic Readiness Score (starts high, reduced by active criticals/warnings)
  const readinessScore = useMemo(() => {
    if (issues.length === 0) return 98;
    let score = 100 - (criticalCount * 18) - (warningsCount * 6);
    if (score < 10) score = 10;
    if (score > 100) score = 100;
    return score;
  }, [issues, criticalCount, warningsCount]);

  const selectedIssue = useMemo(() => {
    return issues.find((i) => i.id === selectedIssueId) || issues[0];
  }, [issues, selectedIssueId]);

  const updateShipmentDetails = (data: Partial<ShipmentDetails>) => {
    setShipmentDetails((prev) => ({ ...prev, ...data }));
  };

  const addReport = (newReport: ReportItem) => {
    setReports((prev) => {
      const updated = [newReport, ...prev];
      localStorage.setItem('crossborder_reports', JSON.stringify(updated));
      return updated;
    });
  };

  // Add Document & Run Dynamic Extraction
  const addDocument = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = ext === 'pdf' ? 'pdf' : ext === 'csv' ? 'csv' : (ext === 'png' ? 'png' : 'jpg');
    
    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: fileType as any,
      status: 'processing',
      progress: 50,
      uploadedAt: 'Just now'
    };

    setDocuments((prev) => [newDoc, ...prev]);

    try {
      const ocrRes = await ApiService.extractDocumentWithPaddleOcr(file, shipmentDetails.shipmentNumber);
      setLastExtractedFields(ocrRes.extractedFields);

      setDocuments((prev) =>
        prev.map((d) =>
          d.id === newDoc.id
            ? {
                ...d,
                status: 'extracted',
                progress: 100,
                extractedSummary: {
                  invoiceNumber: ocrRes.extractedFields.invoiceNo,
                  seller: ocrRes.extractedFields.sellerName,
                  buyer: ocrRes.extractedFields.buyerName,
                  totalAmount: `$${ocrRes.extractedFields.totalAmount.toLocaleString()}`,
                  currency: ocrRes.extractedFields.currency
                }
              }
            : d
        )
      );

      // Auto-fill shipment details directly from the extracted invoice
      const item = ocrRes.extractedFields.items[0];
      const rawNum = ocrRes.extractedFields.invoiceNo.replace(/\D/g, '');
      const shipNum = rawNum ? rawNum.slice(-4) : '8841';

      setShipmentDetails({
        shipmentNumber: shipNum,
        productDescription: item?.description || 'Industrial Machinery Cargo',
        quantity: item?.quantity || 100,
        totalWeight: ocrRes.extractedFields.grossWeightKg || 45,
        length: 40,
        width: 30,
        height: 25,
        declaredValue: ocrRes.extractedFields.totalAmount || 1500,
        currency: ocrRes.extractedFields.currency || 'USD',
        originCountry: 'India',
        destinationCountry: 'USA',
        invoiceNumber: ocrRes.extractedFields.invoiceNo,
        seller: ocrRes.extractedFields.sellerName,
        buyer: ocrRes.extractedFields.buyerName
      });
    } catch {
      setDocuments((prev) =>
        prev.map((d) => (d.id === newDoc.id ? { ...d, status: 'error' } : d))
      );
    }
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Re-generate issues dynamically
  const triggerRevalidation = async () => {
    setIsValidating(true);
    try {
      const qwenRes = await ApiService.runQwenComplianceAnalysis(shipmentDetails, lastExtractedFields);
      setIssues(qwenRes.issues);
      if (qwenRes.issues.length > 0) {
        setSelectedIssueId(qwenRes.issues[0].id);
      }

      // Sync audit records from issues
      const records: AuditRecord[] = qwenRes.issues.map((i) => ({
        field: i.displayName,
        original: i.enteredValue,
        corrected: i.status === 'corrected' ? i.invoiceValue : (i.status === 'ignored' ? `${i.enteredValue} retained` : 'Pending review'),
        status: i.status === 'corrected' ? 'Corrected' : (i.status === 'ignored' ? 'Needs note' : 'Needs note'),
        statusType: i.status === 'corrected' ? 'success' : 'warning',
        note: i.field.includes('weight') ? exceptionReason : undefined
      }));
      setAuditRecords(records);
    } finally {
      setIsValidating(false);
    }
  };

  // Step change hook: auto-run dynamic validation when moving to Step 2
  const setStep = (step: number) => {
    setCurrentStep(step);
    if (step === 2 || step === 3) {
      triggerRevalidation();
    }
  };

  // Issue Action: Accept Fix
  const acceptFix = (issueId: string) => {
    ApiService.applyFix(shipmentDetails.shipmentNumber, issueId);

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const cleanValue = iss.invoiceValue.replace(/[^\d.]/g, '');

          // Update underlying shipment details
          if (iss.field === 'declared_value' && cleanValue) {
            setShipmentDetails((s) => ({ ...s, declaredValue: parseFloat(cleanValue) }));
          } else if (iss.field === 'gross_weight' && cleanValue) {
            setShipmentDetails((s) => ({ ...s, totalWeight: parseFloat(cleanValue) }));
          } else if (iss.field === 'quantity' && cleanValue) {
            setShipmentDetails((s) => ({ ...s, quantity: parseInt(cleanValue, 10) }));
          }

          const resolvedValue = iss.invoiceValue !== 'Missing' ? iss.invoiceValue : '8482.10';

          return {
            ...iss,
            status: 'corrected',
            enteredValue: resolvedValue,
            isBlocking: false
          };
        }
        return iss;
      })
    );

    // Update Audit Trail
    setAuditRecords((prev) =>
      prev.map((rec) => {
        const matchingIssue = issues.find((i) => i.id === issueId);
        if (matchingIssue && rec.field === matchingIssue.displayName) {
          return {
            ...rec,
            corrected: matchingIssue.invoiceValue !== 'Missing' ? matchingIssue.invoiceValue : '8482.10',
            status: 'Corrected',
            statusType: 'success'
          };
        }
        return rec;
      })
    );
  };

  // Issue Action: Edit Manually
  const editManually = (issueId: string, customValue: string) => {
    ApiService.editManually(shipmentDetails.shipmentNumber, issueId, customValue);

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const cleanNum = customValue.replace(/[^\d.]/g, '');
          if (iss.field === 'declared_value' && cleanNum) {
            setShipmentDetails((s) => ({ ...s, declaredValue: parseFloat(cleanNum) }));
          } else if (iss.field === 'gross_weight' && cleanNum) {
            setShipmentDetails((s) => ({ ...s, totalWeight: parseFloat(cleanNum) }));
          } else if (iss.field === 'quantity' && cleanNum) {
            setShipmentDetails((s) => ({ ...s, quantity: parseInt(cleanNum, 10) }));
          }

          return {
            ...iss,
            status: 'updated',
            enteredValue: customValue,
            isBlocking: false
          };
        }
        return iss;
      })
    );

    setAuditRecords((prev) =>
      prev.map((rec) => {
        const matchingIssue = issues.find((i) => i.id === issueId);
        if (matchingIssue && rec.field === matchingIssue.displayName) {
          return {
            ...rec,
            corrected: customValue,
            status: 'Updated',
            statusType: 'success'
          };
        }
        return rec;
      })
    );
  };

  // Issue Action: Ignore
  const ignoreIssue = (issueId: string) => {
    ApiService.ignoreIssue(shipmentDetails.shipmentNumber, issueId);

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: 'ignored',
            isBlocking: false
          };
        }
        return iss;
      })
    );

    setAuditRecords((prev) =>
      prev.map((rec) => {
        const matchingIssue = issues.find((i) => i.id === issueId);
        if (matchingIssue && rec.field === matchingIssue.displayName) {
          return {
            ...rec,
            status: 'Needs note',
            statusType: 'warning'
          };
        }
        return rec;
      })
    );
  };

  const saveExceptionNote = () => {
    if (!exceptionReason.trim()) return;
    setIsNoteSaved(true);

    ApiService.saveExceptionNote(shipmentDetails.shipmentNumber, exceptionReason);

    setAuditRecords((prev) =>
      prev.map((rec) => {
        if (rec.field.toLowerCase().includes('weight')) {
          return {
            ...rec,
            note: exceptionReason,
            status: 'Ignored',
            statusType: 'warning'
          };
        }
        return rec;
      })
    );
  };

  const submitForCustomsClearance = async () => {
    setIsSubmitting(true);
    try {
      const res = await ApiService.submitCustomsClearance(
        shipmentDetails.shipmentNumber || '0412',
        [
          {
            field: 'gross_weight',
            reason: exceptionReason || 'Verified shipment documentation',
            savedAt: new Date().toISOString(),
            author: authUser?.fullName || 'Priya Sharma'
          }
        ],
        auditRecords
      );

      setSubmissionRef(res.submissionReference);
      setIsSubmitted(true);

      // Create new dynamic report and persist
      const newReport: ReportItem = {
        id: `rpt-${Date.now()}`,
        reportId: `RPT-${shipmentDetails.shipmentNumber || '0412'}`,
        shipmentId: `#${shipmentDetails.shipmentNumber || '0412'}`,
        invoiceName: documents[0]?.fileName || `${shipmentDetails.invoiceNumber || 'commercial_invoice'}.pdf`,
        generatedDateTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
        route: `${shipmentDetails.originCountry || 'India'} → ${shipmentDetails.destinationCountry || 'USA'}`,
        status: criticalCount > 0 ? 'Failed' : (warningsCount > 0 ? 'Needs Review' : 'Passed'),
        issuesCount: criticalCount + warningsCount,
        seller: shipmentDetails.seller || 'Apex Global Exports',
        buyer: shipmentDetails.buyer || 'TransGlobal Logistics Inc.',
        lineItems: shipmentDetails.productDescription || 'Commercial Merchandise Cargo',
        readinessScore: readinessScore,
        criticalIssues: criticalCount,
        warnings: warningsCount,
        passedChecks: checksPassedCount,
        detectedIssues: issues.map((i) => `${i.displayName}: entered ${i.enteredValue} vs invoice ${i.invoiceValue}`),
        suggestedCorrections: ['Ready for customs brokerage electronic entry (ACE/CDS).']
      };

      addReport(newReport);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDemo = () => {
    setCurrentStep(1);
    setShipmentDetails(INITIAL_SHIPMENT_DETAILS);
    setDocuments(INITIAL_DOCUMENTS);
    setIssues([]);
    setSelectedIssueId('issue-1');
    setExceptionReason('');
    setIsNoteSaved(false);
    setIsSubmitted(false);
    setSubmissionRef(null);
  };

  return (
    <ShipmentContext.Provider
      value={{
        currentStep,
        setStep,
        activeNavTab,
        setActiveNavTab,

        authUser,
        loginUser,
        logoutUser,

        shipmentDetails,
        updateShipmentDetails,

        documents,
        addDocument,
        removeDocument,

        issues,
        selectedIssue,
        selectedIssueId,
        setSelectedIssueId,
        filterSeverity,
        setFilterSeverity,

        acceptFix,
        editManually,
        ignoreIssue,

        exceptionReason,
        setExceptionReason,
        isNoteSaved,
        saveExceptionNote,

        auditRecords,
        readinessScore,
        criticalCount,
        warningsCount,
        checksPassedCount,

        reports,
        addReport,

        isValidating,
        triggerRevalidation,

        isSubmitting,
        isSubmitted,
        submissionRef,
        submitForCustomsClearance,
        resetDemo
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipment = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment must be used within a ShipmentProvider');
  }
  return context;
};
