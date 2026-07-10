import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

export const metadata = {
  title: "Privacy Policy | Krakkify",
  description: "Privacy Policy for Krakkify - How we collect, use, and protect your data",
};

export default function PrivacyPage() {
  return (
    <AccessibilityWrapper>
      <div className="min-h-screen" style={{ background: "var(--primary-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="rounded-2xl shadow-lg border p-8 md:p-12" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Privacy Policy</h1>
        <p className="mb-8" style={{ color: "var(--muted)" }}>Last updated: May 16, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>1. Introduction</h2>
            <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>
              Krakkify (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when you use our Service.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              By using Krakkify, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: "var(--foreground)" }}>2.1 Information You Provide</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li><strong>Email Address:</strong> Required for account creation and authentication</li>
              <li><strong>Name:</strong> Optional, for personalization</li>
              <li><strong>Payment Information:</strong> Processed securely through Razorpay (we do not store card details)</li>
              <li><strong>Exam Preferences:</strong> Selected exams, subjects, and topics you practice</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li><strong>Usage Data:</strong> Quiz attempts, scores, time spent, questions answered</li>
              <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
              <li><strong>Log Data:</strong> IP address, access times, pages viewed</li>
              <li><strong>Cookies:</strong> Session cookies for authentication and preference storage</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>2.3 Performance and Analytics Data</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Quiz performance metrics (accuracy, speed, difficulty levels)</li>
              <li>Topic-wise strengths and weaknesses</li>
              <li>Study patterns and learning progress</li>
              <li>Mock test results and section-wise performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>3. How We Use Your Information</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>We use your information to:</p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: "var(--foreground)" }}>3.1 Provide and Improve Services</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Create and manage your account</li>
              <li>Generate personalized quizzes and mock tests</li>
              <li>Track your progress and performance</li>
              <li>Provide detailed analytics and reports</li>
              <li>Recommend topics based on your weak areas</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>3.2 Communication</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Send OTP codes for authentication</li>
              <li>Send important account notifications</li>
              <li>Provide customer support</li>
              <li>Send subscription renewal reminders (you can opt out)</li>
              <li>Share new feature announcements (you can opt out)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>3.3 Payment Processing</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Process subscription payments through Razorpay</li>
              <li>Manage billing and invoicing</li>
              <li>Handle refund requests</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>3.4 Security and Fraud Prevention</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Detect and prevent fraudulent activities</li>
              <li>Monitor for unauthorized access</li>
              <li>Enforce our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>4. AI and Machine Learning</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>4.1 Question Generation:</strong> We use AI (powered by Gemini API) to generate practice questions.
              Your quiz performance data helps improve question quality and relevance.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>4.2 Personalization:</strong> We use machine learning to analyze your performance and recommend
              topics, difficulty levels, and study strategies.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>4.3 Data Processing:</strong> Your personal performance data is processed locally and not shared
              with third-party AI providers. Only anonymized, aggregated data is used for model improvement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>5. Data Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: "var(--foreground)" }}>5.1 We DO NOT Sell Your Data</h3>
            <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>5.2 Third-Party Service Providers</h3>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>We share limited data with:</p>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li><strong>Razorpay:</strong> Payment processing (they have their own privacy policy)</li>
              <li><strong>Resend:</strong> Email delivery for OTP codes</li>
              <li><strong>Turso (LibSQL):</strong> Database hosting for your account and performance data</li>
              <li><strong>Vercel:</strong> Website hosting and infrastructure</li>
              <li><strong>OpenRouter/Google Gemini:</strong> AI question generation (anonymized data only)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>5.3 Legal Requirements</h3>
            <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>
              We may disclose your information if required by law, court order, or government request, or to
              protect our rights, property, or safety.
            </p>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>5.4 Business Transfers</h3>
            <p style={{ color: "var(--foreground-secondary)" }}>
              If Krakkify is acquired or merged with another company, your information may be transferred to
              the new owners. We will notify you of any such change.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>6. Data Security</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>We implement industry-standard security measures:</p>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li><strong>Encryption:</strong> All data transmitted is encrypted using HTTPS/TLS</li>
              <li><strong>Secure Authentication:</strong> OTP-based login (no password storage)</li>
              <li><strong>Database Security:</strong> Encrypted database storage with access controls</li>
              <li><strong>Regular Backups:</strong> Automatic daily backups of your data</li>
              <li><strong>Access Controls:</strong> Limited employee access to personal data</li>
            </ul>
            <p style={{ color: "var(--foreground-secondary)" }}>
              While we strive to protect your data, no method of transmission over the internet is 100% secure.
              You are responsible for keeping your account credentials confidential.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>7. Data Retention</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>7.1 Active Accounts:</strong> We retain your data as long as your account is active.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>7.2 Inactive Accounts:</strong> Accounts inactive for 2 years may be archived. You can
              reactivate by logging in.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>7.3 Deleted Accounts:</strong> Upon account deletion, your personal data is removed within
              30 days. Anonymized performance data may be retained for analytics.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>8. Your Rights and Choices</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>You have the right to:</p>

            <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: "var(--foreground)" }}>8.1 Access and Export</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>View your personal information and quiz history in your dashboard</li>
              <li>Request a copy of your data (email us at support@krakkify.in)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>8.2 Correction and Update</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Update your email and preferences anytime in your account settings</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>8.3 Delete Account</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Request account deletion (contact support@krakkify.in)</li>
              <li>All personal data will be deleted within 30 days</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--foreground)" }}>8.4 Marketing Communications</h3>
            <ul className="list-disc list-inside mb-4 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Opt out of promotional emails (unsubscribe link in emails)</li>
              <li>Essential emails (OTP, receipts, security alerts) cannot be opted out</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>9. Cookies and Tracking</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>9.1 Essential Cookies:</strong> We use session cookies for authentication and user preferences.
              These are required for the Service to function.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>9.2 Analytics:</strong> We may use analytics tools to understand how users interact with our Service.
              You can disable cookies in your browser settings.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>9.3 Do Not Track:</strong> We currently do not respond to Do Not Track signals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>10. Children&apos;s Privacy</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              Krakkify is intended for users aged 13 and above. We do not knowingly collect information from
              children under 13. If we discover that a child under 13 has provided us with personal information,
              we will delete it immediately.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              Parents or guardians who believe their child has provided us with information should contact us at
              support@krakkify.in.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>11. International Data Transfers</h2>
            <p style={{ color: "var(--foreground-secondary)" }}>
              Your data is stored on servers located in India and the United States (via our cloud providers).
              By using Krakkify, you consent to the transfer of your information to these locations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>12. Changes to Privacy Policy</h2>
            <p style={{ color: "var(--foreground-secondary)" }}>
              We may update this Privacy Policy from time to time. We will notify you of significant changes via
              email or through a notice on the Service. The &quot;Last updated&quot; date at the top will reflect when
              changes were made.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>13. Contact Us</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              If you have questions about this Privacy Policy or wish to exercise your data rights, contact us:
            </p>
            <ul className="list-none ml-0" style={{ color: "var(--foreground-secondary)" }}>
              <li className="mb-2">📧 Email: <a href="mailto:support@krakkify.in" className="text-[#E76F51] hover:underline">support@krakkify.in</a></li>
              <li className="mb-2">🌐 Website: <a href="https://krakkify.in" className="text-[#E76F51] hover:underline">krakkify.in</a></li>
              <li>📍 Address: Bangalore, Karnataka, India</li>
            </ul>
          </section>

          <div className="mt-12 p-6 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--foreground)" }}>Your Privacy Matters</h3>
            <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
              We are committed to protecting your privacy and being transparent about how we use your data.
              If you have any concerns, please don&apos;t hesitate to reach out to us.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
