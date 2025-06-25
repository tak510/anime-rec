'use client'

import Link from 'next/link'
import Head from 'next/head'
import Navbar from './components/Navbar'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <main className="bg-[#1D1D1F] text-[#F5EDF7] min-h-screen font-inter">
      <Head>
        <title>Anivex – The Pulse of Anime Fandom</title>
      </Head>

      <Navbar />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-[#6B4CA0] to-[#FF5DA2] text-[#F5EDF7] overflow-hidden">
        {/* Left Mascot */}
        <div className="absolute left-8 md:left-16 bottom-0 h-64 md:h-80 lg:h-[24rem] w-40 md:w-48 lg:w-64 z-10">
          <Image
            src="/av_mascot_female.png"
            alt="Mascot Left"
            fill
            className="object-contain"
            sizes="(min-width: 768px) 20vw, 0"
            priority
          />
        </div>

        {/* Right Mascot */}
        <div className="absolute right-8 md:right-16 bottom-0 h-64 md:h-80 lg:h-[24rem] w-40 md:w-48 lg:w-64 z-10">
          <Image
            src="/av_mascot_male.png"
            alt="Mascot Right"
            fill
            className="object-contain"
            sizes="(min-width: 768px) 20vw, 0"
            priority
          />
        </div>

        {/* Main Hero Content */}
        <div className="relative z-20 text-center px-4">
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold drop-shadow-lg">
            Anime. Unlocked.
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto font-inter">
            Discover, rate, and explore anime tailored to your taste. Join a community driven by passion and powered by smart recommendations.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/signup"
              className="bg-[#2FFFE2] text-[#1D1D1F] px-6 py-3 font-semibold rounded hover:scale-105 transition"
            >
              Get Started
            </Link>
            <Link
              href="/popular"
              className="border border-[#2FFFE2] text-[#2FFFE2] px-6 py-3 font-semibold rounded hover:bg-[#2FFFE2] hover:text-[#1D1D1F] transition"
            >
              Browse Anime
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-[#1D1D1F] text-center">
        <h3 className="text-3xl font-orbitron text-[#FF5DA2] mb-12">Why Anivex?</h3>
        <div className="grid md:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
          <div className="bg-[#2f2f31] p-6 rounded-lg border border-[#2FFFE2] hover:shadow-cyan-500/20 hover:shadow-lg transition">
            <h4 className="text-xl font-orbitron text-[#2FFFE2] mb-2">Personalized Recommendations</h4>
            <p className="font-inter text-sm">Your ratings and watch history drive a smart recommendation engine to find anime you&apos;ll love.</p>
          </div>
          <div className="bg-[#2f2f31] p-6 rounded-lg border border-[#FF5DA2] hover:shadow-pink-500/20 hover:shadow-lg transition">
            <h4 className="text-xl font-orbitron text-[#FF5DA2] mb-2">Trending & Upcoming</h4>
            <p className="font-inter text-sm">Stay on top of what’s hot now and what’s releasing next. Curated, current, and community-powered.</p>
          </div>
          <div className="bg-[#2f2f31] p-6 rounded-lg border border-[#6B4CA0] hover:shadow-violet-500/20 hover:shadow-lg transition">
            <h4 className="text-xl font-orbitron text-[#6B4CA0] mb-2">Your Anime Hub</h4>
            <p className="font-inter text-sm">Profile, preferences, discussions, and collections — all in one sleek, futuristic platform.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1D1D1F] border-t border-[#2FFFE2] py-6 text-center text-sm text-[#F5EDF7]">
        &copy; {new Date().getFullYear()} Anivex. Built by an anime lover, for anime lovers. Icon: <a href="https://www.flaticon.com/free-icons/anime" title="anime icons">Anime icons created by Freepik - Flaticon</a>
      </footer>
    </main>
  );
}