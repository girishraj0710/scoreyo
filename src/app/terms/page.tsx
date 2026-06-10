import { AccessibilityWrapper } from "@/components/accessibility-wrapper";

export const metadata = {
  title: "Terms of Service | Krakkify",
  description: "Terms of Service for Krakkify - AI-powered exam preparation platform",
};

export default function TermsPage() {
  return (
    <AccessibilityWrapper>
      <div className="min-h-screen" style={{ background: "var(--primary-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="rounded-2xl shadow-lg border p-8 md:p-12" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--foreground)" }}>Terms of Service</h1>
        <p className="mb-8" style={{ color: "var(--muted)" }}>Last updated: May 16, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>1. Acceptance of Terms</h2>
            <p className="mb-4" style={{ color: "var(--foreground-secondary)" }}>
              By accessing or using Krakkify (&quot;Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              Krakkify is operated by Krakkify and provides AI-powered exam preparation services for
              competitive exams in India including JEE, NEET, UPSC, SSC, Banking, and others.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>2. User Accounts</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>2.1 Account Creation:</strong> You must provide a valid email address to create an account.
              You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>2.2 Account Responsibility:</strong> You are responsible for all activities that occur under your account.
              Notify us immediately of any unauthorized use.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>2.3 Age Requirement:</strong> You must be at least 13 years old to use Krakkify.
              Users under 18 should use the Service under parental supervision.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>3. Subscription Plans</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>3.1 Free Plan:</strong> Limited to 10 quizzes per day with basic features.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>3.2 Pro Plans:</strong>
            </p>
            <ul className="list-disc list-inside mb-3 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Pro Monthly: ₹79/month - unlimited quizzes, mock tests, and detailed reports</li>
              <li>Pro Quarterly: ₹149/quarter (₹50/month) - save 37% with quarterly billing</li>
            </ul>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>3.3 Auto-Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date.
              You can cancel anytime from your dashboard.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>4. Payment Terms</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>4.1 Payment Processing:</strong> All payments are processed securely through Razorpay.
              We do not store your credit card or bank information.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>4.2 Pricing:</strong> All prices are in Indian Rupees (₹) and include applicable taxes.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>4.3 Failed Payments:</strong> If a payment fails, your subscription may be suspended until payment is resolved.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>5. Refund Policy</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>5.1 7-Day Money-Back Guarantee:</strong> New Pro subscribers can request a full refund within 7 days
              of purchase if they are not satisfied with the service.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>5.2 Refund Conditions:</strong> Refunds are only available if you have used less than 10 quizzes
              or mock tests. Refund requests must be submitted through our support channel.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>5.3 Processing Time:</strong> Approved refunds are processed within 7-10 business days
              and credited back to the original payment method.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>6. Content and Intellectual Property</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>6.1 Our Content:</strong> All questions, explanations, reports, and materials provided by Krakkify
              are protected by copyright and intellectual property laws.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>6.2 Prohibited Uses:</strong> You may not:
            </p>
            <ul className="list-disc list-inside mb-3 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Copy, distribute, or sell Krakkify content</li>
              <li>Use automated tools to scrape or download content</li>
              <li>Share your account credentials with others</li>
              <li>Reverse engineer or attempt to extract our question bank</li>
            </ul>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>6.3 User Content:</strong> You retain ownership of any content you submit (feedback, reports of errors).
              By submitting, you grant us a license to use this content to improve our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>7. AI-Generated Content</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>7.1 Question Sources:</strong> Krakkify uses a combination of:
            </p>
            <ul className="list-disc list-inside mb-3 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Previous year questions (PYQs) from actual exams</li>
              <li>NCERT textbook questions</li>
              <li>Expert-curated questions created by our team</li>
              <li>AI-generated questions validated by subject matter experts</li>
            </ul>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>7.2 Quality Assurance:</strong> All AI-generated questions undergo quality validation before being shown to users.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>7.3 Reporting Errors:</strong> If you find any incorrect or inappropriate content, please report it
              using the &quot;Report Question&quot; feature. We review all reports within 48 hours.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>8. User Conduct</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>You agree not to:</p>
            <ul className="list-disc list-inside mb-3 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to hack, disrupt, or compromise the Service</li>
              <li>Create multiple accounts to bypass free tier limitations</li>
              <li>Share solutions or cheat on quizzes/mock tests</li>
              <li>Harass or abuse other users or our support team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>9. Service Availability</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>9.1 Uptime:</strong> We strive for 99.9% uptime but cannot guarantee uninterrupted service.
              We may perform maintenance with or without notice.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>9.2 Changes to Service:</strong> We reserve the right to modify, suspend, or discontinue any
              part of the Service at any time. We will notify Pro users of major changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>10. Disclaimers</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>10.1 Educational Tool:</strong> Krakkify is a study aid and practice platform. Success in actual
              exams depends on many factors beyond our control.
            </p>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>10.2 No Guarantees:</strong> We do not guarantee specific exam results, ranks, or admission outcomes.
              Our Service provides practice and preparation support only.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>10.3 Third-Party Content:</strong> Questions sourced from NCERT and previous year papers are used
              for educational purposes. We are not affiliated with any exam conducting bodies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>11. Limitation of Liability</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              To the maximum extent permitted by law, Krakkify shall not be liable for:
            </p>
            <ul className="list-disc list-inside mb-3 ml-4" style={{ color: "var(--foreground-secondary)" }}>
              <li>Any indirect, incidental, or consequential damages</li>
              <li>Loss of data, profits, or business opportunities</li>
              <li>Errors or inaccuracies in content</li>
              <li>Unauthorized access to your account</li>
            </ul>
            <p style={{ color: "var(--foreground-secondary)" }}>
              Our total liability shall not exceed the amount you paid for the Service in the past 3 months.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>12. Termination</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              <strong>12.1 By You:</strong> You may cancel your subscription anytime from your dashboard.
              Access continues until the end of your billing period.
            </p>
            <p style={{ color: "var(--foreground-secondary)" }}>
              <strong>12.2 By Us:</strong> We may suspend or terminate your account if you violate these Terms,
              engage in fraudulent activity, or misuse the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>13. Governing Law</h2>
            <p style={{ color: "var(--foreground-secondary)" }}>
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
              jurisdiction of courts in Bangalore, Karnataka, India.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>14. Changes to Terms</h2>
            <p style={{ color: "var(--foreground-secondary)" }}>
              We may update these Terms from time to time. We will notify users of significant changes via email
              or through a notice on the Service. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--foreground)" }}>15. Contact Us</h2>
            <p className="mb-3" style={{ color: "var(--foreground-secondary)" }}>
              For questions about these Terms, please contact us:
            </p>
            <ul className="list-none ml-0" style={{ color: "var(--foreground-secondary)" }}>
              <li className="mb-2">📧 Email: <a href="mailto:support@krakkify.co.in" className="text-[#4255FF] hover:underline">support@krakkify.co.in</a></li>
              <li className="mb-2">🌐 Website: <a href="https://krakkify.co.in" className="text-[#4255FF] hover:underline">krakkify.co.in</a></li>
              <li>📍 Address: Bangalore, Karnataka, India</li>
            </ul>
          </section>

          <div className="mt-12 p-6 rounded-xl border" style={{ background: "var(--primary-bg)", borderColor: "var(--card-border)" }}>
            <p className="text-sm" style={{ color: "var(--foreground-secondary)" }}>
              By using Krakkify, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
    </AccessibilityWrapper>
  );
}
