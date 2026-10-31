import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
} from 'react-icons/fa'
import { FiArrowRight } from 'react-icons/fi'
import { Logo } from './Logo/Logo'

const footerLinks = [
  {
    title: 'Properties',
    links: [
      { title: 'Properties for Sale', href: '/properties-for-sale' },
      { title: 'Properties for Rent', href: '/properties-for-rent' },
      { title: 'Land & Plots', href: '/land-for-sale' },
      { title: 'Featured Properties', href: '/properties?featured=true' },
    ],
  },
  {
    title: 'Our Services',
    links: [
      { title: 'Property Management', href: '/services/property-management' },
      { title: 'Property Sales', href: '/services/property-sales' },
      { title: 'Property Letting', href: '/services/property-letting' },
      { title: 'Real Estate Investment', href: '/services/investment' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'Our Services', href: '/services' },
      { title: 'Blog & Insights', href: '/blog' },
      { title: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { title: 'Frequently Asked Questions', href: '/faq' },
      { title: 'List Your Property', href: '/list-property' },
      { title: 'Privacy Policy', href: '/privacy-policy' },
      { title: 'Terms & Conditions', href: '/terms' },
    ],
  },
]

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
]

export default function FooterSubscribe() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="container mx-auto px-4 md:px-6 2xl:max-w-[1400px]">
        {/* Newsletter */}
        <div className="grid gap-8 border-b border-border py-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-xl">
            <span className="mb-3 block text-sm font-semibold uppercase tracking-widest text-primary">
              Stay informed
            </span>

            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Find your place in the market.
            </h2>

            <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
              Subscribe to receive the latest property listings, market insights, investment
              opportunities, and real estate updates across Kenya.
            </p>
          </div>

          <form className="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              aria-label="Email address"
              className="h-12 flex-1 rounded-none"
            />

            <Button type="submit" className="h-12 gap-2 rounded-none px-6">
              Subscribe
              <FiArrowRight className="size-4" />
            </Button>
          </form>
        </div>

        {/* Footer Content */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-3 lg:grid-cols-6">
          {/* Company Information */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <Logo />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Your trusted real estate partner in Kenya. We help individuals and businesses buy,
              sell, rent, and manage properties with confidence.
            </p>

            {/* Contact Details */}
            <div className="flex flex-wrap gap-3 mt-3 ">
              <a
                href="tel:+254729396862"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <FaPhoneAlt className="size-3.5 shrink-0 text-primary" />
                0729 396 862
              </a>

              <a
                href="mailto:info@realestate.co.ke"
                className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <FaEnvelope className="size-4 shrink-0 text-primary" />
                info@realestate.co.ke
              </a>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FaMapMarkerAlt className="size-4 shrink-0 text-primary" />
                Kenya
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold">{group.title}</h3>

              <ul className="mt-5 space-y-3">
                {group.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-border py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Terms & Conditions
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground md:text-right">
            Your property. Our priority.
          </p>
        </div>
      </div>
    </footer>
  )
}
