import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0F1F2E] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold mb-3">Vamos.net</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              The World of Padel. Live scores, rankings, news, and everything you need to follow professional padel.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Sections</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/scores" className="text-gray-300 hover:text-[#4ABED9] transition-colors">Live Scores</Link></li>
              <li><Link href="/rankings" className="text-gray-300 hover:text-[#4ABED9] transition-colors">Rankings</Link></li>
              <li><Link href="/news" className="text-gray-300 hover:text-[#4ABED9] transition-colors">News</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-[#4ABED9] transition-colors">About</Link></li>
            </ul>
          </div>

          {/* News */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">News</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/news?category=Tour+News" className="text-gray-300 hover:text-[#4ABED9] transition-colors">Tour News</Link></li>
              <li><Link href="/news?category=Rankings" className="text-gray-300 hover:text-[#4ABED9] transition-colors">Rankings</Link></li>
              <li><Link href="/news?category=Business" className="text-gray-300 hover:text-[#4ABED9] transition-colors">Business</Link></li>
              <li><Link href="/news?category=Academy" className="text-gray-300 hover:text-[#4ABED9] transition-colors">Academy</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-[#4ABED9] hover:text-white transition-colors" aria-label="Twitter / X">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-[#4ABED9] hover:text-white transition-colors" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-300 hover:bg-[#4ABED9] hover:text-white transition-colors" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10 text-center text-xs sm:text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Arbi Smart Solutions LLC. All rights reserved. Vamos.net — The World of Padel.
        </div>
      </div>
    </footer>
  );
}
