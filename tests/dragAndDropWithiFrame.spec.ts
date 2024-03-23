import {expect} from '@playwright/test'
import { delay } from 'rxjs-compat/operator/delay'
import {test} from '../test-options'

test.skip('drag And Drop With iFrame', async({page, globalsQaURL}) => {
    await page.goto(globalsQaURL)

    // My code:
    // await page.waitForTimeout(3000)
    // const isVisible = await page.isVisible('fc-dialog-title')
    // if(isVisible){
    //     await page.locator('.fc-button fc-cta-consent fc-primary-button').getByRole('button', {exact: true}).click()
    // }

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    // more precise control
    await frame.locator('li', {hasText: "High Tatras 4"}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
     
})