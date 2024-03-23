import {test} from '../test-options'
import {faker} from '@faker-js/faker'

test('parametrized methods', async({pageManager}) => {
    const randomFullName = faker.name.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.random.numeric(4)}@test.com`

    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
})