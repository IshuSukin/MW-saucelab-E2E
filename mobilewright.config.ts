import { defineConfig } from 'mobilewright';

export default defineConfig({
  platform: 'android',
  bundleId: 'com.saucelabs.mydemoapp.android',
  deviceType: 'emulator',
  testDir: './tests',
  timeout: 95_000,
  reporter: [
    ['list'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      environmentInfo: {
        Platform: 'Android',
        Device: 'Pixel 9a (Emulator)',
        App: 'My Demo App 2.3.0',
      },
    }],
  ],
  use: {
    animations: 'off',
  },
});