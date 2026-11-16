import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  Bot
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Getting Started',
    question: 'How do I get started with CrossBorder Ready?',
    answer:
      'To get started, click "New Shipment Check" on the Shipments page. Upload your commercial invoice (PDF, JPG, or PNG), fill in your shipment particulars such as quantity, weight, and destination country, and click "Run AI Validation" to automatically analyze for customs compliance discrepancies.'
  },
  {
    id: 'faq-2',
    category: 'Document Uploads',
    question: 'Which file formats are supported?',
    answer:
      'CrossBorder Ready supports commercial invoices, packing lists, and bills of lading in PDF, JPG, and PNG formats up to 25 MB per file. The embedded PaddleOCR engine extracts high-density tabular line items and metadata automatically.'
  },
  {
    id: 'faq-3',
    category: 'AI Validation',
    question: 'How does AI validation work?',
    answer:
      'AI extracts key information from your invoice and compares it with your shipment details. It checks required fields, values and consistency, then highlights issues for you to review and correct before submission.'
  },
  {
    id: 'faq-4',
    category: 'AI Validation',
    question: 'Why was my invoice flagged?',
    answer:
      'An invoice may be flagged when required information is missing or doesn\'t match your shipment details. Common reasons include missing HS codes, declared values differing from the commercial invoice total, or weight/quantity discrepancies between entered data and document line items.'
  },
  {
    id: 'faq-5',
    category: 'AI Validation',
    question: 'How can I correct extracted fields?',
    answer:
      'On the "Review & fix" workbench, click any flagged issue in the table. You can select "Accept fix" to adopt the AI suggestion, click "Edit manually" to type in a verified figure, or click "Ignore" if the discrepancy represents a documented packaging tare exception.'
  },
  {
    id: 'faq-6',
    category: 'Customs Documentation',
    question: 'How are dimensions and weights validated?',
    answer:
      'Weights are cross-referenced between the commercial invoice net/gross weights and transport cargo data. If gross weight exceeds invoice net weight due to pallets or packaging, customs requires an exception note prior to clearance filing.'
  },
  {
    id: 'faq-7',
    category: 'Reports & Downloads',
    question: 'How do I download generated reports?',
    answer:
      'From the "Generated Reports" page or the final "Report & submit" step, you can download audit-ready compliance certificates in PDF format or tabular audit logs in CSV format.'
  },
  {
    id: 'faq-8',
    category: 'Troubleshooting',
    question: 'What happens if required fields are missing?',
    answer:
      'If critical fields like Harmonized System (HS) codes or declared total values are missing, submission will be blocked with a red "Critical" badge until the details are either entered manually or confirmed through supplier documentation.'
  }
];

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const HelpSupportView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-3'); // 'How does AI validation work?' expanded by default!

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Hi! I can help explain validation results, document requirements and reports. What can I help you with?',
      timestamp: '10:30 AM'
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Why was my invoice flagged?',
      timestamp: '10:31 AM'
    },
    {
      id: 'm3',
      sender: 'assistant',
      text: `An invoice may be flagged when required information is missing or doesn't match your shipment details. Common reasons include:

• Missing HS code or incomplete consignee address
• Declared value different from the invoice total
• Inconsistent quantities, dimensions or weights

Open Validation results to review each highlighted field. Confirm the source invoice, correct the details and select Re-validate.`,
      timestamp: '10:31 AM'
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Filter FAQs by search query
  const filteredFaqs = FAQS.filter((faq) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  });

  // Group by category
  const categories = Array.from(new Set(filteredFaqs.map((f) => f.category)));

  const handleToggleFaq = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuestion).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsTyping(true);

    // Simulated Intelligent Assistant Response
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('missing') || lower.includes('fix')) {
        reply =
          'To fix missing fields such as HS codes or consignee details, open the "Review & fix" workbench. Click the flagged field in the Issues Found list, choose "Edit manually", enter the verified value, and click "Apply Correction". The clearance readiness score will update instantly.';
      } else if (lower.includes('file') || lower.includes('upload') || lower.includes('format')) {
        reply =
          'You can upload Commercial Invoices, Packing Lists, and Air Waybills in PDF, JPG, and PNG formats up to 25 MB per document. PaddleOCR will extract the invoice number, line items, buyer/seller, and totals automatically.';
      } else if (lower.includes('weight') || lower.includes('mismatch')) {
        reply =
          'Weight discrepancies occur when the invoice net weight does not match the transport gross weight. If the entered weight retains net weight (e.g., 96 kg vs 118 kg invoice), provide an explanation note in Step 4 under "Before you submit" to certify packaging tare and unlock customs filing.';
      } else {
        reply =
          'I have analyzed your query with our customs compliance knowledge base. You can review all extracted fields against your commercial invoice directly in the interactive document visualizer on the Review & Fix page. Let me know if you need specific guidance on tariff classifications or customs declarations.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: 'Just now'
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'init',
        sender: 'assistant',
        text: 'Hi! I can help explain validation results, document requirements and reports. What can I help you with?',
        timestamp: '10:30 AM'
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 font-medium">Help</div>

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
          Help & Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Find answers to common questions or get assistance from our AI chatbot.
        </p>
      </div>

      {/* Top Search FAQs Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200 shadow-card">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs and help articles..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:border-ups-gold outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Frequently Asked Questions (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-200 shadow-card space-y-5">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Browse by topic to find the answers you need.
            </p>
          </div>

          <div className="space-y-6">
            {categories.map((cat) => (
              <div key={cat} className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  {cat}
                </span>

                <div className="divide-y divide-gray-100 border-t border-gray-100">
                  {filteredFaqs
                    .filter((f) => f.category === cat)
                    .map((faq) => {
                      const isExpanded = expandedFaqId === faq.id;

                      return (
                        <div key={faq.id} className="py-3">
                          <button
                            onClick={() => handleToggleFaq(faq.id)}
                            className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-900 hover:text-ups-brown transition-colors group"
                          >
                            <span>{faq.question}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700 flex-shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <p className="text-xs text-gray-600 mt-2 leading-relaxed pl-1 animate-in fade-in">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: CrossBorder AI Assistant Chatbot (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 shadow-card flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-ups-brown flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-ups-gold-dark" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  CrossBorder AI Assistant
                </h3>
                <p className="text-[11px] text-gray-500">
                  Help with your shipment documents
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="text-xs font-semibold text-gray-500 hover:text-ups-brown underline"
            >
              Clear Chat
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] text-gray-400 mb-1 px-1">
                    {isAssistant ? 'CrossBorder AI Assistant' : 'You'}
                  </span>

                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                      isAssistant
                        ? 'bg-gray-50 border border-gray-200 text-gray-800'
                        : 'bg-amber-100/90 text-amber-950 font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 pl-1">
                <Bot className="w-3.5 h-3.5 text-ups-gold-dark animate-bounce" />
                <span>Assistant is typing...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
            <span className="text-[10px] text-gray-400 block mb-1.5 font-medium">
              You can also ask:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSendMessage('How do I fix missing fields?')}
                className="text-[11px] font-semibold text-gray-700 bg-white border border-gray-300 hover:border-ups-gold hover:bg-amber-50/50 px-2.5 py-1 rounded-lg transition-colors"
              >
                How do I fix missing fields?
              </button>
              <button
                onClick={() => handleSendMessage('Which files can I upload?')}
                className="text-[11px] font-semibold text-gray-700 bg-white border border-gray-300 hover:border-ups-gold hover:bg-amber-50/50 px-2.5 py-1 rounded-lg transition-colors"
              >
                Which files can I upload?
              </button>
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-gray-200 bg-white space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-ups-gold outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!inputQuestion.trim()}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-ups-gold hover:bg-ups-gold-hover text-ups-brown font-extrabold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="text-[10px] text-gray-400 leading-tight">
              AI responses may be inaccurate. Verify guidance before making changes. Do not share sensitive personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 border-t border-gray-200 gap-2">
        <span>AI guidance supports review and does not confirm regulatory compliance.</span>
        <span>UPS CrossBorder Ready</span>
      </div>
    </div>
  );
};
