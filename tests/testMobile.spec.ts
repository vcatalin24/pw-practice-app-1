import {test, expect} from '@playwright/test'
import { timeout } from 'rxjs/operators'

test('input fields', async({page}, testinfo) => {
    await page.goto('/')
    if (testinfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }
    await page.locator('.sidebar-toggle').click()
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    if (testinfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }
    const usingTheGridEmailImput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
    await usingTheGridEmailImput.fill('test@test.com')
    await usingTheGridEmailImput.clear()
    await usingTheGridEmailImput.pressSequentially('test2@test.com')
    })