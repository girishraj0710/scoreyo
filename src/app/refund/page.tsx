export const metadata = {
  title: "Refund Policy | PrepGenie",
  description: "Refund and cancellation policy for PrepGenie subscriptions",
};

export default function RefundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Refund Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: May 16, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. 7-Day Money-Back Guarantee</h2>
            <p className="text-slate-600 mb-4">
              We offer a <strong>7-day money-back guarantee</strong> for all new Pro subscriptions
              (Monthly and Quarterly plans). If you&apos;re not satisfied with PrepGenie, you can request a
              full refund within 7 days of your initial purchase.
            </p>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 mb-4">
              <p className="text-emerald-800 font-semibold mb-2">✅ Eligible for Full Refund:</p>
              <ul className="list-disc list-inside text-emerald-700 ml-4">
                <li>First-time Pro subscribers only</li>
                <li>Request submitted within 7 days of payment</li>
                <li>Used less than 10 quizzes or mock tests</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Refund Eligibility Criteria</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">2.1 Eligible Cases</h3>
            <ul className="list-disc list-inside text-slate-600 mb-4 ml-4">
              <li><strong>Not Satisfied:</strong> You tried the service but it didn&apos;t meet your expectations</li>
              <li><strong>Technical Issues:</strong> Service was not accessible due to technical problems on our end</li>
              <li><strong>Duplicate Payment:</strong> You were accidentally charged twice for the same subscription</li>
              <li><strong>Changed Mind:</strong> You decided not to continue within the 7-day window</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">2.2 Non-Eligible Cases</h3>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
              <p className="text-red-800 font-semibold mb-2">❌ NOT Eligible for Refund:</p>
              <ul className="list-disc list-inside text-red-700 ml-4">
                <li>Request made after 7 days of purchase</li>
                <li>Used more than 10 quizzes or mock tests</li>
                <li>Subscription renewals (only first purchase eligible)</li>
                <li>Account suspended for violating Terms of Service</li>
                <li>Partial month refunds (subscriptions are not pro-rated)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. How to Request a Refund</h2>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 mb-4">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Step-by-Step Process:</h3>
              <ol className="list-decimal list-inside text-slate-600 space-y-3 ml-4">
                <li>
                  <strong>Send Email:</strong> Contact us at{" "}
                  <a href="mailto:support@prepgenie.co.in" className="text-indigo-600 hover:underline">
                    support@prepgenie.co.in
                  </a>
                </li>
                <li>
                  <strong>Subject Line:</strong> &quot;Refund Request - [Your Email]&quot;
                </li>
                <li>
                  <strong>Include Details:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Your registered email address</li>
                    <li>Transaction ID or payment receipt</li>
                    <li>Reason for refund (optional but helpful)</li>
                  </ul>
                </li>
                <li>
                  <strong>Verification:</strong> We&apos;ll verify your usage and eligibility within 24-48 hours
                </li>
                <li>
                  <strong>Approval:</strong> If eligible, your refund will be processed within 7-10 business days
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Refund Processing</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">4.1 Processing Time</h3>
            <ul className="list-disc list-inside text-slate-600 mb-4 ml-4">
              <li><strong>Approval:</strong> 1-2 business days for review</li>
              <li><strong>Razorpay Processing:</strong> 5-7 business days</li>
              <li><strong>Bank Credit:</strong> Additional 2-3 days depending on your bank</li>
              <li><strong>Total Time:</strong> 7-10 business days from approval</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">4.2 Refund Method</h3>
            <p className="text-slate-600 mb-4">
              All refunds are credited back to the <strong>original payment method</strong> used for the purchase:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-4 ml-4">
              <li>Credit/Debit Card → Refunded to the same card</li>
              <li>UPI → Refunded to the same UPI ID</li>
              <li>Net Banking → Refunded to the same bank account</li>
              <li>Wallet → Refunded to the same wallet</li>
            </ul>
            <p className="text-slate-600">
              We cannot process refunds to a different payment method or account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Subscription Cancellation</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">5.1 Cancel Anytime</h3>
            <p className="text-slate-600 mb-4">
              You can cancel your subscription anytime from your <strong>Dashboard → Subscription</strong> page.
              Cancellation is instant and no refund is provided for the remaining subscription period.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">5.2 Access After Cancellation</h3>
            <ul className="list-disc list-inside text-slate-600 mb-4 ml-4">
              <li><strong>Immediate:</strong> Cancellation takes effect immediately</li>
              <li><strong>Paid Period:</strong> You retain Pro access until the end of your current billing cycle</li>
              <li><strong>Auto-Renewal:</strong> Your subscription will not auto-renew</li>
              <li><strong>Downgrade:</strong> You&apos;ll be moved to Free plan after the paid period expires</li>
            </ul>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> Cancelling your subscription does not automatically qualify you for a refund.
                Refunds are only available within the 7-day money-back guarantee period.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Special Circumstances</h2>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-6">6.1 Technical Issues</h3>
            <p className="text-slate-600 mb-4">
              If you experience technical issues that prevent you from using the Service (server downtime,
              critical bugs), contact us immediately. We may offer:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-4 ml-4">
              <li>Extended subscription period to compensate for downtime</li>
              <li>Partial refund or credit for affected days</li>
              <li>Full refund in case of prolonged unavailability</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">6.2 Payment Disputes</h3>
            <p className="text-slate-600 mb-4">
              If you notice an unauthorized charge or billing error:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-4 ml-4">
              <li>Contact us immediately at support@prepgenie.co.in</li>
              <li>We will investigate and resolve within 48 hours</li>
              <li>Duplicate charges will be refunded in full</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">6.3 Exceptional Cases</h3>
            <p className="text-slate-600">
              In exceptional circumstances (medical emergencies, serious technical failures), we may consider
              refund requests outside the standard policy. Each case is reviewed individually.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Free Plan Users</h2>
            <p className="text-slate-600">
              Free plan users have no payment obligations and are not eligible for refunds. You can delete
              your account anytime from your settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Refund Status Tracking</h2>
            <p className="text-slate-600 mb-3">After submitting a refund request:</p>
            <ol className="list-decimal list-inside text-slate-600 space-y-2 ml-4">
              <li><strong>Acknowledgment:</strong> We&apos;ll confirm receipt within 24 hours</li>
              <li><strong>Review:</strong> We&apos;ll verify eligibility within 1-2 business days</li>
              <li><strong>Decision:</strong> You&apos;ll receive approval or denial via email</li>
              <li><strong>Processing:</strong> If approved, refund initiated through Razorpay</li>
              <li><strong>Completion:</strong> You&apos;ll receive a confirmation once the refund is credited</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">9. Questions About Refunds?</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about our refund policy or need assistance with a refund request:
            </p>
            <ul className="list-none text-slate-600 ml-0">
              <li className="mb-2">📧 Email: <a href="mailto:support@prepgenie.co.in" className="text-indigo-600 hover:underline">support@prepgenie.co.in</a></li>
              <li className="mb-2">📞 Response Time: Within 24 hours on business days</li>
              <li>🌐 Website: <a href="https://prepgenie.co.in" className="text-indigo-600 hover:underline">prepgenie.co.in</a></li>
            </ul>
          </section>

          <div className="mt-12 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">💡 Pro Tip: Try Before Committing</h3>
            <p className="text-sm text-slate-600 mb-3">
              Not sure if Pro is right for you? Use our <strong>Free plan</strong> to try 3 quizzes per day
              and explore basic features before upgrading. This way, you can make an informed decision!
            </p>
            <p className="text-sm text-slate-600">
              Our 7-day money-back guarantee is designed to give you confidence when upgrading, but we want
              you to be completely satisfied from the start.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
