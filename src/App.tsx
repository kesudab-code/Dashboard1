import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { DualView } from './components/DualView';
import { CodeGuideView } from './components/CodeGuideView';
import { QrModal } from './components/QrModal';
import { SurveyResponse, SurveyScores, DashboardStats } from './types';
import { INITIAL_DEMO_RESPONSES, getInterpretation } from './constants';

const LOCAL_STORAGE_RESPONSES = 'training_survey_all_responses';

export default function App() {
  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RESPONSES);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_RESPONSES;
    } catch (e) {
      return INITIAL_DEMO_RESPONSES;
    }
  });

  // URL query parameter routing (?view=survey or ?view=dashboard)
  const [currentView, setCurrentView] = useState<'survey' | 'dashboard' | 'dual' | 'guide'>(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'survey' || view === 'dashboard' || view === 'dual' || view === 'guide') {
      return view;
    }
    // Default to dual on wide screens, dashboard on medium, survey on phone
    if (window.innerWidth < 768) return 'survey';
    return 'dashboard';
  });

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isProjectorMode, setIsProjectorMode] = useState(false);
  const [isConnectedLive, setIsConnectedLive] = useState(true);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RESPONSES, JSON.stringify(responses));
    } catch (e) {
      console.error(e);
    }
  }, [responses]);

  // Connect to backend SSE Stream for real cross-device sync
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let bc: BroadcastChannel | null = null;

    try {
      eventSource = new EventSource('/api/stream');

      eventSource.addEventListener('init', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (Array.isArray(data) && data.length > 0) {
            setResponses(data);
          }
          setIsConnectedLive(true);
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.addEventListener('new_response', (e: MessageEvent) => {
        try {
          const newResp = JSON.parse(e.data);
          setResponses(prev => {
            const exists = prev.some(r => r.id === newResp.id);
            return exists ? prev : [newResp, ...prev];
          });
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.addEventListener('refresh', (e: MessageEvent) => {
        try {
          const list = JSON.parse(e.data);
          if (Array.isArray(list)) setResponses(list);
        } catch (err) {
          console.error(err);
        }
      });

      eventSource.addEventListener('reset', () => {
        setResponses([]);
      });

      eventSource.onerror = () => {
        setIsConnectedLive(false);
      };
    } catch (e) {
      setIsConnectedLive(false);
    }

    // BroadcastChannel sync across tabs in same browser
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      bc = new BroadcastChannel('training_survey_sync');
      bc.onmessage = event => {
        if (event.data?.type === 'SYNC_RESPONSES') {
          setResponses(event.data.data);
        }
      };
    }

    return () => {
      eventSource?.close();
      bc?.close();
    };
  }, []);

  // Compute live statistics
  const stats: DashboardStats = useMemo(() => {
    const totalCount = responses.length;

    if (totalCount === 0) {
      return {
        totalCount: 0,
        overallMean: 0,
        interpretation: getInterpretation(0),
        questionAverages: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 },
        starDistribution: {
          1: { count: 0, percentage: 0 },
          2: { count: 0, percentage: 0 },
          3: { count: 0, percentage: 0 },
          4: { count: 0, percentage: 0 },
          5: { count: 0, percentage: 0 },
        },
        totalStarVotes: 0,
      };
    }

    const sums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
    const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalStarVotes = 0;

    responses.forEach(r => {
      if (r.scores) {
        sums.q1 += Number(r.scores.q1 || 0);
        sums.q2 += Number(r.scores.q2 || 0);
        sums.q3 += Number(r.scores.q3 || 0);
        sums.q4 += Number(r.scores.q4 || 0);
        sums.q5 += Number(r.scores.q5 || 0);

        [r.scores.q1, r.scores.q2, r.scores.q3, r.scores.q4, r.scores.q5].forEach(s => {
          const val = Number(s);
          if (val >= 1 && val <= 5) {
            starCounts[val as 1 | 2 | 3 | 4 | 5]++;
            totalStarVotes++;
          }
        });
      }
    });

    const questionAverages = {
      q1: sums.q1 / totalCount,
      q2: sums.q2 / totalCount,
      q3: sums.q3 / totalCount,
      q4: sums.q4 / totalCount,
      q5: sums.q5 / totalCount,
    };

    const overallMean =
      (questionAverages.q1 +
        questionAverages.q2 +
        questionAverages.q3 +
        questionAverages.q4 +
        questionAverages.q5) /
      5;

    const interpretation = getInterpretation(overallMean);

    const starDistribution = {
      1: {
        count: starCounts[1],
        percentage: totalStarVotes > 0 ? Math.round((starCounts[1] / totalStarVotes) * 100) : 0,
      },
      2: {
        count: starCounts[2],
        percentage: totalStarVotes > 0 ? Math.round((starCounts[2] / totalStarVotes) * 100) : 0,
      },
      3: {
        count: starCounts[3],
        percentage: totalStarVotes > 0 ? Math.round((starCounts[3] / totalStarVotes) * 100) : 0,
      },
      4: {
        count: starCounts[4],
        percentage: totalStarVotes > 0 ? Math.round((starCounts[4] / totalStarVotes) * 100) : 0,
      },
      5: {
        count: starCounts[5],
        percentage: totalStarVotes > 0 ? Math.round((starCounts[5] / totalStarVotes) * 100) : 0,
      },
    };

    return {
      totalCount,
      overallMean,
      interpretation,
      questionAverages,
      starDistribution,
      totalStarVotes,
    };
  }, [responses]);

  // Submit survey response
  const handleSubmitResponse = useCallback(
    async (scores: SurveyScores, feedback: string): Promise<boolean> => {
      const newResponse: SurveyResponse = {
        id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
        scores,
        feedback: feedback.trim(),
      };

      // 1. Send to server API
      try {
        await fetch('/api/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scores, feedback }),
        });
      } catch (e) {
        // Fallback to local
      }

      // 2. Update local state
      setResponses(prev => {
        const next = [newResponse, ...prev];
        // Broadcast
        if (window.BroadcastChannel) {
          const bc = new BroadcastChannel('training_survey_sync');
          bc.postMessage({ type: 'SYNC_RESPONSES', data: next });
        }
        return next;
      });

      return true;
    },
    []
  );

  // Download CSV with UTF-8 BOM
  const handleDownloadCsv = useCallback(() => {
    if (responses.length === 0) {
      alert('ยังไม่มีข้อมูลการประเมินสำหรับส่งออกเป็น CSV');
      return;
    }

    const headers = [
      'ลำดับ',
      'วันเวลาที่ประเมิน',
      'ข้อ 1 ด้านวิทยากร (1-5)',
      'ข้อ 2 ด้านเนื้อหาหลักสูตร (1-5)',
      'ข้อ 3 ด้านการนำไปใช้ประโยชน์ (1-5)',
      'ข้อ 4 ด้านสถานที่และบรรยากาศ (1-5)',
      'ข้อ 5 ความพึงพอใจภาพรวม (1-5)',
      'คะแนนเฉลี่ย',
      'ระดับความพึงพอใจ',
      'ข้อเสนอแนะเพิ่มเติม',
    ];

    const rows = responses.map((r, idx) => {
      const timeStr = new Date(r.timestamp).toLocaleString('th-TH');
      const s = r.scores;
      const avg = ((s.q1 + s.q2 + s.q3 + s.q4 + s.q5) / 5).toFixed(2);
      const interp = getInterpretation(Number(avg)).label;
      const cleanFeedback = (r.feedback || '').replace(/"/g, '""');

      return [
        idx + 1,
        `"${timeStr}"`,
        s.q1,
        s.q2,
        s.q3,
        s.q4,
        s.q5,
        avg,
        `"${interp}"`,
        `"${cleanFeedback}"`,
      ].join(',');
    });

    // UTF-8 BOM '\uFEFF' ensures Excel opens Thai text correctly
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `รายงานผลความพึงพอใจการอบรม_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [responses]);

  // Seed 5 demo responses
  const handleSeedData = useCallback(async () => {
    try {
      await fetch('/api/responses/seed', { method: 'POST' });
    } catch (e) {
      // Local fallback
    }

    const newSamples: SurveyResponse[] = [
      {
        id: 'seed-' + Date.now() + '-1',
        timestamp: Date.now() - 40000,
        scores: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
        feedback: 'วิทยากรอธิบายดีมาก ตัวอย่างตรงประเด็น ได้ฝึกปฏิบัติจริงเข้าใจลึกซึ้ง',
      },
      {
        id: 'seed-' + Date.now() + '-2',
        timestamp: Date.now() - 25000,
        scores: { q1: 5, q2: 4, q3: 5, q4: 5, q5: 5 },
        feedback: 'หัวข้อการอบรมตอบโจทย์การทำงานในยุคดิจิทัล แนะนำให้จัดเป็นประจำครับ',
      },
      {
        id: 'seed-' + Date.now() + '-3',
        timestamp: Date.now() - 10000,
        scores: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
        feedback: 'สไลด์สวยงาม เอกสารอ่านเข้าใจง่าย อาหารว่างอร่อยและมีประโยชน์',
      },
    ];

    setResponses(prev => {
      const next = [...newSamples, ...prev];
      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('training_survey_sync');
        bc.postMessage({ type: 'SYNC_RESPONSES', data: next });
      }
      return next;
    });
  }, []);

  // Clear data
  const handleClearData = useCallback(async () => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลคำตอบทั้งหมด?')) {
      try {
        await fetch('/api/responses', { method: 'DELETE' });
      } catch (e) {}

      setResponses([]);
      localStorage.removeItem(LOCAL_STORAGE_RESPONSES);
      if (window.BroadcastChannel) {
        const bc = new BroadcastChannel('training_survey_sync');
        bc.postMessage({ type: 'SYNC_RESPONSES', data: [] });
      }
    }
  }, []);

  // Toggle fullscreen for projector
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsProjectorMode(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsProjectorMode(false);
    }
  }, []);

  // Calculate live survey URL for QR Code
  const surveyUrl = useMemo(() => {
    const origin = window.location.origin;
    return `${origin}/?view=survey`;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Navigation (Hidden if in strict projector mode) */}
      {!isProjectorMode && (
        <Header
          currentView={currentView}
          onViewChange={setCurrentView}
          onOpenQr={() => setIsQrModalOpen(true)}
          onToggleFullscreen={handleToggleFullscreen}
          totalResponses={stats.totalCount}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'survey' && (
          <div className="flex-1 bg-slate-50 text-slate-900 py-4 sm:py-8">
            <SurveyView onSubmitResponse={handleSubmitResponse} />
          </div>
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            responses={responses}
            stats={stats}
            onOpenQr={() => setIsQrModalOpen(true)}
            onDownloadCsv={handleDownloadCsv}
            onSeedData={handleSeedData}
            onClearData={handleClearData}
            isProjectorMode={isProjectorMode}
            onToggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
            isConnectedLive={isConnectedLive}
          />
        )}

        {currentView === 'dual' && (
          <DualView
            responses={responses}
            stats={stats}
            onSubmitResponse={handleSubmitResponse}
            onOpenQr={() => setIsQrModalOpen(true)}
            onDownloadCsv={handleDownloadCsv}
            onSeedData={handleSeedData}
            onClearData={handleClearData}
            isConnectedLive={isConnectedLive}
          />
        )}

        {currentView === 'guide' && <CodeGuideView />}
      </main>

      {/* Stage QR Code Modal */}
      <QrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        surveyUrl={surveyUrl}
      />
    </div>
  );
}
