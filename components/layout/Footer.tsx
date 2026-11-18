
import Link from "next/link";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-1.7.2-2.5l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.3 1 .5 1.9 1.5 1.9 1.8 0 3.1-2.3 3.1-5.1 0-2.1-1.4-3.7-3.9-3.7-2.8 0-4.5 2.1-4.5 4.4 0 .8.2 1.6.7 2.1.2.2.2.3.1.6l-.2.8c-.1.3-.3.4-.6.3-1.2-.5-1.7-1.9-1.7-3.5 0-2.6 2.2-5.8 6.6-5.8 3.5 0 5.8 2.5 5.8 5.2 0 3.6-2 6.3-5 6.3-1 0-2-.6-2.3-1.2l-.7 2.7c-.2.8-.7 1.7-1.1 2.4A10 10 0 1 0 12 2Z" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

export default function Footer() {
  return (
    <footer className="bg-heading-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand Information */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-medium tracking-wide text-white">
                Blush <span className="text-primary">&</span> Bloom
              </h2>
            </Link>

            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-primary">
              Beauty Salon & Wellness Studio
            </p>

            <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
              Experience beauty, relaxation, and personalized care.
              Discover a place where every detail is designed to make
              you feel confident, refreshed, and beautiful.
            </p>

            {/* Social Media Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-primary hover:bg-primary"
              >
                <InstagramIcon />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-primary hover:bg-primary"
              >
                <FacebookIcon />
              </a>

              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-primary hover:bg-primary"
              >
                <PinterestIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium text-white">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="w-fit text-sm text-white/65 transition hover:translate-x-1 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium text-white">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-4 text-sm text-white/65">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-primary">
                  Email
                </p>
                <a
                  href="mailto:hello@blushandbloom.com"
                  className="transition hover:text-primary"
                >
                  hello@blushandbloom.com
                </a>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-primary">
                  Phone
                </p>
                <a
                  href="tel:+8801XXXXXXXXX"
                  className="transition hover:text-primary"
                >
                  +880 1XXX-XXXXXX
                </a>
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-primary">
                  Address
                </p>
                <p>Salon address to be announced</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-medium text-white">
              Opening Hours
            </h3>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <span className="text-white/65">Saturday – Thursday</span>
                <span className="whitespace-nowrap text-primary">
                  10 AM – 8 PM
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-white/65">Friday</span>
                <span className="text-primary">Closed</span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-white/50">
              We look forward to welcoming you for a relaxing beauty
              experience.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Blush & Bloom. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/50 transition hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
