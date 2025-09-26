#!/usr/bin/env node

/**
 * Production OAuth Testing Script
 * Run this script to test OAuth flows in production
 */

const puppeteer = require('puppeteer');

const PRODUCTION_URL = process.env.PRODUCTION_URL || 'https://yourdomain.com';
const TEST_ACCOUNTS = {
  google: {
    email: process.env.TEST_GOOGLE_EMAIL,
    password: process.env.TEST_GOOGLE_PASSWORD
  },
  github: {
    email: process.env.TEST_GITHUB_EMAIL,
    password: process.env.TEST_GITHUB_PASSWORD
  }
};

async function testOAuthFlow(provider, isSignup = false) {
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`❌ ${provider} ${isSignup ? 'Signup' : 'Login'} Error:`, msg.text());
      }
    });
    
    // Navigate to production site
    await page.goto(PRODUCTION_URL);
    
    // Wait for page to load
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Click signup/login button
    const buttonText = isSignup ? 'Sign up' : 'Sign in';
    await page.click(`button:has-text("${buttonText}")`);
    
    // Wait for modal to open
    await page.waitForSelector('[data-testid="auth-modal-content"]', { timeout: 5000 });
    
    // Click OAuth provider button
    const providerButton = `button:has-text("Continue with ${provider === 'google' ? 'Google' : 'GitHub'}")`;
    await page.waitForSelector(providerButton, { timeout: 5000 });
    await page.click(providerButton);
    
    // Wait for popup to open
    const popupPromise = new Promise(resolve => {
      page.on('popup', resolve);
    });
    
    const popup = await popupPromise;
    
    // Handle OAuth flow in popup
    await popup.waitForSelector('input[type="email"]', { timeout: 10000 });
    await popup.type('input[type="email"]', TEST_ACCOUNTS[provider].email);
    await popup.click('button[type="submit"]');
    
    await popup.waitForSelector('input[type="password"]', { timeout: 10000 });
    await popup.type('input[type="password"]', TEST_ACCOUNTS[provider].password);
    await popup.click('button[type="submit"]');
    
    // Wait for popup to close and redirect
    await page.waitForFunction(() => {
      return window.location.pathname.includes('/dashboard') || 
             window.location.pathname.includes('/study-library');
    }, { timeout: 30000 });
    
    console.log(`✅ ${provider} ${isSignup ? 'Signup' : 'Login'} successful`);
    
  } catch (error) {
    console.error(`❌ ${provider} ${isSignup ? 'Signup' : 'Login'} failed:`, error.message);
  } finally {
    await browser.close();
  }
}

async function runAllTests() {
  console.log('🚀 Starting Production OAuth Tests...');
  
  const tests = [
    { provider: 'google', isSignup: false },
    { provider: 'github', isSignup: false },
    { provider: 'google', isSignup: true },
    { provider: 'github', isSignup: true }
  ];
  
  for (const test of tests) {
    await testOAuthFlow(test.provider, test.isSignup);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait between tests
  }
  
  console.log('🏁 All tests completed');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { testOAuthFlow, runAllTests };
