import {test,expect} from '@playwright/test';
for (const width of [390,1440]) for(const theme of ['light','dark'] as const){
 test(`${width} ${theme}: token and context labs`,async({page})=>{
  await page.setViewportSize({width,height:900}); await page.emulateMedia({colorScheme:theme});
  await page.goto('/course'); await page.getByRole('link',{name:/What is a token/}).click();
  await expect(page.getByRole('heading',{name:'Take this with you.'})).toBeVisible();await page.getByRole('button',{name:/Split into tokens/}).click();await expect(page.locator('.pipeline-detail')).toContainText('two pieces');await page.getByRole('button',{name:'Next stage'}).click();await expect(page.locator('.pipeline-detail')).toContainText('assigns “Hello” the ID 101');
  const input=page.getByLabel('Your text');await input.fill('cat elephant!');await expect(page.locator('.lab-counts')).toContainText('2 whitespace-separated words');await expect(page.locator('.lab-counts')).toContainText('4 illustrative pieces');
  await page.getByLabel(/A token is a text unit/).check();await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByRole('status')).toContainText('Correct');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.goto('/course');await page.getByRole('link',{name:/The context window/}).click();
  await expect(page.locator('.window-turn').first()).toContainText('Outside window');await expect(page.locator('.window-turn').last()).toContainText('Included');
  await page.getByLabel(/Toy window capacity/).fill('48');await expect(page.locator('.window-turn').first()).toContainText('Included');
  await page.getByLabel(/The model can use that detail only/).check();await page.getByRole('button',{name:'Check answer'}).click();await expect(page.getByRole('status')).toContainText('Correct');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 });
}
