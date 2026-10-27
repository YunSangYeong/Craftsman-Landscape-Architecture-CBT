import { describe, it, expect } from 'vitest';
import { BASE_BANK as bank, SUBJECTS, createExam, grade, emptyStore, answerExam, submitExam, restoreStore, fingerprint, validateQuestion, importQuestions, startPractice, checkPractice, nextPractice, parseCsv, remainingSeconds } from '../src/model';
import { PROFILE } from '../src/qualification';
import { readFileSync } from 'node:fs';
describe('조경 문제은행',()=>{
 it('90문항·영역별30·출처와 한계·ID 및 본문 중복 제거',()=>{
  expect(bank).toHaveLength(90); expect(new Set(bank.map(q=>q.id)).size).toBe(90); expect(new Set(bank.map(fingerprint)).size).toBe(90);
  SUBJECTS.forEach(s=>expect(bank.filter(q=>q.subject===s)).toHaveLength(30));
  for(const q of bank){ expect(()=>validateQuestion(q)).not.toThrow(); expect(q.type).toBe('original'); expect(q.year).toBeNull(); expect(q.session).toBeNull(); expect(q.reviewNote).toContain('미완료'); expect(q.rights).toContain('CC BY 4.0'); }
 });
 it('숫자 조건 30개·독립 계산유형 3개이며 정답 보기 값과 단위 검증',()=>{
  const variants=bank.filter(q=>q.calculation);expect(variants).toHaveLength(30);expect(new Set(variants.map(q=>q.family)).size).toBe(3);
  for(const q of variants){ const c=q.calculation!, [a,b,d]=c.values; let result:number;
   if(c.kind==='area') result= a/(1/b); else if(c.kind==='volume') result=(a*b*d)/100; else result=(a*100)/b;
   expect(c.result).toBeCloseTo(result,10); expect(Number.parseFloat(q.choices[q.answer-1])).toBeCloseTo(result,10);
   expect(q.choices[q.answer-1]).toContain(c.unit); expect(new Set(q.choices.map(x=>Number.parseFloat(x))).size).toBe(4);
  }
 });
 it('가져오기 보기 재배치 중복·원자적 실패·대기 상태',()=>{
  const q=bank[0];expect(importQuestions([{...q,id:'DUP',choices:[...q.choices].reverse(),answer:5-q.answer}],bank).duplicates).toBe(1);
  expect(()=>importQuestions([{...q,id:'NEW',question:'다른 문제'},{}],bank)).toThrow('2번');
  expect(importQuestions([{...q,id:'NEW',question:'다른 문제'}],bank).added[0].verificationStatus).toBe('pending');
 });
 it('CSV·JSON 양식은 유효하고 기출 연도 창작을 거부',()=>{
  for(const q of parseCsv(readFileSync('public/templates/questions.csv','utf8')))expect(()=>validateQuestion(q)).not.toThrow();
  expect(()=>validateQuestion({...bank[0],year:2025})).toThrow();
 });
});
describe('학습용 시험 규칙과 기록',()=>{
 it('공식 미확인 상태를 유지하고 60문항·영역20·ID 중복 없음',()=>{
  expect(PROFILE.rulesVerificationStatus).toBe('pending');const e=createExam(bank,'main',1000);expect(e.questions).toHaveLength(60);expect(new Set(e.questions.map(q=>q.id)).size).toBe(60);
  SUBJECTS.forEach(s=>expect(e.questions.filter(q=>q.subject===s)).toHaveLength(20));expect(e.deadline).toBe(3601000);
 });
 for(const n of [35,36]) it(`${n}개 정답 합격 경계`,()=>{
  const e=createExam(bank,'main');e.questions.slice(0,n).forEach(q=>e.answers[q.id]=q.answer);expect(grade(e).passed).toBe(n===36);expect(grade(e).unanswered).toBe(60-n);
 });
 it('만료 답안 거부·자동 제출·중복 제출 방지·기록 복원',()=>{
  const e=createExam(bank,'main',1000), s={...emptyStore(),exam:e};const done=answerExam(s,e.questions[0].id,1,e.deadline);
  expect(done.exam).toBeNull();expect(done.results[0].answers).toEqual({});expect(done.results[0].reason).toBe('timeout');expect(submitExam(done)).toBe(done);
  expect(restoreStore(JSON.stringify(done))).toEqual(done);expect(()=>restoreStore('{broken')).toThrow();expect(remainingSeconds(e.deadline,e.deadline+1)).toBe(0);
 });
 it('랜덤 중복 채점 방지·순회 중복 없음·정답 복습으로 오답 해제',()=>{
  const p=startPractice(bank,'main'), q=bank.find(q=>q.id===p.currentId)!;
  let s={...emptyStore(),practice:{...p,selected:q.answer},wrongIds:[q.id]};const done=checkPractice(s,bank);expect(done.wrongIds).not.toContain(q.id);expect(checkPractice(done,bank)).toBe(done);
  let next=done.practice!; const seen=new Set([next.currentId]);for(let i=0;i<89;i++){next=nextPractice(next,bank);expect(seen.has(next.currentId)).toBe(false);seen.add(next.currentId);}
 });
});
