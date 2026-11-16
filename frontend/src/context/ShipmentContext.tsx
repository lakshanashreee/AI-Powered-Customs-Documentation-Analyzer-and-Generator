import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  ShipmentDetails,
  UploadedDocument,
  ValidationIssue,
  AuditRecord
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

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionRef, setSubmissionRef] = useState<string | null>(null);

  // Compute issue counts
  const criticalCount = useMemo(() => {
    return issues.filter((i) => i.severity === 'critical' && i.status === 'open').length;
  }, [issues]);

  const warningsCount = useMemo(() => {
    return issues.filter((i) => i.severity === 'warning' && i.status === 'open').length;
  }, [issues]);

  const checksPassedCount = 14;

  // Dynamic Readiness Score:
  // Starts at 62. Each resolved critical adds +14. Each resolved warning adds +6. Max 94 (or 100).
  const readinessScore = useMemo(() => {
    let score = 62;
    const decVal = issues.find((i) => i.id === 'issue-1');
    if (decVal && decVal.status === 'corrected') score += 16;
    const hsCode = issues.find((i) => i.id === 'issue-2');
    if (hsCode && (hsCode.status === 'corrected' || hsCode.status === 'added')) score += 16;
    return Math.min(score, 94);
  }, [issues]);

  const selectedIssue = useMemo(() => {
    return issues.find((i) => i.id === selectedIssueId) || issues[0];
  }, [issues, selectedIssueId]);

  const updateShipmentDetails = (data: Partial<ShipmentDetails>) => {
    setShipmentDetails((prev) => ({ ...prev, ...data }));
  };

  const addDocument = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileType = ext === 'pdf' ? 'pdf' : ext === 'png' ? 'png' : 'jpg';
    const newDoc: UploadedDocument = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      fileType: fileType as 'pdf' | 'jpg' | 'png',
      status: 'processing',
      progress: 40,
      uploadedAt: 'Just now'
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Simulate completion
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === newDoc.id
            ? {
                ...d,
                status: 'extracted',
                progress: 100,
                extractedSummary: {
                  invoiceNumber: 'INV-0412',
                  seller: 'ABC Exports',
                  buyer: 'Global Traders',
                  totalAmount: '$4,800',
                  currency: 'USD'
                }
              }
            : d
        )
      );
    }, 1500);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Issue Action: Accept Fix
  const acceptFix = (issueId: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            status: 'corrected',
            enteredValue: iss.invoiceValue !== 'Missing' ? iss.invoiceValue : '4202.21',
            isBlocking: false
          };
        }
        return iss;
      })
    );

    // If it's Declared Value, update shipment details declared value to 4800
    if (issueId === 'issue-1') {
      setShipmentDetails((prev) => ({ ...prev, declaredValue: 4800 }));
    }
    // If it's HS code
    if (issueId === 'issue-2') {
      // update HS code
    }
  };

  // Issue Action: Edit Manually
  const editManually = (issueId: string, customValue: string) => {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
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

    if (issueId === 'issue-1') {
      setShipmentDetails((prev) => ({ ...prev, declaredValue: customValue }));
    }
    if (issueId === 'issue-3') {
      setShipmentDetails((prev) => ({ ...prev, totalWeight: customValue }));
    }
    if (issueId === 'issue-4') {
      setShipmentDetails((prev) => ({ ...prev, quantity: customValue }));
    }
  };

  // Issue Action: Ignore
  const ignoreIssue = (issueId: string) => {
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
  };

  const saveExceptionNote = () => {
    if (!exceptionReason.trim()) return;
    setIsNoteSaved(true);
    setAuditRecords((prev) =>
      prev.map((rec) => {
        if (rec.field === 'Gross weight') {
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

  const triggerRevalidation = async () => {
    setIsValidating(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsValidating(false);
  };

  const submitForCustomsClearance = async () => {
    setIsSubmitting(true);
    try {
      const res = await ApiService.submitCustomsClearance('0412', [
        {
          field: 'gross_weight',
          reason: exceptionReason,
          savedAt: new Date().toISOString(),
          author: 'JD (Customs Compliance Officer)'
        }
      ], auditRecords);
      setSubmissionRef(res.submissionReference);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetDemo = () => {
    setCurrentStep(1);
    setShipmentDetails(INITIAL_SHIPMENT_DETAILS);
    setDocuments(INITIAL_DOCUMENTS);
    setIssues(INITIAL_ISSUES);
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
        setStep: setCurrentStep,
        activeNavTab,
        setActiveNavTab,

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
