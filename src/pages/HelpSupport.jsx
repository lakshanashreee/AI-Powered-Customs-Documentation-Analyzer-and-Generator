import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Send, 
  Trash2, 
  Bot, 
  User, 
  HelpCircle,
  FileCheck2
} from 'lucide-react';
import { sampleFAQs } from '../data/mockData';

export function HelpSupport() {
  const [faqs, setFaqs] = useState(sampleFAQs);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(2); // 'How does AI validation work?' open by default

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hi! I can help explain validation results, document requirements and reports. What can I help you with?",
    },
    {
      id: 2,
      sender: 'user',
      text: "Why was my invoice flagged?",
    },
    {
      id: 3,
      sender: 'assistant',
      text: `An invoice may be flagged when required information is missing or doesn't match your shipment details. Common reasons include:

• Missing HS code or incomplete consignee address
• Declared value different from the invoice total
• Inconsistent quantities, dimensions or weights

Open Validation results to review each highlighted field. Confirm the source invoice, correct the details and select Re-validate.`,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I've checked the customs knowledge base for your inquiry. For cross-border air freight to the US and Canada, all commercial invoices require a minimum 6-digit Harmonized Tariff Schedule (HTS) code and exact parity between the line item currency and the declared shipment value.";
      if (text.toLowerCase().includes("upload") || text.toLowerCase().includes("file")) {
        reply = "You can upload PDF (single or multi-page), JPG, PNG, or TIFF files up to 25MB. Scanned documents are automatically pre-processed by PaddleOCR-VL for high-contrast character recognition.";
      } else if (text.toLowerCase().includes("missing")) {
        reply = "When required fields are missing, you can either click 'Edit manually' on the Review & Fix page, or re-upload an amended invoice with the supplier's verified data.";
      }

      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'assistant', text: reply },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: "Chat cleared. What can I help you with regarding your customs documents?",
      },
    ]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 pt-2 px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="text-xs text-gray-500 font-medium mb-1">Help</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
          Help & Support
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Find answers to common questions or get assistance from our AI chatbot.
        </p>

        {/* Global Search Bar */}
        <div className="mt-4 relative max-w-4xl">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs and help articles..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB500] focus:border-transparent transition-all bg-white shadow-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: FAQs Accordion (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Browse by topic to find the answers you need.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-3.5 first:pt-1 last:pb-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-800 mb-1">
                    {faq.category}
                  </span>
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-gray-800 hover:text-[#351C15] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-500 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="mt-2 text-xs text-gray-600 leading-relaxed pl-1 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="py-8 text-center text-xs text-gray-400">
                No FAQs match your search query. Try asking the AI Assistant on the right.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: CrossBorder AI Assistant Chat (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col h-[650px]">
          {/* Assistant Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-[#351C15]">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E293B]">CrossBorder AI Assistant</h3>
                <p className="text-[11px] text-gray-400">Help with your shipment documents</p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="text-[11px] text-gray-400 hover:text-gray-700 font-medium"
            >
              Clear Chat
            </button>
          </div>

          {/* Chat Messages scroll area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-[10px] text-gray-400 mb-1 px-1 font-semibold">
                  {msg.sender === 'user' ? 'You' : 'CrossBorder AI Assistant'}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-amber-100 text-[#351C15] font-medium rounded-tr-xs'
                      : 'bg-gray-50 border border-gray-200/80 text-gray-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-gray-400 ml-1">Assistant is typing...</span>
              </div>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="pt-2 border-t border-gray-100">
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              You can also ask
            </span>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button
                onClick={() => handleSendMessage("How do I fix missing fields?")}
                className="px-2.5 py-1 text-[11px] bg-gray-50 hover:bg-amber-50 border border-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                How do I fix missing fields?
              </button>
              <button
                onClick={() => handleSendMessage("Which files can I upload?")}
                className="px-2.5 py-1 text-[11px] bg-gray-50 hover:bg-amber-50 border border-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                Which files can I upload?
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB500] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FFB500] hover:bg-[#EAA600] active:scale-95 text-[#351C15] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <p className="text-[10px] text-gray-400 mt-2 text-center">
              AI responses may be inaccurate. Verify guidance before making changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
