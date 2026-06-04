"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // For now, just show success (you can integrate with an email API later)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen " style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
        <h1 className="text-4xl font-bold  mb-4" style={{ color: "var(--foreground)" }}>Contact & Support</h1>
        <p className="text-lg  max-w-2xl mx-auto" style={{ color: "var(--foreground)" }}>
          Have questions or need help? We&apos;re here to assist you. Get in touch with us through any of the channels below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className=" rounded-2xl shadow-lg border  p-8" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
          <h2 className="text-2xl font-bold  mb-6" style={{ color: "var(--foreground)" }}>Send Us a Message</h2>

          {submitStatus === "success" && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-emerald-800 font-semibold">✅ Message sent successfully!</p>
              <p className="text-emerald-700 text-sm mt-1">We&apos;ll get back to you within 24 hours.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium  mb-2" style={{ color: "var(--foreground)" }}>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2  rounded-xl focus:border-[#4255FF] focus:ring-2 focus:ring-indigo-200 outline-none transition-all" style={{ borderColor: "var(--card-border)" }}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium  mb-2" style={{ color: "var(--foreground)" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2  rounded-xl focus:border-[#4255FF] focus:ring-2 focus:ring-indigo-200 outline-none transition-all" style={{ borderColor: "var(--card-border)" }}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium  mb-2" style={{ color: "var(--foreground)" }}>
                Subject
              </label>
              <select
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border-2  rounded-xl focus:border-[#4255FF] focus:ring-2 focus:ring-indigo-200 outline-none transition-all" style={{ borderColor: "var(--card-border)" }}
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing & Payments</option>
                <option value="content">Content Issue / Report Question</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium  mb-2" style={{ color: "var(--foreground)" }}>
                Message
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border-2  rounded-xl focus:border-[#4255FF] focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none" style={{ borderColor: "var(--card-border)" }}
                placeholder="Describe your question or issue in detail..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-[#4255FF] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Email Support */}
          <div className=" rounded-2xl shadow-lg border  p-6" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#E8EAFF] rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[#4255FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>Email Support</h3>
                <p className=" mb-2" style={{ color: "var(--foreground)" }}>Get help via email</p>
                <a href="mailto:support@prepgenie.co.in" className="text-[#4255FF] hover:underline font-medium">
                  support@prepgenie.co.in
                </a>
                <p className="text-sm  mt-2" style={{ color: "var(--foreground)" }}>Response time: Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className=" rounded-2xl shadow-lg border  p-6" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>Location</h3>
                <p className="" style={{ color: "var(--foreground)" }}>Bangalore, Karnataka</p>
                <p className="" style={{ color: "var(--foreground)" }}>India</p>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className=" rounded-2xl shadow-lg border  p-6" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>Quick Help</h3>
                <p className=" mb-3" style={{ color: "var(--foreground)" }}>Check our help resources</p>
                <div className="space-y-2">
                  <a href="/terms" className="block text-[#4255FF] hover:underline text-sm">
                    → Terms of Service
                  </a>
                  <a href="/privacy" className="block text-[#4255FF] hover:underline text-sm">
                    → Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>⏰ Response Times</h3>
            <ul className="space-y-2 text-sm " style={{ color: "var(--foreground)" }}>
              <li className="flex items-start gap-2">
                <span className=" mt-0.5" style={{ color: "var(--foreground)" }}>•</span>
                <span><strong>General queries:</strong> Within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className=" mt-0.5" style={{ color: "var(--foreground)" }}>•</span>
                <span><strong>Technical issues:</strong> Within 12 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className=" mt-0.5" style={{ color: "var(--foreground)" }}>•</span>
                <span><strong>Billing inquiries:</strong> Within 48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className=" mt-0.5" style={{ color: "var(--foreground)" }}>•</span>
                <span><strong>Business days:</strong> Monday - Saturday (9 AM - 6 PM IST)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Common Questions */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold  mb-8 text-center" style={{ color: "var(--foreground)" }}>Common Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className=" rounded-xl border  p-6" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>How do I cancel my subscription?</h3>
            <p className=" text-sm" style={{ color: "var(--foreground)" }}>
              Go to Dashboard → Subscription → Cancel Subscription. Your access continues until the end of your billing period.
            </p>
          </div>

          <div className=" rounded-xl border  p-6" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>Can I cancel my subscription?</h3>
            <p className=" text-sm" style={{ color: "var(--foreground)" }}>
              Yes! You can cancel anytime from your account settings. Your Pro access will continue until the end of your current billing period.
            </p>
          </div>

          <div className=" rounded-xl border  p-6" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>How do I report a wrong question?</h3>
            <p className=" text-sm" style={{ color: "var(--foreground)" }}>
              Click the &quot;Report Question&quot; button during or after a quiz. We review all reports within 48 hours and update content accordingly.
            </p>
          </div>

          <div className=" rounded-xl border  p-6" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <h3 className="text-lg font-bold  mb-2" style={{ color: "var(--foreground)" }}>Which exams are supported?</h3>
            <p className=" text-sm" style={{ color: "var(--foreground)" }}>
              We support 20+ exams including JEE Main, NEET, UPSC CSE, SSC CGL, IBPS PO, CAT, GATE, and many state-level exams. Check the homepage for the full list.
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
