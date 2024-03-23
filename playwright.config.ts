import { defineConfig, devices } from '@playwright/test';
import type {TestOptions} from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
// THESE ARE THE GLOBAL SETTINGS. eVERYTHING THATS WRITTEN IN THIS SECTION
// CAN BE WRITTEN FOR EACH INDIVIDUAL PROJECT UNDER PROJECTS
export default defineConfig<TestOptions>({
  timeout: 180000,
  // globalTimeout: 120000,
  expect:{ // increase timeout for the locator assertions
    timeout: 2000
  },
  
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // if the env is CI: 2 retries, else 0. We will change it to 1 on local machine
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: [
  ['json', {outputFile: 'test-results/jsonReport.json'}],
  ['junit', {outputFile: 'test-results/junitReport.xml'}],
  // ['allure-playwright']
  ['html']
  ],
  
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:4200/',
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
    baseURL: process.env.DEV == '1' ? 'http://localhost:4200/'
          : process.env.STAGING == '1' ? 'http://localhost:4202/'
          : 'http://localhost:4201/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // actionTimeout: 5000,
    // navigationTimeout: 5000
    video: {
      mode: 'off',
      size: {width: 1920, height: 1080}
    }
  },


  /* Configure projects for major browsers */
  projects: [ // these are actually environments not projects
  // as a side note, cannot create more env variables inside of the project tag
  // in order to create more env variables we created the test-options.ts file where we will define there everything
    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'],
      //baseURL: 'http://localhost:4201/',
    },
      //fullyParallel: false
    },

    {
      name: 'staging',
      use: { ...devices['Desktop Firefox'],
      //baseURL: 'http://localhost:4202/',
    },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro'],
        viewport: {width: 434, height: 800},
        baseURL: 'http://localhost:4200/',
      },

    }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
  command: 'npm run start',
  url: 'http://localhost:4200/',
  //reuseExistingServer: !process.env.CI,
  },
});
