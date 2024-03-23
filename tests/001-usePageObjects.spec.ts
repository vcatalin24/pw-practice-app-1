import {expect, test} from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async({page}, testinfo) => {
    await page.goto('/') //baseURL: 'http://localhost:4200/' defined in playwright.config.ts
})

test('navigate to Form Page @smoke', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()  
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.name.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.random.numeric(4)}@test.com`

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'})
    // write screenshot in binary and save it into the buffer
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
    await page.locator('nb-card', {hasText: "Inline Form"}).screenshot({path: 'screenshots/inLineForm.png'})
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePicketDateFromToday(2)
    await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(0, 1)
})