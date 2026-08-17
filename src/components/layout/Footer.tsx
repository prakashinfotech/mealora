import Link from 'next/link'

const FOOTER_CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
  'Pune', 'Chennai', 'Kolkata', 'Ahmedabad',
]

export function Footer() {
  return (
    <footer className="bg-[#EBEBEB] border-t border-app-border/60 mt-0">
      {/* Cities grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h4 className="text-sm font-black text-app-black mb-4">Cities with food delivery</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {FOOTER_CITIES.map((city) => (
            <Link
              key={city}
              href={`/restaurants?city=${encodeURIComponent(city)}`}
              className="text-xs text-app-gray border border-app-border rounded-xl px-3 py-2.5 hover:border-brand-primary hover:text-brand-primary transition-colors text-center leading-snug"
            >
              Order food online in {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-app-border/40" />

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              {/* Mealora icon mark */}
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shrink-0">
                <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M22 18 L22 46 Q22 54 30 54 L30 82" stroke="white" strokeWidth="8" strokeLinecap="round"/>
                  <path d="M22 18 L22 36" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M30 18 L30 36" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M38 18 L38 36" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                  <path d="M38 42 Q50 22 62 42" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none"/>
                  <circle cx="70" cy="26" r="10" stroke="white" strokeWidth="7" fill="none"/>
                  <path d="M70 36 L70 82" stroke="white" strokeWidth="8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-2xl font-black text-brand-primary">Mealora</span>
            </div>
            <p className="text-sm text-app-gray leading-relaxed max-w-[180px]">
              Discover food. Order with ease. Fast delivery from the best restaurants near you.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-black text-sm mb-4 text-app-black">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {['About Us', 'Careers', 'Blog', 'Press', 'Partner With Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-app-gray hover:text-app-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-sm mb-4 text-app-black">Contact us</h4>
            <ul className="space-y-2.5 text-sm">
              {['Help & Support', 'Partner With Us', 'Ride With Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-app-gray hover:text-app-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Available in */}
          <div>
            <h4 className="font-black text-sm mb-4 text-app-black">Available in</h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_CITIES.slice(0, 5).map((city) => (
                <li key={city}>
                  <Link href={`/restaurants?city=${encodeURIComponent(city)}`} className="text-app-gray hover:text-app-black transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-black text-sm mb-4 text-app-black">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {['Top Restaurants', 'New Arrivals', 'Snackables', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-app-gray hover:text-app-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-app-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-app-gray-light">
            © {new Date().getFullYear()} Mealora. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
              <Link key={platform} href="#" className="text-xs text-app-gray hover:text-app-black transition-colors">
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
