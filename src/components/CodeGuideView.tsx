import React, { useState } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  Sparkles,
  Server,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

export const CodeGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guide' | 'survey' | 'dashboard'>('guide');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const downloadFile = (filename: string, path: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const sampleRules = `{
  "rules": {
    "satisfaction_responses": {
      ".read": true,
      ".write": true
    }
  }
}`;

  const sampleConfig = `const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxx...",
  authDomain: "training-survey-xxxx.firebaseapp.com",
  databaseURL: "https://training-survey-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "training-survey-xxxx",
  storageBucket: "training-survey-xxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};`;

  return (
    <div className="min-h-full bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FileCode className="w-6 h-6 text-blue-400" />
              <span>โค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              ไฟล์ HTML สแตนด์อโลน 2 ไฟล์พร้อมใช้งาน ไม่ต้องติดตั้ง Node.js เพียงดับเบิลคลิกหรืออัปโหลดขึ้นโฮสติ้งฟรี
            </p>
          </div>

          {/* Quick Direct Download Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFile('survey.html', '/standalone/survey.html')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>โหลด survey.html</span>
            </button>
            <button
              onClick={() => downloadFile('dashboard.html', '/standalone/dashboard.html')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>โหลด dashboard.html</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. ขั้นตอนติดตั้ง Firebase & Deploy</span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'survey'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>2. โค้ด survey.html (หน้าตอบมือถือ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>3. โค้ด dashboard.html (หน้าจอโปรเจกเตอร์)</span>
          </button>
        </div>

        {/* Content by Tab */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  สร้าง Firebase Project (ฟรี ไม่มีค่าใช้จ่าย)
                </h3>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 space-y-2 pl-11">
                <p>
                  1. เข้าสู่เว็บไซต์{' '}
                  <a
                    href="https://console.firebase.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Firebase Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>{' '}
                  แล้วล็อกอินด้วย Google Account
                </p>
                <p>2. กดปุ่ม <strong>"Add project"</strong> หรือ <strong>"สร้างโปรเจกต์"</strong></p>
                <p>3. ตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">training-survey</code> แล้วกด Continue</p>
                <p>4. กด Continue และ Create Project (ใช้เวลาประมาณ 30 วินาที)</p>
              </div>
            </div>

            {/* Step 2 & 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  เปิดใช้งาน Realtime Database & ตั้งค่า Security Rules
                </h3>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 space-y-3 pl-11">
                <p>
                  1. ในเมนูด้านซ้ายไปที่ <strong>Build</strong> &gt; <strong>Realtime Database</strong>
                </p>
                <p>
                  2. กดปุ่ม <strong>"Create Database"</strong> และเลือก Location เป็น{' '}
                  <span className="font-semibold text-emerald-400">Singapore (asia-southeast1)</span> หรือ United States
                </p>
                <p>
                  3. ไปที่แท็บ <strong>"Rules"</strong> ด้านบน และวางโค้ดกฎความปลอดภัยดังนี้ เพื่อให้ผู้ตอบเขียนและแดชบอร์ดอ่านได้:
                </p>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs relative">
                  <pre className="text-blue-300">{sampleRules}</pre>
                  <button
                    onClick={() => copyToClipboard(sampleRules, setCopiedRules)}
                    className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-all"
                  >
                    {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRules ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>
                <p>4. กดปุ่ม <strong>"Publish"</strong> เพื่อบันทึกกฎ</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  3
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  คัดลอก firebaseConfig มาใส่ในไฟล์
                </h3>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 space-y-3 pl-11">
                <p>
                  1. ใน Firebase Console กดรูป <strong>ฟันเฟือง (Project Settings)</strong> ที่มุมบนซ้าย
                </p>
                <p>
                  2. เลื่อนลงมาที่หัวข้อ <strong>"Your apps"</strong> แล้วกดไอคอนเว็บ <strong>&lt;/&gt;</strong>
                </p>
                <p>
                  3. คัดลอกบล็อก <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">firebaseConfig</code> ของคุณ:
                </p>

                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs relative">
                  <pre className="text-emerald-300">{sampleConfig}</pre>
                  <button
                    onClick={() => copyToClipboard(sampleConfig, setCopiedConfig)}
                    className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-all"
                  >
                    {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedConfig ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                  </button>
                </div>

                <p>
                  4. เปิดไฟล์ <code className="text-white font-semibold">survey.html</code> และ <code className="text-white font-semibold">dashboard.html</code> แล้ววางแทนที่บรรทัด <code className="text-blue-300">const firebaseConfig = &#123; ... &#125;;</code>
                </p>
              </div>
            </div>

            {/* Step 5: Free Deploy */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  4
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  วิธีนำขึ้นเว็บให้ทุกคนสแกนตอบได้ (Free Hosting)
                </h3>
              </div>
              <div className="text-xs sm:text-sm text-slate-300 space-y-3 pl-11">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      <span>วิธีที่ 1: GitHub Pages (แนะนำ ฟรี 100%)</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      1. สร้าง Repository บน GitHub<br />
                      2. อัปโหลด survey.html และ dashboard.html<br />
                      3. ไปที่ Settings &gt; Pages &gt; เปิด Branch main<br />
                      4. ได้รับ URL เว็บทันที นำไปทำ QR Code ฉายได้เลย!
                    </p>
                  </div>

                  <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-4 space-y-2">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-blue-400" />
                      <span>วิธีที่ 2: Netlify Drop / Vercel (ลากวาง 10 วินาที)</span>
                    </div>
                    <p className="text-slate-400 text-xs">
                      1. รวมไฟล์ทั้ง 2 ไว้ในโฟลเดอร์เดียวกัน<br />
                      2. เปิดเว็บ <code className="text-blue-300">app.netlify.com/drop</code><br />
                      3. ลากโฟลเดอร์ไปวาง ได้รับ URL ทันทีโดยไม่ต้องเขียนคำสั่ง
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: survey.html */}
        {activeTab === 'survey' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">ไฟล์ survey.html (หน้าตอบแบบสอบถามบนมือถือ)</h3>
                <p className="text-xs text-slate-400">ขนาดกระทัดรัด ออกแบบ Mobile-first ปุ่มใหญ่ มีระบบป้องกันตอบซ้ำ</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadFile('survey.html', '/standalone/survey.html')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-300 max-h-96 overflow-y-auto">
              <p className="text-slate-500 mb-2">// ไฟล์ /public/standalone/survey.html</p>
              <p className="text-emerald-400 mb-2">&lt;!-- รองรับทั้งเชื่อมต่อ Firebase Realtime Database และ LocalStorage fallback --&gt;</p>
              <pre className="text-blue-300 whitespace-pre leading-relaxed">
{`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
... (ดูโค้ดฉบับเต็มได้โดยกดปุ่มดาวน์โหลดไฟล์ด้านบน)`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: dashboard.html */}
        {activeTab === 'dashboard' && (
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">ไฟล์ dashboard.html (หน้าแดชบอร์ดสรุปผลแบบเรียลไทม์)</h3>
                <p className="text-xs text-slate-400">สรุปคะแนนเฉลี่ย, กราฟวงกลมสัดส่วนดาว (Donut Chart), กราฟแท่งรายข้อ, QR Code ฉายขึ้นจอ, และดาวน์โหลด CSV</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => downloadFile('dashboard.html', '/standalone/dashboard.html')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลดไฟล์</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-300 max-h-96 overflow-y-auto">
              <p className="text-slate-500 mb-2">// ไฟล์ /public/standalone/dashboard.html</p>
              <p className="text-emerald-400 mb-2">&lt;!-- ใช้ Firebase Modular onValue() อัปเดตทันทีเมื่อมีคนส่งข้อมูล --&gt;</p>
              <pre className="text-blue-300 whitespace-pre leading-relaxed">
{`<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แดชบอร์ดสรุปผลความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
... (ดูโค้ดฉบับเต็มได้โดยกดปุ่มดาวน์โหลดไฟล์ด้านบน)`}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
