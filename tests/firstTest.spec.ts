import {expect, test} from '@playwright/test'
import { assert } from 'console'

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4200/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rulles', async ({page}) => {
    // by Tag name
    await page.locator('input').first().click()

    // by ID
    page.locator('#inputEmail1')

    // by class value
    page.locator('.shape-rectangle')

    // by attribute
    page.locator('[placeholder="Email"]')

    // by class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    // combine different selectors
    page.locator('input[placeholder="Email"][nbinput]')

    // by xpath - NOT RECOMENDED!
    page.locator('//[*@id="inputEmail1"]')

    // by partial text match
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')

})

// User Facing Locators mimic the actual user behaviour and are considered best practice to be used
test('user facing locators', async({page}) => { 
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the grid').click()

    await page.getByTestId('SignIn').click()

    await page.getByTitle('IoT Deashboard').click()
})

test('locating child elements', async({page}) => {
    // always try to use index or the order of the web elements
    // try to avoid using index .nth() or methods .first() or .last()

    // this approach is best: separate locators by " space "
    await page.locator('nb-card nb-radio :text-is("Option 1")').click() 

    // this approach is not nice but works
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    // this approapch combines locators with user facing locators. Can be used
    await page.locator('nb-card').getByRole('button',{name: "Sign in"}).first().click()

    // use this method as last resort
    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator("nb-card").filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator("nb-card").filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()

    await page.locator(':text-is("Using the grid")').locator('..').getByRole('textbox', {name: "Email"}).click()
})

test('reusing the locators', async({page}) => {
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('extracting values from DOM', async({page}) => {
    // single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect (buttonText).toEqual('Submit')

    // all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    // input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect (emailValue).toEqual("test@test.com")

    const placeHolderValue = await emailField.getAttribute('placeholder')
    expect (placeHolderValue).toEqual("Email")
})

test('assertions', async({page}) => {
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // general assertions - this is done instantly
    const value = 5
    expect(value).toEqual(5)

    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    // locator assertion - will always wait; have their own time out (5 sec)
    await expect(basicFormButton).toHaveText("Submit")

    // soft assertion - will continue the execution even if the assertion has failed
    await expect.soft(basicFormButton).toHaveText("Submit")
    await basicFormButton.click()
})

