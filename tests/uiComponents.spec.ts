import {expect, test} from '@playwright/test'
import { CONNREFUSED } from 'dns'
import { using } from 'rxjs'
import { delay } from 'rxjs/operators'

// test.describe.configure({mode: 'parallel'})

test.beforeEach(async({page}, testinfo) => {
    await page.goto('http://localhost:4200/') 
})

test.describe("Form Layouts page @block", () => {
    test.describe.configure({retries:0}) // this overrights the Retries in config.ts file
    test.describe.configure({mode: 'serial'})

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })
    
    test('input fields', async({page}, testinfo) => {
        if(testinfo.retry){
            // do something
        }
        const usingTheGridEmailImput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailImput.fill('test@test.com')
        await usingTheGridEmailImput.clear()
        await usingTheGridEmailImput.pressSequentially('test2@test.com'/*, {delay: 500}*/)

        // generic assertion
        const inputValue = await usingTheGridEmailImput.inputValue()
        expect (inputValue).toEqual('test2@test.com')

        // locator assertion
        await expect(usingTheGridEmailImput).toHaveValue('test2@test.com')
        })

    test.only('radio buttons', async({page}) => {

        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})
    
        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: "Option 1"}).check({force: true})
        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot()
        // expect(radioStatus).toBeTruthy()
        // await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        // await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})
   
    test('checkboxes', async({page}, testinfo) => {
        testinfo.setTimeout(120000)
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        await page.getByRole('checkbox', {name: "Hide on Click"}).uncheck({force: true})
        await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true})

        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.uncheck({force: true})
            expect(await box.isChecked()).toBeFalsy()
        }
     })

     test('lists and dropdowns', async({page}) => {
        const dropDownMenu = page.locator('ngx-header nb-select')
        await dropDownMenu.click()

        // how to interact with the list:
        page.getByRole('list') // when the list has a UL tag (represents the parent container)
        page.getByRole('listitem') // when the list has a LI tag (represents the arary of the list elements)

        // const optionList = page.getByRole("list").locator('nb-option')
        const optionList = page.locator('nb-option-list nb-option')
        await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
        await optionList.filter({hasText: "Cosmic"}).click()
        const header = page.locator('nb-layout-header')
        await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

        const colors = {
            "Light": "rgb(255, 255, 255)",
            "Dark": "rgb(34, 43, 69)",
            "Cosmic": "rgb(50, 50, 89)",
            "Corporate": "rgb(255, 255, 255)"
        }

        await dropDownMenu.click()
        for(const color in colors){
            await optionList.filter({hasText: color}).click()
            await expect(header).toHaveCSS('background-color', colors[color])
            if(color != "Corporate")
                await dropDownMenu.click()
            }
     })

     test('tooltip', async({page}, testinfo) => {
        testinfo.setTimeout(120000)
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

        const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"})
        await toolTipCard.getByRole('button', {name: "Top"}).hover()

        page.getByRole('tooltip') // if u have a role tooltip created
        const tooltip = await page.locator('nb-tooltip').textContent()
        expect (tooltip).toEqual('This is a tooltip')
     })

     test('DialogBox', async({page}, testinfo) => {
        testinfo.setTimeout(120000)
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart table').click()

        // we need to create a dialog for the listener to expect
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Are you sure you want to delete?')
            dialog.accept()
        })
        await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator(".nb-trash").click()
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
     })

     test('web tables', async({page}) => {
        await page.getByText('Tables & Data').click()
        await page.getByText('Smart table').click()

        // 1 get the row by any text in this row
        const targetRow = page.getByRole('row', {name: "twitter@outlook.com"})
        await targetRow.locator('.nb-edit').click()
        await page.locator('input-editor').getByPlaceholder('Age').clear()
        await page.locator('input-editor').getByPlaceholder('Age').fill('35')
        await page.locator('.nb-checkmark').click()
        
        // 2 get the row based on the value in the specific column
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
        const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
        await targetRowById.locator('.nb-edit').click()
        await page.locator('input-editor').getByPlaceholder('E-mail').clear()
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('.nb-checkmark').click()
        await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')        

        // 3 test filter of the table
        // created bellow all of the test data that we want to use:
        const ages = ["20", "30", "40", "200"]

        for(let age of ages){
            await page.locator('input-filter').getByPlaceholder('Age').clear()
            await page.locator('input-filter').getByPlaceholder('Age').fill(age)
            await page.waitForTimeout(500)
            const ageRows = page.locator('tbody tr') // created a simple locator to get all the rows

            for(let row of await ageRows.all()){ // out of those rows need to create an array
                const cellValue = await row.locator('td').last().textContent()

                // create a condition to tailor the assertions based on the output of the table
                if(age == "200"){
                    expect(await page.getByRole('table').textContent()).toContain('No data found')
                } else {
                    expect (cellValue).toEqual(age)
                }
            }
        }
     })

     test('date picker', async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Datepicker').click()

        const calendarInputField = page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        //using JS date object you can get current date and times
        let date = new Date()
        date.setDate(date.getDate() + 4)
        const expectedDate = date.getDate().toString()
        const expectedMonthShot = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }

        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click()
        await expect(calendarInputField).toHaveValue(dateToAssert)
    })


test.describe("Homepage-Dashboard", () => {
    test('sliders', async({page}) => {
        // update attribute
        const tempGauge = page.locator('[tabtitle = "Temperature"] ngx-temperature-dragger circle')
        await tempGauge.evaluate( node => {
            node.setAttribute('cx', '232.630')
            node.setAttribute('cy', '232.630')
        })
        await tempGauge.click()

        // mouse movement
        const tempBox = page.locator('[tabtitle = "Temperature"] ngx-temperature-dragger')
        await tempBox.scrollIntoViewIfNeeded()

        const box = await tempBox.boundingBox()
        const x = box.x + box.width/2
        const y = box.y + box.width/2
        await page.mouse.move(x,y)
        await page.mouse.down()
        await page.mouse.move(x+100, y)
        await page.mouse.move(x+100, y+100)
        await page.mouse.up()
        await expect(tempBox).toContainText('30')
    })

         

})
