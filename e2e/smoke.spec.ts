import { expect, test } from "@playwright/test";

test.describe("BLOQUE smoke", () => {
  test("home renders hero and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /ver disponibilidad/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /whatsapp/i }).first()).toBeVisible();
  });

  test("availability page loads the calendar", async ({ page }) => {
    await page.goto("/disponibilidad");
    await expect(page.getByRole("heading", { name: /elige el día/i })).toBeVisible();
    // react-day-picker renders a calendar grid
    await expect(page.getByRole("grid")).toBeVisible();
  });

  test("login page renders the form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /ingresar/i })).toBeVisible();
  });

  test("/dashboard redirects unauthenticated users to /login", async ({ page }) => {
    const res = await page.goto("/dashboard");
    expect(res?.url() ?? "").toContain("/login");
  });

  test("admin can sign in and see the dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("admin@bloque.cl");
    await page.getByLabel(/contraseña/i).fill("bloque2026");
    await page.getByRole("button", { name: /ingresar/i }).click();
    // Wait for redirect after credentials login
    await page.waitForURL((url) => !url.toString().includes("/login"), { timeout: 15_000 });
    // Then navigate to dashboard explicitly
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();
  });
});
