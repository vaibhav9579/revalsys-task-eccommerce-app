import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about this mini product showcase application.",
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight">🛍️ About Us</h1>

          <p className="mt-4 text-zinc-600">
            Welcome to <span className="font-semibold text-zinc-900">Revalsys</span>, your trusted
            destination for smart, reliable, and affordable online shopping.
          </p>
          <p className="mt-3 text-zinc-600">
            At Revalsys, we believe that great products shouldn’t come with complicated choices or high
            prices. Our goal is simple — to make your shopping experience smooth, secure, and satisfying
            from start to finish.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">🚀 Our Story</h2>
            <p className="mt-3 text-zinc-600">
              Revalsys was built with a vision to simplify online shopping for everyone. In today’s
              fast-moving digital world, customers often struggle with too many options, unclear quality,
              and unreliable services.
            </p>
            <p className="mt-3 text-zinc-600">We saw that gap — and decided to fix it.</p>
            <p className="mt-3 text-zinc-600">
              By combining technology with a customer-first approach, Revalsys ensures that every product
              listed on our platform meets quality standards and delivers real value.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">💡 What We Offer</h2>
            <ul className="mt-4 space-y-2 text-zinc-700">
              <li>🛒 Carefully curated products across multiple categories</li>
              <li>💰 Affordable pricing with no compromise on quality</li>
              <li>🚚 Fast and dependable delivery services</li>
              <li>🔒 Secure and trusted payment methods</li>
              <li>📞 Responsive customer support whenever you need help</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">🎯 Our Mission</h2>
            <p className="mt-3 text-zinc-600">
              Our mission is to make eCommerce simple, transparent, and accessible for everyone.
            </p>
            <p className="mt-3 text-zinc-600">
              We aim to build a platform where customers can shop with confidence and convenience, knowing
              they are getting the best value every time.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">🌟 Why Choose Revalsys?</h2>
            <ul className="mt-4 space-y-2 text-zinc-700">
              <li>✔️ Quality-focused product selection</li>
              <li>✔️ User-friendly shopping experience</li>
              <li>✔️ Reliable service and support</li>
              <li>✔️ Continuous improvement based on customer needs</li>
            </ul>
          </section>

          <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-2xl font-semibold tracking-tight">🤝 Our Promise</h2>
            <p className="mt-3 text-zinc-600">
              At Revalsys, we don’t just sell products — we build trust.
            </p>
            <p className="mt-3 text-zinc-600">
              Every order you place is handled with care, and every customer matters to us. Your
              satisfaction is at the core of everything we do.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">📬 Stay Connected</h2>
            <p className="mt-3 text-zinc-600">
              We value your feedback and are always here to help. Feel free to reach out to us anytime for
              support, suggestions, or queries.
            </p>
            <p className="mt-4 text-lg font-semibold text-zinc-900">
              ✨ Revalsys — Smart Shopping Starts Here.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
