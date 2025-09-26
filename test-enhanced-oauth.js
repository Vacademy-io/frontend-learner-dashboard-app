#!/usr/bin/env node

/**
 * Enhanced OAuth Testing Script
 * Tests the new multi-strategy OAuth communication approach
 */

const puppeteer = require('puppeteer');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'http://localhost:5173';
const TEST_ACCOUNTS = {
  google: {
    email: process.env.TEST_GOOGLE_EMAIL || 'test@gmail.com',
    password: process.env.TEST_GOOGLE_PASSWORD || 'testpass'
  },
  github: {
    email: process.env.TEST_GITHUB_EMAIL || 'test@github.com',
    password: process.env.TEST_GITHUB_PASSWORD || 'testpass'
  }
};

// Test scenarios
const TEST_SCENARIOS = [
  { name: 'Google Login - Existing User', provider: 'google', isSignup: false },
  { name: 'GitHub Login - Existing User', provider: 'github', isSignup: false },
  { name: 'Google Signup - New User', provider: 'google', isSignup: true },
  { name: 'GitHub Signup - New User', provider: 'github', isSignup: true },
  { name: 'Popup Blocked Scenario', provider: 'google', isSignup: false, blockPopups: true },
  { name: 'Slow Network Scenario', provider: 'github', isSignup: false, slowNetwork: true },
  { name: 'Cross-Origin Test', provider: 'google', isSignup: false, crossOrigin: true }
];

async function testOAuthFlow(scenario) {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-web-security', // For cross-origin testing
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      
      if (type === 'error') {
        console.error(`❌ ${scenario.name} Error:`, text);
      } else if (type === 'warn') {
        console.warn(`⚠️ ${scenario.name} Warning:`, text);
      } else if (text.includes('oauth') || text.includes('popup')) {
        console.log(`ℹ️ ${scenario.name} Info:`, text);
      }
    });
    
    // Handle popup blocking
    if (scenario.blockPopups) {
      await page.evaluateOnNewDocument(() => {
        window.open = () => null;
      });
    }
    
    // Simulate slow network
    if (scenario.slowNetwork) {
      await page.setRequestInterception(true);
      page.on('request', request => {
        setTimeout(() => request.continue(), 1000); // 1 second delay
      });
    }
    
    // Navigate to production site
    await page.goto(PRODUCTION_URL);
    
    // Wait for page to load
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Click signup/login button
    const buttonText = scenario.isSignup ? 'Sign up' : 'Sign in';
    await page.click(`button:has-text("${buttonText}")`);
    
    // Wait for modal to open
    await page.waitForSelector('[data-testid="auth-modal-content"]', { timeout: 5000 });
    
    // Click OAuth provider button
    const providerButton = `button:has-text("Continue with ${scenario.provider === 'google' ? 'Google' : 'GitHub'}")`;
    await page.waitForSelector(providerButton, { timeout: 5000 });
    
    // Test popup blocking scenario
    if (scenario.blockPopups) {
      await page.click(providerButton);
      
      // Wait for popup blocked error
      await page.waitForSelector('text="Popup blocked"', { timeout: 5000 });
      console.log(`✅ ${scenario.name} - Popup blocking handled correctly`);
      return;
    }
    
    await page.click(providerButton);
    
    // Wait for popup to open
    const popupPromise = new Promise(resolve => {
      page.on('popup', resolve);
    });
    
    const popup = await popupPromise;
    
    // Monitor popup console for communication strategies
    popup.on('console', msg => {
      const text = msg.text();
      if (text.includes('Strategy') || text.includes('fallback') || text.includes('heartbeat')) {
        console.log(`🔄 ${scenario.name} Popup:`, text);
      }
    });
    
    // Handle OAuth flow in popup
    await popup.waitForSelector('input[type="email"]', { timeout: 10000 });
    await popup.type('input[type="email"]', TEST_ACCOUNTS[scenario.provider].email);
    await popup.click('button[type="submit"]');
    
    await popup.waitForSelector('input[type="password"]', { timeout: 10000 });
    await popup.type('input[type="password"]', TEST_ACCOUNTS[scenario.provider].password);
    await popup.click('button[type="submit"]');
    
    // Wait for popup to close and redirect
    await page.waitForFunction(() => {
      return window.location.pathname.includes('/dashboard') || 
             window.location.pathname.includes('/study-library') ||
             window.location.pathname.includes('/oauth-result');
    }, { timeout: 30000 });
    
    // Check if we're on the OAuth result page (fallback scenario)
    const currentUrl = page.url();
    if (currentUrl.includes('/oauth-result')) {
      console.log(`✅ ${scenario.name} - URL fallback strategy used`);
      
      // Wait for redirect from result page
      await page.waitForFunction(() => {
        return !window.location.pathname.includes('/oauth-result');
      }, { timeout: 10000 });
    }
    
    console.log(`✅ ${scenario.name} - Success`);
    
  } catch (error) {
    console.error(`❌ ${scenario.name} failed:`, error.message);
  } finally {
    await browser.close();
  }
}

async function testCommunicationStrategies() {
  console.log('🧪 Testing Enhanced OAuth Communication Strategies...\n');
  
  for (const scenario of TEST_SCENARIOS) {
    console.log(`\n🔄 Testing: ${scenario.name}`);
    await testOAuthFlow(scenario);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between tests
  }
  
  console.log('\n🏁 All enhanced OAuth tests completed');
}

async function testSpecificScenario(scenarioName) {
  const scenario = TEST_SCENARIOS.find(s => s.name === scenarioName);
  if (!scenario) {
    console.error(`❌ Scenario "${scenarioName}" not found`);
    console.log('Available scenarios:', TEST_SCENARIOS.map(s => s.name).join(', '));
    return;
  }
  
  console.log(`🧪 Testing specific scenario: ${scenarioName}`);
  await testOAuthFlow(scenario);
}

// Run tests if this script is executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Test specific scenario
    testSpecificScenario(args[0]).catch(console.error);
  } else {
    // Run all tests
    testCommunicationStrategies().catch(console.error);
  }
}

module.exports = { testOAuthFlow, testCommunicationStrategies, testSpecificScenario };
