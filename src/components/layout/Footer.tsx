import Link from 'next/link'

const CITIES = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad',
  'Pune', 'Chennai', 'Kolkata', 'Ahmedabad',
]

export function Footer() {
  return (
    <footer className="bg-[#F5F5F5] border-t border-swiggy-border mt-16">
      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-brand-orange rounded-xl flex items-center justify-center text-white font-black text-xl leading-none">
                S
              </div>
              <span className="text-2xl font-black text-brand-orange">swiggy</span>
            </div>
            <p className="text-sm text-swiggy-gray leading-relaxed max-w-[180px]">
              Order food &amp; groceries from the best restaurants near you.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-black text-sm mb-4 text-swiggy-black">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {['About Us', 'Swiggy Corporate', 'Careers', 'Blog', 'Swiggy One'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-swiggy-gray hover:text-swiggy-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-sm mb-4 text-swiggy-black">Contact us</h4>
            <ul className="space-y-2.5 text-sm">
              {['Help & Support', 'Partner With Us', 'Ride With Us'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-swiggy-gray hover:text-swiggy-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Available in */}
          <div>
            <h4 className="font-black text-sm mb-4 text-swiggy-black">Available in</h4>
            <ul className="space-y-2.5 text-sm">
              {CITIES.slice(0, 5).map((city) => (
                <li key={city}>
                  <Link href="/restaurants" className="text-swiggy-gray hover:text-swiggy-black transition-colors">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Life at Swiggy */}
          <div>
            <h4 className="font-black text-sm mb-4 text-swiggy-black">Life at Swiggy</h4>
            <ul className="space-y-2.5 text-sm">
              {['Explore With Swiggy', 'Swiggy News', 'Snackables', 'Terms & Conditions', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-swiggy-gray hover:text-swiggy-black transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-swiggy-border" />

      {/* Cities grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h4 className="text-sm font-black text-swiggy-black mb-4">Cities with food delivery</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {CITIES.map((city) => (
            <Link
              key={city}
              href="/restaurants"
              className="text-xs text-swiggy-gray border border-swiggy-border rounded-xl px-3 py-2.5 hover:border-brand-orange hover:text-brand-orange transition-colors text-center leading-snug"
            >
              Order food online in {city}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-swiggy-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-swiggy-gray-light">
            © {new Date().getFullYear()} Bundl Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((platform) => (
              <Link key={platform} href="#" className="text-xs text-swiggy-gray hover:text-swiggy-black transition-colors">
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
