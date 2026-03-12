require('dotenv').config();
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:3000';
const LOGIN_EMAIL = process.env.E2E_EMAIL || 'admin@test.com';
const LOGIN_PASSWORD = process.env.E2E_PASSWORD || 'password';
const taskTitle = `Tache Selenium ${Date.now()}`;

(async function run() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--disable-gpu');
  options.addArguments('--window-size=1440,1200');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(`${FRONTEND_URL}/login`);
    await testLogout(driver); 

    const emailInput = await driver.wait(until.elementLocated(By.id('email')), 10000);
    await emailInput.sendKeys(LOGIN_EMAIL);

    const passwordInput = await driver.findElement(By.id('password'));
    await passwordInput.sendKeys(LOGIN_PASSWORD);

    const loginButton = await driver.findElement(By.css('button[type="submit"]'));
    await loginButton.click();

    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(., 'Gestionnaire de Tâches')]")),
      10000
    );

    const createTaskButton = await driver.findElement(
      By.xpath("//button[contains(., 'Nouvelle Tâche')]")
    );
    await createTaskButton.click();

    const titleInput = await driver.wait(until.elementLocated(By.id('title')), 10000);
    await titleInput.sendKeys(taskTitle);

    const descriptionInput = await driver.findElement(By.id('description'));
    await descriptionInput.sendKeys('Tache creee automatiquement par Selenium');

    const submitTaskButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitTaskButton.click();

    console.log('Test Selenium terminé avec succès.');
  } catch (error) {
    console.error('Erreur pendant le test Selenium :', error);
  } finally {
    await driver.quit();
  }
})();


async function testLogout(driver) {
  const logoutButton = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(., 'Déconnexion')]")),
    10000
  );
  await logoutButton.click();

  await driver.wait(until.urlContains('login'), 5000);

  const url = await driver.getCurrentUrl();
  if (!url.includes('login')) throw new Error('Déconnexion échouée, URL: ' + url);

  console.log('✅ Fonction 2 : Déconnexion réussie');
}