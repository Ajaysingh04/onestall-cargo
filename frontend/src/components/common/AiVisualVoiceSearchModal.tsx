import React, { useState } from 'react';
import { Camera, Mic, X, Sparkles, Upload, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiVisualVoiceSearchModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'visual' | 'voice'>('visual');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleSimulateVisualSearch = (imageUrl: string, label: string) => {
    setAnalyzingImage(true);
    setMatchResult(null);

    setTimeout(() => {
      setAnalyzingImage(false);
      setMatchResult({
        category: 'Footwear & Fashion',
        confidence: '98.6%',
        matchedTitle: 'AeroGlide Pro Active Runners',
        price: '₹2,499',
        image: imageUrl,
      });
    }, 900);
  };

  const handleVoiceListen = () => {
    setIsListening(true);
    setTranscript('Listening for product, brand, or AWB...');

    setTimeout(() => {
      setTranscript('“Show me wireless noise cancelling headphones”');
      setIsListening(false);
      setMatchResult({
        category: 'Electronics & Audio',
        confidence: '99.1%',
        matchedTitle: 'Voyager Noise-Cancelling Wireless Headphones',
        price: '₹3,899',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={18} />
            <h3 className="font-heading font-bold text-white text-base">OneStall AI Multimodal Search</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => {
              setMode('visual');
              setMatchResult(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'visual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera size={15} />
            <span>AI Visual Search</span>
          </button>
          <button
            onClick={() => {
              setMode('voice');
              setMatchResult(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              mode === 'voice' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic size={15} />
            <span>AI Voice Search</span>
          </button>
        </div>

        {/* Visual Search Mode */}
        {mode === 'visual' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Upload any product photo to find identical or similar items across OneStall sellers:
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() =>
                  handleSimulateVisualSearch(
                    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
                    'Red Running Shoes'
                  )
                }
                className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 cursor-pointer text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                  alt="Sample"
                  className="h-20 w-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 left-1 bg-slate-900/90 text-white text-[9px] px-1 rounded font-semibold">
                  Sneakers
                </span>
              </button>

              <button
                onClick={() =>
                  handleSimulateVisualSearch(
                    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
                    'Headphones'
                  )
                }
                className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 cursor-pointer text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                  alt="Sample"
                  className="h-20 w-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 left-1 bg-slate-900/90 text-white text-[9px] px-1 rounded font-semibold">
                  Headphones
                </span>
              </button>

              <button
                onClick={() =>
                  handleSimulateVisualSearch(
                    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
                    'Skin Serum'
                  )
                }
                className="group relative rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 cursor-pointer text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"
                  alt="Sample"
                  className="h-20 w-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-1 left-1 bg-slate-900/90 text-white text-[9px] px-1 rounded font-semibold">
                  Serum
                </span>
              </button>
            </div>

            {analyzingImage && (
              <div className="p-4 bg-slate-800/60 rounded-2xl flex items-center justify-center gap-2 text-xs text-blue-400">
                <Sparkles className="animate-spin" size={16} />
                <span>AI Vision Model matching feature vectors...</span>
              </div>
            )}
          </div>
        )}

        {/* Voice Search Mode */}
        {mode === 'voice' && (
          <div className="text-center py-6 space-y-4">
            <button
              onClick={handleVoiceListen}
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white ring-8 ring-rose-500/30 scale-110 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30'
              }`}
            >
              <Mic size={32} />
            </button>
            <p className="text-xs text-slate-300 font-medium">
              {transcript || 'Tap microphone to speak naturally...'}
            </p>
          </div>
        )}

        {/* Match Result Display */}
        {matchResult && (
          <div className="bg-slate-800/90 border border-blue-500/40 p-4 rounded-2xl space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400">AI Match Found ({matchResult.confidence})</span>
              <span className="text-[10px] text-slate-400">{matchResult.category}</span>
            </div>

            <div className="flex items-center gap-3">
              <img src={matchResult.image} alt="Matched" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="text-white font-bold text-sm">{matchResult.matchedTitle}</div>
                <div className="text-emerald-400 font-bold text-xs">{matchResult.price}</div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiVisualVoiceSearchModal;
