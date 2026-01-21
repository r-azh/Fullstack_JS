import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Uncomment if Webkit is supported on your system
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
})
