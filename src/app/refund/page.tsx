export const metadata = {
  title: "Refund Policy | PrepGenie",
  description: "Refund and cancellation policy for PrepGenie subscriptions",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Refund Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: May 16, 2026</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">1. No Refund Policy</h2>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-4">
              <p className="text-amber-900 font-semibold mb-3">⚠️ Important Notice</p>
              <p className="text-amber-800">
                PrepGenie operates on a <strong>no-refund policy</strong>. All payments for Pro subscriptions
                (Monthly and Quarterly plans) are final and non-refundable.
              </p>
            </div>
            <p className="text-slate-600 mb-4">
              We encourage you to try our <strong>Free plan</strong> (10 quizzes per day) before upgrading
              to Pro. This allows you to experience the platform and ensure it meets your needs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Exceptions</h2>
            <p className="text-slate-600 mb-3">
              Refunds will <strong>only</strong> be considered in the following exceptional cases:
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-4 ml-4">
              <li><strong>Duplicate Payment:</strong> You were accidentally charged twice for the same subscription</li>
              <li><strong>Technical Error:</strong> Payment was processed but subscription was not activated due to system error</li>
              <li><strong>Unauthorized Charge:</strong> Someone else used your payment method without your permission</li>
            </ul>
            <p className="text-slate-600">
              These cases will be reviewed individually and require proof of the issue.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">3. How to Report Payment Issues</h2>

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
                  <strong>Subject Line:</strong> &quot;Payment Issue - [Your Email]&quot;
                </li>
                <li>
                  <strong>Include Details:</strong>
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Your registered email address</li>
                    <li>Transaction ID or payment receipt</li>
                    <li>Description of the issue</li>
                    <li>Supporting evidence (screenshots, bank statements)</li>
                  </ul>
                </li>
                <li>
                  <strong>Review:</strong> We&apos;ll investigate the issue within 24-48 hours
                </li>
                <li>
                  <strong>Resolution:</strong> If approved, refund will be processed within 7-10 business days
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Subscription Cancellation</h2>

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
    </div>
  );
}
