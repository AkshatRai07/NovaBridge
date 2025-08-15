"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from 'framer-motion';
import React from "react";
import { ModeToggle } from "../ui/ModeToggle";

const supportedCurrencies = ["ETH/USD", "AUD/USD", "EUR/USD", "GBP/USD", "NZD/USD", "USD/BRL", "USD/CAD", "USD/CHF",
                             "USD/CLP", "USD/CNH", "USD/COP", "USD/HKD", "USD/IDR", "USD/INR", "USD/JPY", "USD/KRW",
                             "USD/MXN", "USD/NOK", "USD/PEN", "USD/PHP", "USD/SEK", "USD/SGD", "USD/TRY", "USD/TWD", 
                             "USD/ZAR"];

const supportedCurrenySymbols = [
  'ETH',  'A$',  '€',  '£',  'NZ$', '$',  'CA$', 'CHF', 'CLP$',
  '¥',  'COL$','HK$','Rp', '₹',  '¥',  '₩',   'Mex$','kr',
  'S/', '₱',   'kr', 'S$', '₺',  'NT$', 'R'
];

const IsNotConnected = () => {

  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % supportedCurrencies.length);
    }, 2000); // Change every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      <motion.section
        className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >

        {/* Navbar */}
        <header className="w-full py-4 px-8 flex justify-between items-center bg-white/50 dark:bg-slate-800/50 backdrop-blur border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">NovaBridge</h1>
          <div className="flex items-center gap-3">
            <ConnectButton />
            <ModeToggle />
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col items-center justify-center flex-1 px-6 text-center">
          <motion.h2
            className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Seamless Fiat-to-ETH Transfers
          </motion.h2>

          <motion.p
            className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            With NovaBridge, pay in any supported fiat currency and we’ll 
            instantly convert it to ETH using real-time prices from the 
            <span className="font-semibold"> Pyth Network</span>. 
            Your recipient gets exactly what they need — fast and transparent.
          </motion.p>

          <div className="w-full mt-8 overflow-hidden">
            <div className="flex whitespace-nowrap animate-marquee text-slate-700 dark:text-slate-200">
              {supportedCurrencies.map((currency, idx) => (
                <span key={idx} className="mx-3 p-2 px-3 rounded-2xl font-medium border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  {currency}
                </span>
              ))}
              {/* Duplicate list for seamless loop */}
              {supportedCurrencies.map((currency, idx) => (
                <span key={`dup-${idx}`} className="mx-3 py-2 px-3 rounded-2xl font-medium border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  {currency}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            className="mt-8 flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ConnectButton label="Get Started"/>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-slate-500 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-700">
          © {new Date().getFullYear()} NovaBridge. Built with ❤️ on Web3.
        </footer>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: inline-flex;
            animation: marquee 40s linear infinite;
          }
        `}</style>
      </motion.section>
    </div>
  );
};

export default IsNotConnected;
