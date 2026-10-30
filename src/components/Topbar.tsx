import Link from 'next/link'
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from 'react-icons/fa'

const contactItems = [
  {
    icon: FaEnvelope,
    label: 'info@realestate.co.ke',
    href: 'mailto:info@realestate.co.ke',
  },
  {
    icon: FaPhoneAlt,
    label: '0729 396 862',
    href: 'tel:+254729396862',
  },
]

const socialLinks = [
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
]

export default function Topbar() {
  return (
    <div className=" w-full bg-primary text-primary-foreground dark:bg-accent dark:text-primary">
      <div className="container mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2.5">
        {/* Contact Information */}
        <div className="flex items-center gap-6">
          {contactItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 text-xs font-medium transition-opacity hover:opacity-75"
            >
              <Icon className="size-3.5 shrink-0 " />
              <span className="hidden md:block">{label}</span>
            </Link>
          ))}
        </div>

        {/* Address and Social Links */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-medium">
            <FaMapMarkerAlt className="size-3.5 shrink-0" />
            <span>Nakuru, Kenya</span>
          </div>

          <div className="h-4 w-px bg-current opacity-25" />

          {/* Social Media */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:opacity-70"
              >
                <Icon className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
