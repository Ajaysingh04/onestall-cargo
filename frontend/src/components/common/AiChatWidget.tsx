import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Truck, RotateCcw, HelpCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AiChatWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'bot',
      text: 'Hello! I am OneStall AI Assistant. I can track your orders, calculate shipping charges, or help with returns. How can I help you today?',
      quickActions: ['Track my AWB', 'Check Pincode 110001 SLA', 'How do Returns work?'],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (userText: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    const lower = textToSend.toLowerCase();

    setTimeout(async () => {
      let botResponse = '';
      let actionBtn: any = null;

      if (lower.includes('track') || lower.includes('awb') || lower.includes('os-')) {
        botResponse =
          'Tracking your recent order with AWB OS-882910412: Your parcel is currently OUT FOR DELIVERY with Rider Rahul Sharma. Expected delivery today by 6:00 PM.';
        actionBtn = {
          label: 'View Live Audit Trail',
          onClick: () => navigate('/cargo?tab=track'),
        };
      } else if (lower.includes('pincode') || lower.includes('110001') || lower.includes('sla')) {
        botResponse =
          'Pincode 110001 (New Delhi) is serviced directly by OneStall Delhi Central Logistics Hub (OS-HUB-DEL01). Delivery SLA is Next-Day (Within 24 Hours) with Cash on Delivery supported.';
      } else if (lower.includes('return') || lower.includes('refund')) {
        botResponse =
          'OneStall provides a 7-day hassle-free doorstep return policy. Our OneStall Cargo rider will arrive at your address with reverse QC verification within 24 hours of request.';
      } else {
        botResponse = `Thanks for asking! As your OneStall AI assistant, I can help you with: \n• Tracking AWBs\n• Shipping rate comparisons\n• Marketplace orders & cancellations\nWould you like to speak to human support?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          actionBtn,
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all border border-blue-400/40 cursor-pointer glow-blue group relative"
          title="OneStall AI Support & Order Tracking"
        >
          <Bot size={26} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse" />
        </button>
      ) : (
        <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-80 sm:w-96 shadow-2xl flex flex-col h-[480px] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 flex items-center justify-between border-b border-blue-800/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-300">
                <Bot size={18} />
              </div>
              <div>
                <div className="font-heading font-bold text-white text-sm flex items-center gap-1.5">
                  <span>OneStall AI Assistant</span>
                  <Sparkles size={13} className="text-amber-400" />
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Instant Tracking & Support</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20'
                      : 'bg-slate-800 border border-slate-700/80 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  {m.actionBtn && (
                    <button
                      onClick={m.actionBtn.onClick}
                      className="mt-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Truck size={13} />
                      <span>{m.actionBtn.label}</span>
                    </button>
                  )}
                </div>

                {/* Quick actions on initial message */}
                {m.quickActions && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.quickActions.map((qa: string, qIdx: number) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSend(qa)}
                        className="bg-slate-800/80 hover:bg-slate-700 text-blue-300 border border-slate-700/60 rounded-full px-2.5 py-1 text-[10px] transition-colors cursor-pointer"
                      >
                        {qa}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs bg-slate-800 p-2.5 rounded-2xl w-24">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200" />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about AWB, order or returns..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiChatWidget;
