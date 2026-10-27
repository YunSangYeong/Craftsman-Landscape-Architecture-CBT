"""27 original calculation families, 30 deterministic conditions per family.
All quantities are educational assumptions, never statutory design criteria.
"""
from fractions import Fraction as F

def num(value):
    value=F(value)
    # Conditions are chosen so the exact result fits at most two decimals.
    assert (value*100).denominator == 1, value
    return f'{float(value):.2f}'.rstrip('0').rstrip('.')

def expand(add):
    subjects=['조경일반','조경재료','조경시공 및 관리']
    for k in range(27):
        for i in range(30):
            n=i+1
            if k==0:
                a,b=10+n,5+n; v=[a,b];r=2*(a+b);unit='m';name='rectangle-perimeter';topic='둘레'
                stem=f'직사각형 정원 경계의 가로가 {a}m, 세로가 {b}m이다. 출입구를 빼지 않은 전체 둘레는?'
                exp=f'직사각형 둘레 = 2 × (가로 + 세로) = 2 × ({a} + {b}) = {r}m이다. 이 문제는 면적이 아니라 경계 전체의 길이를 묻는다.'
            elif k==1:
                a,b=10+n,6;v=[a,b];r=F(a*b,2);unit='m²';name='triangle-area';topic='삼각형 면적'
                stem=f'삼각형 화단의 밑변이 {a}m, 그 밑변에 수직인 높이가 {b}m이다. 면적은?'
                exp=f'삼각형 면적 = 밑변 × 수직 높이 ÷ 2 = {a} × {b} ÷ 2 = {num(r)}m²이다. 빗변 길이를 높이로 쓰지 않는다.'
            elif k==2:
                a,b,h=5+n,9+n,4;v=[a,b,h];r=F((a+b)*h,2);unit='m²';name='trapezoid-area';topic='사다리꼴 면적'
                stem=f'사다리꼴 화단의 평행한 두 변이 {a}m와 {b}m이고 두 변 사이의 수직 거리가 {h}m이다. 면적은?'
                exp=f'사다리꼴 면적 = (평행한 두 변의 합) × 높이 ÷ 2 = ({a} + {b}) × {h} ÷ 2 = {num(r)}m²이다. 높이는 두 평행선 사이의 수직 거리다.'
            elif k==3:
                a=2+n;v=[a];r=F(314*a*a,100);unit='m²';name='circle-area';topic='원형 면적'
                stem=f'반지름 {a}m인 원형 광장의 면적은? 원주율은 이 문제에서 3.14로 계산한다.'
                exp=f'원 면적 = 원주율 × 반지름² = 3.14 × {a}² = {num(r)}m²이다. 지름이 아닌 반지름을 제곱하며 문제에서 지정한 원주율을 사용한다.'
            elif k==4:
                a=3+n;v=[a];r=F(628*a,100);unit='m';name='circle-circumference';topic='원형 경계 길이'
                stem=f'반지름 {a}m의 원형 연못 둘레에 경계를 설치한다. 전체 길이는? 원주율은 3.14이고 이음·손실은 없다.'
                exp=f'원 둘레 = 2 × 원주율 × 반지름 = 2 × 3.14 × {a} = {num(r)}m이다. 원의 면적을 구하는 식과 구분한다.'
            elif k==5:
                a,b=n+2,100;v=[a,b];r=F(a*b,100);unit='m';name='scale-real-length';topic='축척의 실제 길이'
                stem=f'축척 1:{b} 도면에서 산책로 길이가 {a}cm이다. 실제 길이는 몇 m인가?'
                exp=f'실제 길이 = 도면 길이 × 축척 분모 = {a} × {b} = {a*b}cm이다. 100cm가 1m이므로 {a*b} ÷ 100 = {num(r)}m이다.'
            elif k==6:
                a,b=10+n,200;v=[a,b];r=F(a*100,b);unit='cm';name='scale-drawing-length';topic='축척의 도면 길이'
                stem=f'실제 길이 {a}m를 축척 1:{b} 도면에 나타내려 한다. 도면상의 길이는 몇 cm인가?'
                exp=f'실제 {a}m = {a*100}cm이다. 도면 길이 = 실제 길이 ÷ 축척 분모 = {a*100} ÷ {b} = {num(r)}cm이다. 같은 단위로 바꾼 뒤 나눈다.'
            elif k==7:
                a,b=20+n,5;v=[a,b];r=F(a*b,100);unit='m';name='grade-rise';topic='경사율의 높이 차'
                stem=f'수평 거리 {a}m인 경사로의 경사율을 {b}%로 가정한다. 양 끝의 높이 차는? 이 수치는 학습 조건이며 법정 경사 기준이 아니다.'
                exp=f'높이 차 = 수평 거리 × 경사율 ÷ 100 = {a} × {b} ÷ 100 = {num(r)}m이다. 퍼센트를 소수로 환산하며 실제 설계 허용 기준을 제시하는 문제가 아니다.'
            elif k==8:
                a,b=100+n,2;v=[a,b];r=a+4*b;unit='m';name='contour-elevation';topic='등고선 표고'
                stem=f'표고 {a}m 등고선에서 높은 쪽으로 등고 간격 {b}m를 네 번 건너갔다. 도착한 등고선의 표고는?'
                exp=f'높은 쪽으로 간격을 네 번 이동하므로 표고 증가 = 4 × {b} = {4*b}m이다. 도착 표고 = {a} + {4*b} = {r}m이며 출발선을 간격으로 추가 계산하지 않는다.'
            elif k==9:
                a,b=20+n,4;v=[a,b];r=a*b;unit='주';name='plants-density';topic='면적당 식재 수'
                stem=f'면적 {a}m²에 지피식물을 1m²당 {b}주씩 심는 학습 조건이다. 가장자리 보정 없이 필요한 총수는?'
                exp=f'총 식재 수 = 면적 × 단위면적당 수량 = {a} × {b} = {r}주이다. 이 밀도는 계산 조건일 뿐 모든 수종의 권장 식재 밀도를 뜻하지 않는다.'
            elif k==10:
                a,b=2*(10+n),2;v=[a,b];r=a//b+1;unit='주';name='line-endpoint-count';topic='양 끝 포함 열식'
                stem=f'길이 {a}m의 직선에 {b}m 간격으로 수목을 심는다. 양 끝점 모두 식재하고 한 줄만 심을 때 수량은?'
                exp=f'간격 수 = 길이 ÷ 간격 = {a} ÷ {b} = {a//b}칸이다. 양 끝점을 모두 포함한 나무 수는 간격 수보다 1 많으므로 {r}주이다.'
            elif k==11:
                a,b=30+n,20;v=[a,b];r=F(a*b,1000);unit='kg';name='seed-mass';topic='파종량'
                stem=f'면적 {a}m²에 잔디 종자를 1m²당 {b}g 파종한다고 가정한다. 손실을 제외한 종자 총질량은 몇 kg인가?'
                exp=f'필요 질량 = {a} × {b} = {a*b}g이다. 1kg = 1000g이므로 {a*b} ÷ 1000 = {num(r)}kg이다. 파종률은 이 문제의 가정이며 종별 권장량이 아니다.'
            elif k==12:
                a,b=10+n,20;v=[a,b];r=F(a*b,100);unit='kg';name='fertilizer-nitrogen';topic='비료 성분량'
                stem=f'질소 함유율이 질량 기준 {b}%인 비료 {a}kg에 포함된 질소의 질량은?'
                exp=f'질소 질량 = 비료 질량 × 함유율 ÷ 100 = {a} × {b} ÷ 100 = {num(r)}kg이다. 이 계산은 성분량 환산으로 시비 권장량을 뜻하지 않는다.'
            elif k==13:
                a,b=10+n,100;v=[a,b];r=F(a*1000,b);unit='mL';name='dilution-stock';topic='희석 원액량'
                stem=f'최종 부피 {a}L의 세척용 수용액을 원액 부피 기준 {b}배 희석으로 만든다. 부피가 가산된다고 가정할 때 필요한 원액은 몇 mL인가?'
                exp=f'원액 부피 = 최종 부피 ÷ 희석배수 = {a} ÷ {b}L이다. 1L = 1000mL이므로 {a} × 1000 ÷ {b} = {num(r)}mL이다. 농약 사용법을 제시하는 문제가 아니다.'
            elif k==14:
                a,b=20+n,5;v=[a,b];r=a*b;unit='L';name='water-depth-volume';topic='관수 깊이 환산'
                stem=f'면적 {a}m² 전체에 수심 {b}mm에 해당하는 물을 공급하려 한다. 침투·증발·유출 손실이 없을 때 물의 부피는 몇 L인가?'
                exp=f'1m²에 1mm 깊이의 물은 0.001m³ = 1L이다. 따라서 {a} × {b} = {r}L이다. 실제 관수량은 토양과 기상 조건 및 공급 효율을 별도로 고려한다.'
            elif k==15:
                a,b=10+n,25;v=[a,b];r=a*b;unit='장';name='paving-unit-count';topic='포장재 수량'
                stem=f'포장 면적이 {a}m²이고 1m²당 블록 {b}장이 필요하다. 절단과 파손, 여유분을 제외한 이론 수량은?'
                exp=f'블록 이론 수량 = 면적 × 단위면적당 장수 = {a} × {b} = {r}장이다. 실제 발주에서는 도면의 배치와 절단 및 손실 조건을 따로 검토한다.'
            elif k==16:
                a,b=20+n,25;v=[a,b];r=F(a*b,100);unit='m³';name='soil-mix-component';topic='혼합토 성분 체적'
                stem=f'전체 부피 {a}m³의 혼합토에서 모래 체적 비율을 {b}%로 정한다. 혼합 전후 부피 변화가 없다는 가정에서 모래 부피는?'
                exp=f'모래 부피 = 전체 부피 × 체적 비율 ÷ 100 = {a} × {b} ÷ 100 = {num(r)}m³이다. 체적 비율과 질량 비율은 서로 다르므로 단위를 혼동하지 않는다.'
            elif k==17:
                a,b=10+n,10;v=[a,b];r=F(a*(100+b),100);unit='m³';name='material-allowance';topic='재료 할증'
                stem=f'이론상 필요한 표토가 {a}m³이다. 이론량의 {b}%를 여유분으로 더할 때 준비할 총량은?'
                exp=f'총량 = 이론량 × (1 + 여유율) = {a} × 1.1 = {num(r)}m³이다. 여유율은 원래 이론량을 기준으로 더하며 이 값은 학습 조건이다.'
            elif k==18:
                a,b=(10+n)*120,2;v=[a,b];r=F(a,b*60);unit='분';name='irrigation-time';topic='급수 시간'
                stem=f'유량이 일정하게 초당 {b}L인 관수 장치로 물 {a}L를 공급한다. 중단과 손실 없이 몇 분이 걸리는가?'
                exp=f'시간(초) = 부피 ÷ 초당 유량 = {a} ÷ {b} = {a//b}초이다. 분으로 바꾸면 {a//b} ÷ 60 = {num(r)}분이다. 초와 분을 구분한다.'
            elif k==19:
                a,b=(5+n)*12,6;v=[a,b];r=F(a,b);unit='인·일';name='labor-person-days';topic='노무량'
                stem=f'총 작업량 {a}m²를 시공한다. 1인이 하루에 {b}m²를 시공하는 일정한 생산성일 때 필요한 노무량은?'
                exp=f'노무량 = 전체 작업량 ÷ 1인·일당 작업량 = {a} ÷ {b} = {num(r)}인·일이다. 작업 인원에 따른 실제 기간과 인·일 총량은 구별해야 한다.'
            elif k==20:
                a,b=10+n,20000;v=[a,b];r=a*b;unit='원';name='unit-cost';topic='공사비 단가'
                stem=f'포장 면적 {a}m²의 시공 단가가 1m²당 {b:,}원이다. 다른 비용과 세금을 제외한 금액은?'
                exp=f'금액 = 수량 × 단가 = {a} × {b:,} = {r:,}원이다. 문제에서 제외한 세금과 부대비용을 추가하지 않으며 단가의 적용 단위를 확인한다.'
            elif k==21:
                a,b=10+n,120;v=[a,b];r=F(a*b,100);unit='m³';name='soil-bulking';topic='흙의 부피 변화'
                stem=f'자연 상태 흙 {a}m³를 굴착하면 느슨한 상태 부피가 자연 상태의 {b}%가 된다고 가정한다. 굴착 후 부피는?'
                exp=f'굴착 후 부피 = 자연 상태 부피 × 1.2 = {a} × 1.2 = {num(r)}m³이다. 이는 상태별 부피 환산이며 흙의 질량이 늘어난다는 의미가 아니다.'
            elif k==22:
                a,b=30+n,10;v=[a,b];r=a-b;unit='m³';name='earthwork-surplus';topic='절성토 수지'
                stem=f'절토량이 {a}m³이고 성토에 {b}m³가 필요하다. 모든 흙이 재사용 가능하고 상태 변화와 손실이 없을 때 남는 흙은?'
                exp=f'남는 흙 = 절토량 − 필요한 성토량 = {a} − {b} = {r}m³이다. 실제 토공에서는 토질 적합성과 부피 변화, 손실 및 운반 조건을 따로 고려한다.'
            elif k==23:
                a,b=60+n,100;v=[a,b];r=F(a*100,b);unit='%';name='tree-survival-rate';topic='활착률'
                stem=f'같은 시기에 심은 수목 {b}주 중 조사 시점에 생존한 수목이 {a}주이다. 생존 주수 기준 활착률은?'
                exp=f'활착률 = 생존 주수 ÷ 식재 주수 × 100 = {a} ÷ {b} × 100 = {num(r)}%이다. 여기서는 생존 여부만으로 정의했으며 생육 품질까지 판정한 것은 아니다.'
            elif k==24:
                a,b=3*n,4*n;v=[a,b];r=5*n;unit='m';name='slope-length';topic='비탈 길이'
                stem=f'직각삼각형 단면의 비탈에서 수평 거리가 {a}m, 높이 차가 {b}m이다. 직선 비탈 길이는?'
                exp=f'피타고라스 정리에 따라 비탈 길이 = √(수평 거리² + 높이 차²) = √({a}² + {b}²) = {r}m이다. 비탈 길이를 수평 거리와 동일하게 취급하지 않는다.'
            elif k==25:
                a,b,d=10+n,12+n,2;v=[a,b,d];r=F((a+b)*d,2);unit='m³';name='average-end-area';topic='평균단면법'
                stem=f'두 토공 단면의 면적이 {a}m²와 {b}m²이고 단면 사이 거리가 {d}m이다. 평균단면법으로 구한 체적은?'
                exp=f'평균단면법 체적 = (양 끝 단면적 합) ÷ 2 × 거리 = ({a} + {b}) ÷ 2 × {d} = {num(r)}m³이다. 두 단면 사이의 변화를 평균으로 근사하는 방법이다.'
            else:
                a,b=(10+n)*10,5;v=[a,b];r=F(a,b);unit='m²/일';name='daily-productivity';topic='시공 생산성'
                stem=f'작업반이 총 {a}m²를 {b}일 동안 시공했다. 매일 같은 작업량이었다면 하루 평균 시공량은?'
                exp=f'하루 평균 시공량 = 전체 시공량 ÷ 일수 = {a} ÷ {b} = {num(r)}m²/일이다. 이는 작업반 기준 평균이며 1인당 생산성과는 구별한다.'
            r=F(r)
            choices=[f'{num(x)}{unit}' for x in [r,2*r,3*r,10*r]]
            add(subjects[k//9],topic,stem,choices,1,exp,
                family=name,calculation=dict(kind=name,values=v,result=float(r),unit=unit,precision=2))
