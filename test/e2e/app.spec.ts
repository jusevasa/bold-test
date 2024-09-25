import { test, expect } from '@playwright/test';

test.describe('App Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('displays loading state initially', async ({ page }) => {
    const loadingIndicator = page.locator('text=Loading');
    await expect(loadingIndicator).toBeVisible();
  });

  test('displays total sales in CardDashboard', async ({ page }) => {
    await page.waitForSelector('[data-testid="card-dashboard"]');
    const totalSales = page.locator('[data-testid="dashboard-total-sales"]');
    await expect(totalSales).toBeVisible();
  });

  test('filters transactions based on search query', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Buscar"]');
    await searchInput.fill('pse');

    await page.waitForTimeout(1000);

    const transactionRows = await page.locator(
      '[data-testid="transaction-item"]'
    );

    const matchingRow = await transactionRows.evaluateAll((rows) =>
      rows.find((row) => {
        const textContent = row.textContent;
        return textContent && textContent.includes('PSE');
      })
    );
    expect(matchingRow).not.toBeNull();
  });

  test('opens modal when a transaction is clicked', async ({ page }) => {
    const transactionItem = page.locator('[data-testid="transaction-item"]');
    await transactionItem.first().click();

    const modal = page.locator('[data-testid="modal-detail"]');
    await expect(modal).toBeVisible();

    const closeButton = modal.locator('button');
    await closeButton.click();
    await expect(modal).toBeHidden();
  });
});
