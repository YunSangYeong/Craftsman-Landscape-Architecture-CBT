// Official rules have NOT been verified in this environment.
export const PROFILE = {
  name: '조경기능사',
  rulesVerificationStatus: 'pending',
  subjects: ['조경일반', '조경재료', '조경시공 및 관리'] as const,
  questionCount: 60,
  questionsPerSubject: 20,
  durationMinutes: 60,
  choiceCount: 4,
  passScore: 60,
  hasSubjectCutoff: false,
  selectionPolicy: '학습용 영역별 균등 추출; 공식 과목·분포 미확인',
  source: 'https://www.q-net.or.kr/',
} as const;
