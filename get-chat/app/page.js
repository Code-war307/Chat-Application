"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.2 * i, duration: 0.6 },
  }),
};

export default function LandingPage() {
  const router = useRouter();

  const handleScrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll bg-thirdColor text-white scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
      <nav className="absolute top-0 left-0 right-0 p-4 shadow-lg shadow-black/50 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/messenger.png"
              alt="U Chat Logo"
              width={30}
              height={30}
            />
            <h1 className="text-2xl font-bold">Get Chat</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleScrollToFeatures}
              className="text-white hover:text-secondColor transition-colors duration-300"
            >
              Features
            </button>
            <Button className="font-semibold border-1 border-firstColor text-firstColor bg-secondColor hover:text-secondColor hover:bg-firstColor transition-colors duration-300" onClick={() => router.replace("/sign-up")}>
              Sign Up
            </Button>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="snap-start min-h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          Connect. Chat. Collaborate.
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-4 text-lg md:text-xl text-gray-400 max-w-xl"
        >
          Your secure, real-time messaging platform for personal and team
          communication.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-8 flex gap-4"
        >
          <Button className="relative inline-flex items-center justify-center p-4 px-6 py-4 overflow-hidden font-medium transition duration-300 ease-out border-2 border-firstColor rounded-full shadow-md group" onClick={() => router.replace("/sign-in")}>
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-firstColor duration-300 -translate-x-full bg-secondColor group-hover:translate-x-0 ease">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-[#67b0ff] transition-all duration-300 transform group-hover:translate-x-full ease">
              Sign in
            </span>
            <span className="relative invisible">Sign in</span>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="snap-start min-h-screen py-24 px-6 md:px-12 text-center bg-black border-t border-white/10"
      >
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl font-bold"
        >
          Why Choose <span className="text-secondColor hover:text-firstColor">Get Chat</span>?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="mt-4 text-gray-400 max-w-2xl mx-auto"
        >
          We built ChatVerse with simplicity, speed, and security in mind.
          Perfect for anyone looking to elevate their digital communication.
        </motion.p>

        <div className="mt-12 grid md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          {[
            {
              title: "Real-time Messaging",
              desc: "Experience blazing fast message delivery with low latency.",
            },
            {
              title: "Secure & Private",
              desc: "All messages are encrypted, ensuring your chats stay confidential.",
            },
            {
              title: "Cross-device Sync",
              desc: "Access your chats from any device, anytime.",
            },
            {
              title: "Easy to Use",
              desc: "Intuitive interface that anyone can pick up instantly.",
            },
            {
              title: "Custom Themes",
              desc: "Personalize your chat experience with theme options.",
            },
            {
              title: "AI-Powered Suggestions",
              desc: "Get smart replies and chat assistance with integrated AI.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm hover:scale-105 transition-transform duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="snap-start min-h-screen py-24 px-6 md:px-12 text-center bg-[#0f0f0f] border-t border-white/10">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-4xl font-bold"
        >
          Ready to start chatting?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={1}
          viewport={{ once: true }}
          className="mt-4 text-gray-400 max-w-xl mx-auto"
        >
          Create your free account and experience the future of messaging today.
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          custom={2}
          viewport={{ once: true }}
          className="mt-8 flex justify-center"
        >
          <Button className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium transition duration-300 ease-out border-2 border-firstColor rounded-full shadow-md group" onClick={() => router.replace("/sign-in")}>
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-firstColor duration-300 -translate-x-full bg-secondColor group-hover:translate-x-0 ease">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-[#67b0ff] transition-all duration-300 transform group-hover:translate-x-full ease">
              Get Started
            </span>
            <span className="relative invisible">Get Started</span>
          </Button>
        </motion.div>
      </section>

      {/* Sticky Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="sticky bottom-0 bg-[#0a0a0a] py-6 px-4 text-center border-t border-white/10 text-white text-sm"
      >
        © Get Chat 2025 — All rights reserved.
      </motion.footer>
    </main>
  );
}
