import { QuestionDef, StatisticalInterpretation, SurveyScores } from './types';

export const SURVEY_QUESTIONS: QuestionDef[] = [
  {
    id: 'q1',
    title: '1. ความรู้ ความเชี่ยวชาญ และความสามารถในการถ่ายทอดของวิทยากร',
    shortLabel: 'วิทยากรและการถ่ายทอด',
    category: 'วิทยากร',
    description: 'ความชัดเจนในการอธิบาย การตอบข้อซักถาม และการสร้างบรรยากาศการเรียนรู้'
  },
  {
    id: 'q2',
    title: '2. คุณภาพ ความชัดเจน และความครอบคลุมของเนื้อหาหลักสูตร',
    shortLabel: 'คุณภาพเนื้อหาหลักสูตร',
    category: 'เนื้อหา',
    description: 'เนื้อหามีความน่าสนใจ ทันสมัย เรียงลำดับเข้าใจง่าย และตรงตามวัตถุประสงค์'
  },
  {
    id: 'q3',
    title: '3. ความสามารถในการนำความรู้และทักษะไปประยุกต์ใช้ในการทำงานจริง',
    shortLabel: 'การนำไปประยุกต์ใช้',
    category: 'ประโยชน์',
    description: 'สามารถนำแนวคิด เครื่องมือ และเทคนิคไปปฏิบัติงานได้จริงและเกิดประโยชน์'
  },
  {
    id: 'q4',
    title: '4. การจัดเตรียมสถานที่ บรรยากาศ และสิ่งอำนวยความสะดวก',
    shortLabel: 'สถานที่และบรรยากาศ',
    category: 'การจัดการ',
    description: 'ความเหมาะสมของห้องอบรม โสตทัศนูปกรณ์ เอกสาร และการประสานงาน'
  },
  {
    id: 'q5',
    title: '5. ความพึงพอใจในภาพรวมของการจัดอบรมในครั้งนี้',
    shortLabel: 'ความพึงพอใจในภาพรวม',
    category: 'ภาพรวม',
    description: 'ความประทับใจโดยรวม และความคุ้มค่าของเวลาที่เข้าร่วมอบรม'
  }
];

export const RATING_SCALE = [
  { score: 1, label: 'น้อยที่สุด', short: 'น้อยสุด', color: 'rose' },
  { score: 2, label: 'น้อย', short: 'น้อย', color: 'orange' },
  { score: 3, label: 'ปานกลาง', short: 'ปานกลาง', color: 'amber' },
  { score: 4, label: 'มาก', short: 'มาก', color: 'sky' },
  { score: 5, label: 'มากที่สุด', short: 'มากสุด', color: 'emerald' },
];

/**
 * เกณฑ์การแปลความหมายของค่าเฉลี่ยตามหลักสถิติ (Best practice 5 ระดับ)
 * 4.51 - 5.00 = มากที่สุด (Highest)
 * 3.51 - 4.50 = มาก (High)
 * 2.51 - 3.50 = ปานกลาง (Moderate)
 * 1.51 - 2.50 = น้อย (Low)
 * 1.00 - 1.50 = น้อยที่สุด (Lowest)
 */
export function getInterpretation(mean: number): StatisticalInterpretation {
  if (mean >= 4.51) {
    return {
      range: '4.51 - 5.00',
      label: 'ความพึงพอใจระดับมากที่สุด',
      level: 5,
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-950/80',
      borderClass: 'border-emerald-700/80'
    };
  } else if (mean >= 3.51) {
    return {
      range: '3.51 - 4.50',
      label: 'ความพึงพอใจระดับมาก',
      level: 4,
      colorClass: 'text-sky-400',
      bgClass: 'bg-sky-950/80',
      borderClass: 'border-sky-700/80'
    };
  } else if (mean >= 2.51) {
    return {
      range: '2.51 - 3.50',
      label: 'ความพึงพอใจระดับปานกลาง',
      level: 3,
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-950/80',
      borderClass: 'border-amber-700/80'
    };
  } else if (mean >= 1.51) {
    return {
      range: '1.51 - 2.50',
      label: 'ความพึงพอใจระดับน้อย',
      level: 2,
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-950/80',
      borderClass: 'border-orange-700/80'
    };
  } else {
    return {
      range: '1.00 - 1.50',
      label: 'ความพึงพอใจระดับน้อยที่สุด',
      level: 1,
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-950/80',
      borderClass: 'border-rose-700/80'
    };
  }
}

export const INITIAL_DEMO_RESPONSES = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 1000 * 60 * 25,
    scores: { q1: 5, q2: 5, q3: 5, q4: 4, q5: 5 },
    feedback: 'วิทยากรอธิบายเนื้อหาได้เข้าใจง่าย มีกรณีศึกษาจริงให้ลงมือปฏิบัติ ประทับใจมากครับ',
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 1000 * 60 * 18,
    scores: { q1: 5, q2: 4, q3: 5, q4: 5, q5: 5 },
    feedback: 'หลักสูตรนี้ตอบโจทย์การทำงานจริงมาก นำเครื่องมือไปปรับใช้กับโปรเจกต์ของบริษัทได้ทันที',
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 1000 * 60 * 10,
    scores: { q1: 4, q2: 5, q3: 4, q4: 4, q5: 4 },
    feedback: 'เอกสารและสไลด์สรุปเนื้อหาได้ดี อยากให้มีคอร์สระดับ Advanced ต่อไปอีกค่ะ',
  },
  {
    id: 'demo-4',
    timestamp: Date.now() - 1000 * 60 * 4,
    scores: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    feedback: 'การจัดเตรียมสถานที่และอาหารว่างดีเยี่ยม บรรยากาศเป็นกันเองและเอื้อต่อการเรียนรู้',
  }
];
