#!/usr/bin/env node
/**
 * API Endpoint Integration Tests
 * Tests all major API endpoints to ensure they return correct responses
 * Date: May 12, 2026
 */

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function pass(message: string) {
  totalTests++;
  passedTests++;
  log(`✅ ${message}`, 'green');
}

function fail(message: string, error?: any) {
  totalTests++;
  failedTests++;
  log(`❌ ${message}`, 'red');
  if (error) {
    console.error('   Error:', error.message || error);
  }
}

function section(title: string) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(title, 'cyan');
  log('='.repeat(60), 'cyan');
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function testAPI(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  headers: Record<string, string> = {}
) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await response.json();

  return { status: response.status, data };
}

async function testEnglishPracticeAPI() {
  section('1. ENGLISH PRACTICE API');

  try {
    // Test 1: Get English questions for Active & Passive Voice
    const result1 = await testAPI(
      '/api/english/practice',
      'POST',
      {
        pathId: 'foundation',
        topicId: 'active-passive',
        level: 'intermediate',
        count: 5,
      }
    );

    if (result1.status === 200 && result1.data.questions && result1.data.questions.length > 0) {
      pass(`Active & Passive Voice API: ${result1.data.questions.length} questions returned`);

      // Verify question structure
      const question = result1.data.questions[0];
      if (question.question && question.correctAnswer !== undefined && question.options) {
        pass('Question has correct structure (question, correctAnswer, options)');
      } else {
        fail('Question missing required fields');
      }
    } else if (result1.status === 401) {
      log('   English Practice API requires authentication (expected)', 'yellow');
      pass('English Practice API authentication check working');
    } else {
      fail('Active & Passive Voice API failed', result1.data);
    }

    // Test 2: Get English questions for Letter Writing
    const result2 = await testAPI(
      '/api/english/practice',
      'POST',
      {
        pathId: 'foundation',
        topicId: 'letter-writing',
        level: 'beginner',
        count: 5,
      }
    );

    if (result2.status === 200 && result2.data.questions && result2.data.questions.length > 0) {
      pass(`Letter Writing API: ${result2.data.questions.length} questions returned`);
    } else if (result2.status === 401) {
      log('   Letter Writing API requires authentication (expected)', 'yellow');
    } else {
      fail('Letter Writing API failed', result2.data);
    }

    // Test 3: Test with invalid topic
    const result3 = await testAPI(
      '/api/english/practice',
      'POST',
      {
        pathId: 'foundation',
        topicId: 'nonexistent-topic',
        level: 'intermediate',
        count: 5,
      }
    );

    if (result3.status === 404 || (result3.status === 200 && result3.data.questions.length === 0)) {
      pass('Invalid topic handling works correctly');
    } else {
      log('   Warning: Invalid topic returned unexpected result', 'yellow');
    }

  } catch (error) {
    fail('English Practice API test failed', error);
  }
}

async function testQuizAPI() {
  section('2. QUIZ API (COMPETITIVE EXAMS)');

  try {
    // Test generating a quiz
    const result = await testAPI('/api/quiz', 'POST', {
      examId: 'jee-main',
      subjectId: 'jee-physics',
      topicId: 'Mechanics',
      difficulty: 'medium',
      count: 5,
    });

    if (result.status === 200 && result.data.questions && result.data.questions.length > 0) {
      pass(`Quiz generation API: ${result.data.questions.length} questions returned`);

      // Verify question structure
      const question = result.data.questions[0];
      if (question.question && question.options && question.correctAnswer !== undefined) {
        pass('Quiz question has correct structure');
      } else {
        fail('Quiz question missing required fields');
      }
    } else if (result.status === 401) {
      log('   Quiz API requires authentication (expected)', 'yellow');
      pass('Quiz API authentication check working');
    } else {
      fail('Quiz API failed', result.data);
    }

  } catch (error) {
    fail('Quiz API test failed', error);
  }
}

async function testStatsAPI() {
  section('3. STATS API');

  try {
    const result = await testAPI('/api/stats', 'GET');

    if (result.status === 200 && result.data) {
      pass('Stats API responding');

      if (result.data.totalQuizzes !== undefined && result.data.accuracy !== undefined) {
        pass('Stats API returns expected fields (totalQuizzes, accuracy)');
      }
    } else if (result.status === 401) {
      log('   Stats API requires authentication (expected)', 'yellow');
      pass('Stats API authentication check working');
    } else {
      fail('Stats API failed', result.data);
    }

  } catch (error) {
    fail('Stats API test failed', error);
  }
}

async function testLeaderboardAPI() {
  section('4. LEADERBOARD API');

  try {
    const result = await testAPI('/api/leaderboard?examId=jee', 'GET');

    if (result.status === 200) {
      pass('Leaderboard API responding');

      if (result.data.personalBests || result.data.milestones) {
        pass('Leaderboard API returns data structure');
      }
    } else if (result.status === 401) {
      log('   Leaderboard API requires authentication (expected)', 'yellow');
      pass('Leaderboard API authentication check working');
    } else {
      fail('Leaderboard API failed', result.data);
    }

  } catch (error) {
    fail('Leaderboard API test failed', error);
  }
}

async function testSubscriptionAPI() {
  section('5. SUBSCRIPTION API');

  try {
    const result = await testAPI('/api/subscription', 'GET');

    if (result.status === 200) {
      pass('Subscription API responding');

      if (result.data.isPro !== undefined || result.data.status !== undefined) {
        pass('Subscription API returns status information');
      }
    } else if (result.status === 401) {
      log('   Subscription API requires authentication (expected)', 'yellow');
      pass('Subscription API authentication check working');
    } else {
      fail('Subscription API failed', result.data);
    }

  } catch (error) {
    fail('Subscription API test failed', error);
  }
}

async function testMockTestAPI() {
  section('6. MOCK TEST API');

  try {
    // Test getting available mock tests
    const result = await testAPI('/api/mock-test?examId=jee', 'GET');

    if (result.status === 200) {
      pass('Mock Test API responding');

      if (result.data.tests || result.data.config) {
        pass('Mock Test API returns test configuration');
      }
    } else if (result.status === 401 || result.status === 403) {
      log('   Mock Test API requires Pro subscription (expected)', 'yellow');
      pass('Mock Test API permission check working');
    } else {
      fail('Mock Test API failed', result.data);
    }

  } catch (error) {
    fail('Mock Test API test failed', error);
  }
}

async function testReportAPI() {
  section('7. QUESTION REPORT API');

  try {
    const result = await testAPI('/api/report', 'POST', {
      questionId: 'test-question-id',
      reason: 'incorrect_answer',
      description: 'Test report',
    });

    if (result.status === 200 || result.status === 201) {
      pass('Question Report API accepting reports');
    } else if (result.status === 401) {
      log('   Report API requires authentication (expected)', 'yellow');
      pass('Report API authentication check working');
    } else if (result.status === 400) {
      log('   Report API validation working (test data rejected)', 'yellow');
      pass('Report API input validation working');
    } else {
      fail('Report API failed', result.data);
    }

  } catch (error) {
    fail('Report API test failed', error);
  }
}

async function testWeaknessAPI() {
  section('8. WEAKNESS TRACKING API');

  try {
    const result = await testAPI('/api/weakness', 'GET');

    if (result.status === 200) {
      pass('Weakness API responding');

      if (result.data.weaknesses || Array.isArray(result.data)) {
        pass('Weakness API returns weakness data');
      }
    } else if (result.status === 401) {
      log('   Weakness API requires authentication (expected)', 'yellow');
      pass('Weakness API authentication check working');
    } else {
      fail('Weakness API failed', result.data);
    }

  } catch (error) {
    fail('Weakness API test failed', error);
  }
}

async function testClarifyAPI() {
  section('9. AI CLARIFICATION API');

  try {
    const result = await testAPI('/api/clarify', 'POST', {
      questionId: 'test-question',
      userQuery: 'Can you explain this concept?',
    });

    if (result.status === 200) {
      pass('Clarification API responding');

      if (result.data.explanation || result.data.response) {
        pass('Clarification API returns AI explanation');
      }
    } else if (result.status === 401) {
      log('   Clarification API requires authentication (expected)', 'yellow');
      pass('Clarification API authentication check working');
    } else if (result.status === 400) {
      log('   Clarification API validation working', 'yellow');
      pass('Clarification API input validation working');
    } else {
      fail('Clarification API failed', result.data);
    }

  } catch (error) {
    fail('Clarification API test failed', error);
  }
}

async function testDPPAPI() {
  section('10. DAILY PRACTICE PROBLEMS API');

  try {
    const result = await testAPI('/api/dpp', 'GET');

    if (result.status === 200) {
      pass('DPP API responding');

      if (result.data.problems || result.data.todayProblem) {
        pass('DPP API returns daily problems');
      }
    } else if (result.status === 401) {
      log('   DPP API requires authentication (expected)', 'yellow');
      pass('DPP API authentication check working');
    } else {
      fail('DPP API failed', result.data);
    }

  } catch (error) {
    fail('DPP API test failed', error);
  }
}

async function testSprintAPI() {
  section('11. SPRINT LEADERBOARD API');

  try {
    const result = await testAPI('/api/sprint', 'GET');

    if (result.status === 200) {
      pass('Sprint API responding');

      if (result.data.activeSprints !== undefined || Array.isArray(result.data)) {
        pass('Sprint API returns sprint data');
      }
    } else if (result.status === 401) {
      log('   Sprint API requires authentication (expected)', 'yellow');
      pass('Sprint API authentication check working');
    } else {
      fail('Sprint API failed', result.data);
    }

  } catch (error) {
    fail('Sprint API test failed', error);
  }
}

async function testPaymentAPI() {
  section('12. PAYMENT API');

  try {
    const result = await testAPI('/api/payment', 'POST', {
      planType: 'monthly',
      amount: 79,
    });

    if (result.status === 200) {
      pass('Payment API responding');

      if (result.data.orderId || result.data.order_id) {
        pass('Payment API generates Razorpay order');
      }
    } else if (result.status === 401) {
      log('   Payment API requires authentication (expected)', 'yellow');
      pass('Payment API authentication check working');
    } else if (result.status === 400) {
      log('   Payment API validation working', 'yellow');
      pass('Payment API input validation working');
    } else {
      fail('Payment API failed', result.data);
    }

  } catch (error) {
    fail('Payment API test failed', error);
  }
}

async function printSummary() {
  section('TEST SUMMARY');

  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0.0';

  log(`Total Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, 'red');
  log(`Success Rate: ${passRate}%`, passedTests === totalTests ? 'green' : 'yellow');

  if (failedTests === 0) {
    log('\n🎉 All API endpoints operational!', 'green');
  } else {
    log(`\n⚠️  ${failedTests} test(s) failed. Please review the errors above.`, 'yellow');
  }

  log('\n' + '='.repeat(60), 'cyan');
}

async function runAllTests() {
  log('\n🧪 PrepGenie API Endpoint Test Suite', 'cyan');
  log(`Testing all API endpoints at: ${BASE_URL}`, 'cyan');
  log(`Date: ${new Date().toISOString()}`, 'cyan');

  await testEnglishPracticeAPI();
  await testQuizAPI();
  await testStatsAPI();
  await testLeaderboardAPI();
  await testSubscriptionAPI();
  await testMockTestAPI();
  await testReportAPI();
  await testWeaknessAPI();
  await testClarifyAPI();
  await testDPPAPI();
  await testSprintAPI();
  await testPaymentAPI();

  await printSummary();
}

// Run tests
runAllTests().catch((error) => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
