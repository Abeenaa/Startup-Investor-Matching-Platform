// Quick email test script
// Run with: npx ts-node test-email.ts

import { emailService } from './src/shared/services/email.service';

async function testEmails() {
  console.log('🧪 Testing Email Service...\n');

  const testEmail = 'your-email@example.com'; // Replace with your email

  try {
    // Test 1: Welcome Startup
    console.log('1️⃣ Testing Welcome Startup Email...');
    await emailService.sendWelcomeStartup(testEmail, 'Test Startup');
    console.log('✅ Welcome Startup email sent\n');

    // Test 2: Welcome Investor
    console.log('2️⃣ Testing Welcome Investor Email...');
    await emailService.sendWelcomeInvestor(testEmail, 'Test Investor');
    console.log('✅ Welcome Investor email sent\n');

    // Test 3: Profile Approved
    console.log('3️⃣ Testing Profile Approved Email...');
    await emailService.sendStartupProfileApproved(testEmail, 'Test Startup');
    console.log('✅ Profile Approved email sent\n');

    // Test 4: Profile Rejected
    console.log('4️⃣ Testing Profile Rejected Email...');
    await emailService.sendStartupProfileRejected(
      testEmail,
      'Test Startup',
      'Missing required documents'
    );
    console.log('✅ Profile Rejected email sent\n');

    // Test 5: Application Submitted
    console.log('5️⃣ Testing Application Submitted Email...');
    await emailService.sendApplicationSubmitted(
      testEmail,
      'Test Startup',
      'Innovation Grant 2024'
    );
    console.log('✅ Application Submitted email sent\n');

    // Test 6: Application Approved
    console.log('6️⃣ Testing Application Approved Email...');
    await emailService.sendApplicationApproved(
      testEmail,
      'Test Startup',
      'Innovation Grant 2024'
    );
    console.log('✅ Application Approved email sent\n');

    // Test 7: Reviewer Assignment
    console.log('7️⃣ Testing Reviewer Assignment Email...');
    await emailService.sendReviewerAssigned(
      testEmail,
      'Test Reviewer',
      'Test Startup',
      'Innovation Grant 2024',
      'app-123'
    );
    console.log('✅ Reviewer Assignment email sent\n');

    console.log('🎉 All email tests completed! Check your inbox.');
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmails();
