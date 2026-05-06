import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-swiggy-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-black text-brand-orange mb-4">swiggy</h3>
            <p className="text-sm text-swiggy-gray-light leading-relaxed">
              Order food online from the best restaurants near you.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-swiggy-gray-light uppercase tracking-wide">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['About Us', 'Careers', 'Team', 'Swiggy One', 'Blog'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-swiggy-gray-light uppercase tracking-wide">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Help & Support', 'Partner with Us', 'Ride with Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-swiggy-gray-light uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Terms & Conditions', 'Cookie Policy', 'Privacy Policy', 'Investor Relations'].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} Bundl Technologies Pvt. Ltd.</p>
          <div className="flex gap-4">
            {['facebook', 'twitter', 'instagram'].map((platform) => (
              <Link key={platform} href="#" className="text-gray-500 hover:text-white transition-colors capitalize text-sm">
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
