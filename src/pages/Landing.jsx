import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import WhyDecisionOS from '../components/WhyDecisionOS';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Landing() {
    return (
        <div className="bg-[#0B0B0B] text-white min-h-screen font-sans selection:bg-violet-500/30 selection:text-white">
            {/* Navigation bar */}
            <Navbar />

            {/* Hero section containing the value proposition and interactive dashboard mockup */}
            <Hero />

            {/* Trusted startups logobar */}
            <TrustedBy />

            {/* Grid of 6 premium glass design feature cards */}
            <Features />

            {/* Horizontal / Vertical responsive interactive project flowchart */}
            <HowItWorks />

            {/* Custom comparative cards outlining DecisionOS philosophy */}
            <WhyDecisionOS />

            {/* Final conversions/sales portal */}
            <CTA />

            {/* Site map and legal disclaimer */}
            <Footer />
        </div>
    );
}
