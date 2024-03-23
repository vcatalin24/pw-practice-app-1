import { Locator, Page } from "@playwright/test";

export class NavigationPageCopy1 {

    readonly page: Page
    readonly formLayoutsMenuItem: Locator
    readonly datePickermenuItem: Locator
    readonly smartTabMenuItem: Locator
    readonly toastrmenuItem: Locator
    readonly tooltipMenuItem: Locator    


    constructor(page: Page){
        this.page = page
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.datePickermenuItem = page.getByText('Datepicker')
        this.smartTabMenuItem = page.getByText('Smart Table')
        this.toastrmenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
    }

    // screating a method to use the "page" fixture inside of the method
    // we use "this" instance of the page that will be used inside the constructor
    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
    }

    async datepickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.datePickermenuItem.click()
    }

    async smartTablePage(){
        await this.selectGroupMenuItem('Tables @ Data')
        await this.smartTabMenuItem.click()
    }

    async toastrPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrmenuItem.click()
    }

    async tooltipPage(){
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle) 
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false")
            await groupMenuItem.click()
    }

}