import React from 'react'
import Image from 'next/image'

export default function HomeUnikHero() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {/* --- HEADER / NAVIGATION --- */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8">
          {/* Logo Brand Group */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="relative h-8 w-8 text-primary">
              {/* Fallback clean SVG house icon matching the concept */}
              <svg
                xmlns="http://w3.org"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-full w-full"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">
              Home <span className="text-accent">Unik</span>
            </span>
          </div>

          {/* Center Navigation Links (Hidden on small screens) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-primary">
            <a
              href="#home"
              className="transition-colors hover:text-accent border-b-2 border-accent pb-1"
            >
              Home
            </a>
            <a href="#services" className="transition-colors hover:text-accent pb-1">
              Services
            </a>
            <a href="#about" className="transition-colors hover:text-accent pb-1">
              About
            </a>
            <a href="#testimonial" className="transition-colors hover:text-accent pb-1">
              Testimonial
            </a>
            <a href="#blog" className="transition-colors hover:text-accent pb-1">
              Blog
            </a>
          </nav>

          {/* CTA Right Action */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:inline-flex h-11 items-center justify-center rounded-none bg-accent px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent/90 hover:scale-[1.02] active:scale-[0.98]">
              Book Now
            </button>

            {/* Mobile Menu Icon (Visual anchor for completeness) */}
            <button className="flex h-10 w-10 items-center justify-center rounded-none border border-border md:hidden text-primary">
              <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION CONTAINER --- */}
      <main className="container mx-auto px-4 pt-6 pb-20 sm:px-8">
        <div className="relative w-full overflow-hidden rounded-none bg-slate-900 shadow-xl">
          {/* Main Visual Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-house-bg.webp" // Place your high-res architecture rendering here
              alt="Modern luxury estate architectural rendering"
              fill
              priority
              className="object-cover object-center opacity-85 brightness-[0.75]"
            />
            {/* Subtle Gradient wash overlay matching the image context */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/20" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center text-white md:px-12 md:pt-32 md:pb-44">
            {/* Tagline Anchor */}
            <div className="mb-4 flex items-center gap-2 rounded-none bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              <div className="flex gap-0.5">
                <span className="h-3 w-[2px] bg-white transform skew-x-12 inline-block"></span>
                <span className="h-3 w-[2px] bg-white transform skew-x-12 inline-block"></span>
              </div>
              <span className="text-xs font-bold tracking-widest uppercase">
                Welcome to Home Unik
              </span>
            </div>

            {/* Core Header Text */}
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:leading-[1.15]">
              Invest Today in <br />
              <span className="text-white">Your Dream Home</span>
            </h1>

            {/* Explainer Block */}
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-200/90 sm:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>

            {/* Interaction Layer Button Layout */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="h-12 rounded-none bg-accent px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-accent/90 hover:scale-[1.02]">
                View Property
              </button>
              <button className="h-12 rounded-none border border-white/40 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                Contact Now
              </button>
            </div>
          </div>

          {/* --- CONTEXTUAL SEARCH CONSOLE DOCK --- */}
          <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-1/2 px-4 md:px-12">
            <div className="mx-auto max-w-6xl rounded-none border border-border bg-white p-4 shadow-xl md:p-5">
              <form className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6 items-center">
                {/* Field 1: Keywords */}
                <div className="flex flex-col gap-1.5 px-2">
                  <input
                    type="text"
                    placeholder="Enter keywords"
                    className="w-full bg-transparent py-2 text-sm text-primary placeholder:text-slate-400 outline-none rounded-none"
                  />
                </div>

                {/* Field 2: Deal Strategy Selector */}
                <div className="flex flex-col gap-1.5 border-t sm:border-t-0 sm:border-l border-slate-100 px-2">
                  <select className="w-full bg-transparent py-2 text-sm text-slate-600 outline-none cursor-pointer appearance-none rounded-none">
                    <option value="">Sell or Rent</option>
                    <option value="sell">For Sale</option>
                    <option value="rent">To Rent</option>
                  </select>
                </div>

                {/* Field 3: Structural Layout Code */}
                <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-slate-100 px-2">
                  <select className="w-full bg-transparent py-2 text-sm text-slate-600 outline-none cursor-pointer appearance-none rounded-none">
                    <option value="">Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="townhome">Townhome</option>
                    <option value="bungalow">Bungalow</option>
                  </select>
                </div>

                {/* Field 4: Location Matrix */}
                <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-slate-100 px-2">
                  <select className="w-full bg-transparent py-2 text-sm text-slate-600 outline-none cursor-pointer appearance-none rounded-none">
                    <option value="">Location</option>
                    <option value="ny">New York, USA</option>
                    <option value="ldn">London, UK</option>
                  </select>
                </div>

                {/* Field 5: Internal Amenities */}
                <div className="flex flex-col gap-1.5 border-t md:border-t-0 md:border-l border-slate-100 px-2">
                  <select className="w-full bg-transparent py-2 text-sm text-slate-600 outline-none cursor-pointer appearance-none rounded-none">
                    <option value="">Amenities</option>
                    <option value="pool">Swimming Pool</option>
                    <option value="garage">Garage Space</option>
                  </select>
                </div>

                {/* Submit Query Activation Action */}
                <div className="col-span-1 sm:col-span-2 md:col-span-5 lg:col-span-1 pt-2 lg:pt-0">
                  <button
                    type="submit"
                    className="w-full h-12 flex items-center justify-center rounded-none bg-accent font-semibold text-white shadow-md transition-all hover:bg-accent/90"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Dynamic Empty Space Buffer to anchor content flow under the floating Search Console */}
        <div className="h-16 md:h-20" />
      </main>
    </div>
  )
}
