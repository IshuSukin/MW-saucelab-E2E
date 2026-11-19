# Mobilewright Framework: Config File and GitHub Actions Workflow

Testleaf · Files and links from the Mobilewright + Allure + GitHub Actions video

This document has the two files used in the video, the demo app link and the documentation link. Copy the code exactly as shown.

## 1. Config file: mobilewright.config.ts

Save this in the root of your project, next to `package.json`.

```typescript
import { defineConfig } from 'mobilewright';

export default defineConfig({
  platform: 'android',
  bundleId: 'com.saucelabs.mydemoapp.android',
  deviceType: 'emulator',
  testDir: './tests',
  timeout: 120_000,
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
```

What each setting does:

- `platform`: the operating system we test on.
- `bundleId`: the unique ID (package name) of the app. Find yours with `adb shell pm list packages`.
- `deviceType`: the kind of device to use, here an emulator.
- `testDir`: the folder where Mobilewright looks for test files.
- `timeout`: how long one test may run, in milliseconds. 120\_000 is 2 minutes, enough for the longer checkout test. A value like 60\_000 is more common for short tests.
- `reporter`: how results are shown. `list` prints them in the terminal, and `allure-playwright` saves them in `allure-results` for the Allure report.
- `environmentInfo`: the values shown in the Environment box of the Allure report. Change them to match your device and app.
- `animations: 'off'`: turns off the phone's animations so tests run faster and steadier.

## 2. GitHub Actions workflow

Save this at `.github/workflows/mobilewright-android.yml` in your project. Keep the indentation exactly as shown.

```yaml
name: Mobilewright Android Tests

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:        # adds a manual "Run workflow" button

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 45

    steps:
      - name: Get the code
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Set up Java (needed by Allure)
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17

      - name: Enable KVM (makes the emulator fast)
        run: |
          echo 'KERNEL=="kvm", GROUP="kvm", MODE="0666", OPTIONS+="static_node=kvm"' | sudo tee /etc/udev/rules.d/99-kvm4all.rules
          sudo udevadm control --reload-rules
          sudo udevadm trigger --name-match=kvm

      - name: Install packages
        run: npm ci

      - name: Start emulator and run tests
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 34
          arch: x86_64
          target: google_apis
          disable-animations: true
          script: |
            adb devices
            adb install apps/mda-2.3.0-27.apk
            npx mobilewright doctor
            npx mobilewright test

      - name: Build Allure report
        if: always()
        run: npx allure generate allure-results --clean -o allure-report

      - name: Upload Allure report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-report
          path: allure-report
          retention-days: 14

      - name: Upload raw results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            allure-results
            test-results
          retention-days: 14
```

Notes:

- If your APK has a different file name, change it in the `adb install` line, and keep the APK in the `apps` folder of your repository.
- The workflow starts on every push to `main`, on pull requests, and when you press **Run workflow** in the Actions tab.
- A run takes roughly 10 to 15 minutes, mostly for the emulator.
- The Allure report is at the bottom of the run page under **Artifacts**. Unzip it and open it with `npx allure open "<path to the folder>"`. Do not double-click `index.html`.

## 3. Links

- Demo app: https://github.com/saucelabs/my-demo-app-android
- Mobilewright configuration docs: https://mobilewright.dev/docs/test/configuration
- Mobilewright project: https://github.com/mobile-next/mobilewright

## 4. Commands in order, with their purpose

| Step | Command | Purpose |
| --- | --- | --- |
| 1 | `npm init -y` | Creates package.json with default values. |
| 2 | `npm install mobilewright @mobilewright/test` | Installs Mobilewright and its test runner in this project. |
| 3 | `npx mobilewright init` | Creates the starter config file and an example test. |
| 4 | `npx mobilewright doctor` | Checks Node, Java, the Android SDK, ADB and the emulator, and flags what is missing. |
| 5 | `C:\Android\Sdk\emulator\emulator -avd Pixel_9a` | Starts the virtual phone. Run it in its own terminal and keep it open. Use your own SDK path and device name. |
| 6 | `adb devices` | Lists connected devices. The emulator should show as device. |
| 7 | `npx mobilewright devices` | Confirms that Mobilewright can see the emulator. |
| 8 | `adb install apps\mda-2.3.0-27.apk` | Installs the demo app on the emulator. Use your own APK file name. |
| 9 | `adb shell pm list packages \| findstr saucelabs` | Finds the app's package name, which goes in bundleId. |
| 10 | `npx mobilewright inspect` | Opens the Inspector to find locators. Keep it in its own terminal. |
| 11 | `npx mobilewright test` | Runs all tests in the tests folder. |
| 12 | `npx mobilewright test tests/login.spec.ts` | Runs one test file. |
| 13 | `npx mobilewright test --grep "name"` | Runs only the tests whose name matches. |
| 14 | `npm install --save-dev allure-playwright allure-commandline` | Installs the Allure reporter and the tool that builds the report. |
| 15 | `java -version` | Checks that Java is installed, which Allure needs. |
| 16 | `npx allure generate allure-results --clean -o allure-report` | Builds the HTML report from the results. The --clean flag removes the old report first. |
| 17 | `npx allure open allure-report` | Opens the report in the browser through a local server. |
| 18 | `Remove-Item -Recurse -Force allure-results, allure-report` | Clears old results before a fresh run (PowerShell). |
| 19 | `git init` | Creates a local Git repository. |
| 20 | `git add .` | Stages all changed files. |
| 21 | `git commit -m "your message"` | Saves the staged changes with a message. |
| 22 | `git branch -M main` | Names the branch main, to match GitHub. |
| 23 | `git remote add origin <repository URL>` | Links the project to your GitHub repository. |
| 24 | `git push -u origin main` | Sends the code to GitHub. A push also starts the GitHub Actions workflow. |
| 25 | `npx allure open "<path to the extracted report folder>"` | Opens the Allure report downloaded from GitHub Actions. |
