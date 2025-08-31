"use client";
import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import "./globals.css";

const poppins = localFont({
  src: "./fonts/Poppins-ExtraBold.ttf",
  variable: "--font-poppins",
  weight: "100 900",
});

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25 },
  },
};

// Reusable Section Wrapper
// Reusable Section Wrapper (works on scroll down AND up)
function AnimatedSection({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,                       
    amount: 0.25,                      
    margin: "0px 0px -120px 0px",      
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"} // toggle on enter/leave
      variants={{
        hidden: { opacity: 0, y: 80 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: "easeOut" },
        },
      }}
      className="transform-gpu will-change-transform" // smoother on mobile/GPU
    >
      {children}
    </motion.section>
  );
}



export default function Home() {
  return (
    <main className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <AnimatedSection>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Content Column */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="text-center lg:text-left space-y-8"
              >
                <motion.div variants={fadeInUp} className="space-y-4">
                  <h1
                    className={`text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight ${poppins.className}`}
                  >
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Shorten URLs
                    </span>
                    <br />
                    <span className="text-gray-900">Like a Pro</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Transform your long, complex URLs into clean, shareable
                    links. Fast, secure, and completely free with detailed
                    analytics.
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link href="/shorten">
                    <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300">
                      <span className="relative z-10">Start Shortening</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                    </button>
                  </Link>
                  <Link
                    href="https://github.com/Akshay-kapse/URL_Shorter"
                    target="_blank"
                  >
                    <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300">
                      View on GitHub
                    </button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Image Column */}
              <motion.div
                variants={fadeInUp}
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 z-10"></div>
                  <Image
                    className="object-cover w-full h-full"
                    alt="URL shortener illustration"
                    src="/vector.jpg"
                    fill={true}
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection>
        <section className="py-20 sm:py-24 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-blue-600">UrlShorter</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built with modern technology and designed for performance,
                security, and ease of use.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: "🚀",
                  title: "Lightning Fast",
                  desc: "Instant URL shortening with global CDN delivery. Your links work everywhere, instantly.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: "🔒",
                  title: "Privacy First",
                  desc: "No tracking, no ads, no data collection. Your privacy is our priority, always.",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: "📊",
                  title: "Smart Analytics",
                  desc: "Track clicks, monitor performance, and gain insights with our comprehensive analytics dashboard.",
                  color: "from-green-500 to-green-600",
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                  whileHover={{ y: -5 }}
                >
                  <div className="relative z-10">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span className="text-2xl">{f.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {f.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Stats Section */}
      <AnimatedSection>
        <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                ["10K+", "URLs Shortened"],
                ["50K+", "Total Clicks"],
                ["99.9%", "Uptime"],
                ["24/7", "Available"],
              ].map(([num, label], i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="text-center text-white"
                >
                  <div className="text-3xl sm:text-4xl font-bold mb-2">
                    {num}
                  </div>
                  <div className="text-blue-100">{label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-20 sm:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust UrlShorter for their URL
              shortening needs. Start creating short, powerful links today.
            </p>
            <Link href="/shorten">
              <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300">
                <span className="relative z-10">
                  Create Your First Short Link
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
}
