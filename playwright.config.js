import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  fullyParallel: true,
  workers: 4,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4177/', locale: 'pt-BR', timezoneId: 'America/Sao_Paulo' },
  webServer: {
    command: 'npx vite build && npx vite preview --port 4177 --strictPort',
    url: 'http://localhost:4177/',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
