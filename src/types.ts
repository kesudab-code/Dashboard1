export interface SurveyScores {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
}

export interface SurveyResponse {
  id: string;
  timestamp: number;
  scores: SurveyScores;
  feedback?: string;
  respondentId?: string;
}

export interface QuestionDef {
  id: keyof SurveyScores;
  title: string;
  shortLabel: string;
  category: string;
  description: string;
}

export interface StatisticalInterpretation {
  range: string;
  label: string;
  level: number;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface DashboardStats {
  totalCount: number;
  overallMean: number;
  interpretation: StatisticalInterpretation;
  questionAverages: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  starDistribution: {
    1: { count: number; percentage: number };
    2: { count: number; percentage: number };
    3: { count: number; percentage: number };
    4: { count: number; percentage: number };
    5: { count: number; percentage: number };
  };
  totalStarVotes: number;
}
