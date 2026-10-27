import { describe, it, expect } from 'vitest';
import { BASE_BANK as bank, SUBJECTS, createExam, grade, emptyStore, answerExam, submitExam, restoreStore, fingerprint, validateQuestion, importQuestions, startPractice, checkPractice, nextPractice, parseCsv, remainingSeconds } from '../src/model';
import { PROFILE } from '../src/qualification';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
describe('조경 문제은행',()=>{
 it('기존90개 ID·본문·보기·정답·해설·메타데이터 보존',()=>{
  expect(createHash('sha256').update(JSON.stringify(bank.slice(0,90))).digest('hex')).toBe('e92e68da233f5d25c566339543dfac2f3dbbbbbb4fd28a1ad4ea79d53fdf95de');
 });
 it('1000문항·영역별334/333/333·출처와 한계·ID 및 본문 중복 제거',()=>{
  expect(bank).toHaveLength(1000); expect(new Set(bank.map(q=>q.id)).size).toBe(1000); expect(new Set(bank.map(fingerprint)).size).toBe(1000);
  SUBJECTS.forEach((s,i)=>expect(bank.filter(q=>q.subject===s)).toHaveLength(i===0?334:333));
  for(const q of bank){ expect(()=>validateQuestion(q)).not.toThrow(); expect(q.type).toBe('original'); expect(q.year).toBeNull(); expect(q.session).toBeNull(); expect(q.reviewNote).toContain('미완료'); expect(q.rights).toContain('CC BY 4.0'); }
 });
 it('계산형840개·30family·개념형160개',()=>{
  const variants=bank.filter(q=>q.calculation);expect(variants).toHaveLength(840);expect(new Set(variants.map(q=>q.family)).size).toBe(30);
  expect(bank.filter(q=>!q.calculation)).toHaveLength(160);
  for(const family of new Set(variants.map(q=>q.family))){
   const items=variants.filter(q=>q.family===family);expect(items).toHaveLength(['rectangle-area','material-volume','slope-percent'].includes(family!)?10:30);
   expect(new Set(items.map(q=>JSON.stringify(q.calculation!.values))).size).toBe(items.length);
  }
 });
 it.each(bank.filter(q=>q.calculation))('독립 수치·단위·정답 검증 $id ($family)',q=>{
  const c=q.calculation!,[a,b,d]=c.values;
  // Independent TS formulas; generation uses Python Fraction and distinct expressions.
  const formulas:Record<string,()=>number>={
   area:()=>a/(1/b), volume:()=>a*b*d/100,slope:()=>a*100/b,
   'rectangle-perimeter':()=>a+a+b+b,
   'triangle-area':()=>a*(b/2),
   'trapezoid-area':()=>a*d/2+b*d/2,
   'circle-area':()=>314*a*a/100,
   'circle-circumference':()=>314*a/50,
   'scale-real-length':()=>a*b/100,
   'scale-drawing-length':()=>a/(b/100),
   'grade-rise':()=>a*b/100,
   'contour-elevation':()=>a+b+b+b+b,
   'plants-density':()=>a*b,
   'line-endpoint-count':()=>1+a/b,
   'seed-mass':()=>a*b/1000,
   'fertilizer-nitrogen':()=>a*b/100,
   'dilution-stock':()=>a/(b/1000),
   'water-depth-volume':()=>a*(b/1000)*1000,
   'paving-unit-count':()=>a*b,
   'soil-mix-component':()=>a*b/100,
   'material-allowance':()=>a+a*b/100,
   'irrigation-time':()=>a/b/60,
   'labor-person-days':()=>a/b,
   'unit-cost':()=>a*b,
   'soil-bulking':()=>a*b/100,
   'earthwork-surplus':()=>a-b,
   'tree-survival-rate':()=>100*a/b,
   'slope-length':()=>Math.hypot(a,b),
   'average-end-area':()=>a*d/2+b*d/2,
   'daily-productivity':()=>a/b,
  };
  expect(formulas[c.kind],c.kind).toBeDefined();const result=formulas[c.kind]();
  const expectedUnits:Record<string,string>={
   area:'m²',volume:'m³',slope:'%', 'rectangle-perimeter':'m','triangle-area':'m²','trapezoid-area':'m²','circle-area':'m²','circle-circumference':'m','scale-real-length':'m','scale-drawing-length':'cm','grade-rise':'m','contour-elevation':'m','plants-density':'주','line-endpoint-count':'주','seed-mass':'kg','fertilizer-nitrogen':'kg','dilution-stock':'mL','water-depth-volume':'L','paving-unit-count':'장','soil-mix-component':'m³','material-allowance':'m³','irrigation-time':'분','labor-person-days':'인·일','unit-cost':'원','soil-bulking':'m³','earthwork-surplus':'m³','tree-survival-rate':'%','slope-length':'m','average-end-area':'m³','daily-productivity':'m²/일'
  };expect(c.unit).toBe(expectedUnits[c.kind]);
  expect(c.result).toBeCloseTo(result,8);expect(Number.parseFloat(q.choices[q.answer-1])).toBeCloseTo(result,8);
  expect(q.choices.every(x=>x.endsWith(c.unit))).toBe(true);
  expect(new Set(q.choices.map(x=>Number.parseFloat(x))).size).toBe(4);
  expect(q.explanation).toContain(String(c.values[0]));
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
  const families=e.questions.filter(q=>q.family).map(q=>q.family);expect(new Set(families).size).toBe(families.length);
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
  let next=done.practice!; const seen=new Set([next.currentId]);for(let i=0;i<bank.length-1;i++){next=nextPractice(next,bank);expect(seen.has(next.currentId)).toBe(false);seen.add(next.currentId);}
 });
});
