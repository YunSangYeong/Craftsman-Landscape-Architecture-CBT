import { test, expect } from '@playwright/test';
for(const viewport of [{width:390,height:480},{width:740,height:360}]){
 for(const input of ['wheel','touch'] as const){
  test(`메뉴 ${viewport.width}×${viewport.height} ${input} 상하 접근`,async({page,context,isMobile})=>{
   test.skip(!isMobile,'터치 가능한 모바일 에뮬레이션에서 검증');
   await page.setViewportSize(viewport);await page.goto('');
   await page.getByRole('button',{name:'메뉴 열기'}).click();
   const menu=page.locator('.sidebar');await expect(menu).toHaveClass(/open/);await page.waitForTimeout(400);
   const session=await context.newCDPSession(page);
   async function scroll(down:boolean){
    if(input==='wheel'){await page.mouse.move(120,viewport.height/2);await page.mouse.wheel(0,down?600:-600);}
    else {
     const start=down?viewport.height-70:80,end=down?80:viewport.height-70;
     await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:130,y:start}]});
     for(let i=1;i<=12;i++){
      await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:130,y:start+(end-start)*i/12}]});await page.waitForTimeout(20);
     }
     await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    }
    await page.waitForTimeout(300);
   }
   for(let i=0;i<5;i++) await scroll(true);
   expect(await menu.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
   const reset=menu.getByRole('button',{name:'데이터 초기화',exact:true});await expect(reset).toBeInViewport();
   await expect(menu.getByRole('button',{name:'학습 기록 백업'})).toBeInViewport();
   await reset.click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'돌아가기',exact:true}).click();
   for(let i=0;i<5;i++) await scroll(false);
   const home=menu.getByRole('button',{name:'학습 대시보드',exact:true});await expect(home).toBeInViewport();
   await home.click();await expect(menu).not.toHaveClass(/open/);
   await page.getByRole('button',{name:'메뉴 열기'}).click();await page.waitForTimeout(400);
   await page.addStyleTag({content:'html { font-size: 22px } .sidebar { font-size: 22px }'});
   for(let i=0;i<5;i++)await scroll(true);await expect(reset).toBeInViewport();
   for(let i=0;i<5;i++)await scroll(false);await expect(home).toBeInViewport();
  });
 }
}
test('상단 상시 안내 배너 없음·저장 실패 경고 유지',async({page})=>{
 await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('quota','QuotaExceededError')}});
 await page.goto('');await expect(page.getByRole('alert')).toContainText('기록을 저장하지 못했습니다');await expect(page.locator('.criteria-note')).toHaveCount(0);
});
test('주요 화면 상시 면책 배너 부재와 화면 캡처',async({page},info)=>{
 await page.goto('');
 await expect(page.locator('main .notice')).toHaveCount(0);
 await page.screenshot({path:info.outputPath('dashboard.png'),fullPage:true});
 await page.getByRole('button',{name:'모의시험 시작하기',exact:true}).click();
 await expect(page.locator('main .notice')).toHaveCount(0);
 await page.getByRole('button',{name:'시험 종료 및 제출'}).click();
 await page.getByRole('button',{name:'제출하고 결과 보기'}).click();
 await expect(page.locator('main .notice')).toHaveCount(0);
 if(await page.getByRole('button',{name:'메뉴 열기'}).isVisible())await page.getByRole('button',{name:'메뉴 열기'}).click();
 await page.getByRole('navigation').getByRole('button',{name:'랜덤 문제풀이',exact:true}).click();
 await expect(page.locator('main .notice')).toHaveCount(0);
});
