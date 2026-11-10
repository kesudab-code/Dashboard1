import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, surveyUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && surveyUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        surveyUrl,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        },
        err => {
          if (err) console.error('QR Code render error:', err);
        }
      );
    }
  }, [isOpen, surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
          <QrIcon className="w-6 h-6" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          สแกนเพื่อทำแบบประเมิน
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          เปิดกล้องมือถือแล้วสแกน QR Code นี้เพื่อเข้าสู่หน้าแบบสอบถาม
        </p>

        {/* Canvas Display */}
        <div className="bg-white p-4 rounded-2xl inline-block mx-auto my-5 shadow-inner">
          <canvas ref={canvasRef} className="block mx-auto" />
        </div>

        {/* Link Box */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-left">
          <input
            type="text"
            readOnly
            value={surveyUrl}
            className="bg-transparent flex-1 text-slate-300 font-mono focus:outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-4 text-xs text-slate-400">
          <a
            href={surveyUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-medium"
          >
            <span>เปิดหน้าตอบในแท็บใหม่</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
