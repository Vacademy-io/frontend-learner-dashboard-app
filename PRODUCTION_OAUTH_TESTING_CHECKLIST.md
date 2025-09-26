# Production OAuth Testing Checklist

## Pre-Deployment Checklist

### ✅ OAuth Provider Configuration
- [ ] Google OAuth redirect URI configured: `https://yourdomain.com/oauth-popup-handler`
- [ ] GitHub OAuth redirect URI configured: `https://yourdomain.com/oauth-popup-handler`
- [ ] OAuth consent screens configured
- [ ] Required scopes are requested
- [ ] Domain ownership verified

### ✅ SSL and Domain Setup
- [ ] HTTPS enabled and working
- [ ] SSL certificate valid and not expired
- [ ] Domain redirects configured (www vs non-www)
- [ ] Subdomain routing working (if applicable)
- [ ] CORS headers configured correctly

### ✅ Backend Configuration
- [ ] OAuth callback endpoints responding
- [ ] Token validation working
- [ ] User enrollment checking functional
- [ ] Institute ID resolution working
- [ ] Error handling implemented

## Production Testing Scenarios

### 🔐 Login Flow Testing
- [ ] **Google Login - Existing User**
  - [ ] Click "Continue with Google"
  - [ ] Complete OAuth in popup
  - [ ] Popup closes automatically
  - [ ] User redirected to dashboard
  - [ ] No console errors

- [ ] **GitHub Login - Existing User**
  - [ ] Click "Continue with GitHub"
  - [ ] Complete OAuth in popup
  - [ ] Popup closes automatically
  - [ ] User redirected to dashboard
  - [ ] No console errors

### 📝 Signup Flow Testing
- [ ] **Google Signup - New User**
  - [ ] Click "Sign up" then "Continue with Google"
  - [ ] Complete OAuth in popup
  - [ ] Signup modal opens with pre-filled data
  - [ ] Complete signup process
  - [ ] User redirected to dashboard
  - [ ] No console errors

- [ ] **GitHub Signup - New User**
  - [ ] Click "Sign up" then "Continue with GitHub"
  - [ ] Complete OAuth in popup
  - [ ] Signup modal opens with pre-filled data
  - [ ] Complete signup process
  - [ ] User redirected to dashboard
  - [ ] No console errors

### 🔄 Edge Case Testing
- [ ] **Existing User Tries Signup**
  - [ ] Use existing Google/GitHub account
  - [ ] Click signup button
  - [ ] Should automatically login (not show signup form)
  - [ ] Redirect to dashboard

- [ ] **Popup Blocked Scenario**
  - [ ] Enable popup blocker
  - [ ] Try OAuth login
  - [ ] Should show "Popup blocked" error
  - [ ] User can retry after allowing popups

- [ ] **Network Issues**
  - [ ] Throttle network to slow connection
  - [ ] Try OAuth flow
  - [ ] Should handle timeouts gracefully
  - [ ] Show appropriate error messages

### 🌐 Cross-Browser Testing
- [ ] **Chrome (Latest)**
  - [ ] Google OAuth works
  - [ ] GitHub OAuth works
  - [ ] No console errors

- [ ] **Firefox (Latest)**
  - [ ] Google OAuth works
  - [ ] GitHub OAuth works
  - [ ] No console errors

- [ ] **Safari (Latest)**
  - [ ] Google OAuth works
  - [ ] GitHub OAuth works
  - [ ] No console errors

- [ ] **Edge (Latest)**
  - [ ] Google OAuth works
  - [ ] GitHub OAuth works
  - [ ] No console errors

### 📱 Mobile Testing
- [ ] **iOS Safari**
  - [ ] OAuth popup opens correctly
  - [ ] Can complete OAuth flow
  - [ ] Redirects work properly

- [ ] **Android Chrome**
  - [ ] OAuth popup opens correctly
  - [ ] Can complete OAuth flow
  - [ ] Redirects work properly

## Error Monitoring

### 🚨 Critical Errors to Watch
- [ ] "Unable to communicate with parent window"
- [ ] "Authentication Failed"
- [ ] "Communication error"
- [ ] Popup not closing after OAuth
- [ ] Users stuck on /courses page
- [ ] Invalid token errors
- [ ] CORS policy violations

### 📊 Performance Metrics
- [ ] OAuth callback success rate > 95%
- [ ] Average OAuth flow completion time < 10 seconds
- [ ] Popup communication success rate > 98%
- [ ] User redirect success rate > 99%

## Post-Deployment Monitoring

### 🔍 Real-time Monitoring
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Monitor OAuth-related errors
- [ ] Track popup communication failures
- [ ] Monitor user flow completion rates

### 📈 Analytics
- [ ] Track OAuth provider usage (Google vs GitHub)
- [ ] Monitor signup vs login ratios
- [ ] Track user conversion rates
- [ ] Monitor bounce rates on OAuth pages

## Rollback Plan
- [ ] Keep previous version ready for rollback
- [ ] Have OAuth provider configuration backup
- [ ] Document rollback steps
- [ ] Test rollback procedure

## Success Criteria
- [ ] All OAuth flows working without errors
- [ ] No console errors in production
- [ ] Users can successfully login/signup
- [ ] Proper redirects after OAuth
- [ ] Mobile compatibility confirmed
- [ ] Cross-browser compatibility confirmed
