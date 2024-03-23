import {expect, test} from '@playwright/test'
import { timeout } from 'rxjs-compat/operator/timeout'

test.beforeEach(async({page}, testinfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testinfo.setTimeout(testinfo.timeout + 2000) // this will modify the default timeout + 2 sec
})

// The duration of the wait is defined in timeout settings in playwrighytconfig.ts

test.skip('auto waiting', async({page}) => {
    const successButton = page.locator('.bg-success')

    //await successButton.click()

    // const text = await successButton.textContent() 

    // await successButton.waitFor({state: "attached"})
    // const text = await successButton.allTextContents() 

    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText("Data loaded with AJAX get request.", {timeout: 20000})
})

test.skip('alternative waits', async({page}) =>{
    const successButton = page.locator('.bg-success')
    
    //___ wait for element
    //await page.waitForSelector('.bg-success')

    //__ wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')
    
    //__ wait for network calls to be completed ('NOT RECOMMENDED')
    await page.waitForLoadState('networkidle')

    // for for a event to be completed
    await page.waitForTimeout(5000)
    await page.waitForURL('...')

    const text = await successButton.allTextContents() 
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('timeouts', async({page}) =>{
    
    //can set timeouts in playwright.config.ts 
    // timeout: 40000,
    // globalTimeout: 60000,
    // actionTimeout: 5000,
    // navigationTimeout: 5000

    //test.setTimeout(20000) - default test timeout is 30 sec
    test.slow() // multiplies the test run timeout x 3 
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 19000})
})