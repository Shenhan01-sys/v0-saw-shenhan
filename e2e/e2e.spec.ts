import { test, expect } from '@playwright/test';

test.describe('JAKVAS-SAW E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage with app header visible', async ({ page }) => {
    const header = page.locator('h1:has-text("JAKVAS-SAW")');
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('should show cardiovascular assessment title', async ({ page }) => {
    await expect(page.locator('text=Cardiovascular Risk Assessment')).toBeVisible({ timeout: 10000 });
  });

  test('should display stat cards on homepage', async ({ page }) => {
    await expect(page.locator('text=Clinical Features')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Risk Categories')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=ROC-AUC')).toBeVisible({ timeout: 5000 });
  });

  test('should expand How It Works card when clicked', async ({ page }) => {
    const howItWorksLink = page.locator('a[href="/#how-it-works"]').first();
    await howItWorksLink.click();
    await expect(page.locator('text=Data Collection')).toBeVisible({ timeout: 5000 });
  });

  test('should show patient form with input fields', async ({ page }) => {
    await expect(page.locator('input[id="age"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[id="bmi"]')).toBeVisible({ timeout: 5000 });
  });

  test.describe('Navigation', () => {
    test('should navigate to methodology via nav button', async ({ page }) => {
      await page.click('text=Methodology');
      await expect(page).toHaveURL(/methodology/, { timeout: 10000 });
    });

    test('should switch to History view', async ({ page }) => {
      await page.click('button:has-text("History")');
      await expect(page.locator('text=Assessment History')).toBeVisible({ timeout: 5000 });
    });

    test('should switch back to Home view', async ({ page }) => {
      await page.click('button:has-text("History")');
      await expect(page.locator('text=Assessment History')).toBeVisible({ timeout: 5000 });
      await page.click('button:has-text("Home")');
      await expect(page.locator('text=Cardiovascular Risk Assessment')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('should display header on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('h1:has-text("JAKVAS-SAW")')).toBeVisible({ timeout: 10000 });
    });

    test('should display header on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('h1:has-text("JAKVAS-SAW")')).toBeVisible({ timeout: 10000 });
    });

    test('should display header on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('h1:has-text("JAKVAS-SAW")')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Form Interaction', () => {
    test('should accept age input', async ({ page }) => {
      const ageInput = page.locator('input[id="age"]');
      await ageInput.fill('35');
      await expect(ageInput).toHaveValue('35');
    });

    test('should accept BMI input', async ({ page }) => {
      const bmiInput = page.locator('input[id="bmi"]');
      await bmiInput.fill('24.5');
      await expect(bmiInput).toHaveValue('24.5');
    });
  });
});

test.describe('Methodology Page E2E', () => {
  test('should load methodology page', async ({ page }) => {
    await page.goto('/methodology');
    await expect(page).toHaveURL(/methodology/, { timeout: 10000 });
  });
});