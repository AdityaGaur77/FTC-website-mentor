import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'Safety Guidelines', to: '/safety' },
  { label: 'Youth Protection Policy', to: '/safety#youth-protection' },
  { label: 'Creator Contact', to: '/safety#speak-up' },
  { label: 'FTC Community Links', to: '/requests' },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line-soft bg-panel/60">
      <div className="container-page py-10">
        <p className="font-display text-[15px] font-bold text-white">Relay for FTC</p>

        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3" aria-label="Footer">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-[12.5px] text-body transition-colors duration-200 hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-[11.5px] text-faint">
          Not officially affiliated with FIRST&reg; Robotics.
        </p>
      </div>
    </footer>
  )
}
