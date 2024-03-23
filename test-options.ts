import {test as base} from '@playwright/test'
import { PageManager } from '../pw-practice-app/page-objects/pageManager'

// this file is created in order to define more env variables
// you can add how many env variables you want in this file

export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage: string // create a new fixture
    pageManager: PageManager // created the second fixture for PageManager
}

// creating new fixture to extend the base page object
export const test = base.extend<TestOptions>({ 
    globalsQaURL: ['', {option: true}],

    formLayoutsPage: async ({page}, use) => {
        await page.goto('/') 
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('')
        console.log('Tear Down')

    }, // {auto: true} ], // formlayoutFixture should be auto initialized as a very first thing when we run the test

    // Note: Very important to know the sequence of the execution in the fixture method:
    // - all methods and comands you run before 'use' block will be executed as a precondition before running the test and setting 
    // up the env
    // - all that put after "use" will be executed as a tier down after the test is completed 

    pageManager: async({page, formLayoutsPage}, use) => {
        const pm = new PageManager(page)
        await use(pm)
    }
})