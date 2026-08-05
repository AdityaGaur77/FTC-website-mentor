import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/* ---------------------------------------------------------------- Buttons */

type Variant = 'primary' | 'secondary' | 'quiet'
type Size = 'sm' | 'md'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-accent text-[#04222c] hover:bg-accent-soft',
  secondary: 'bg-raised text-white border border-line hover:border-accent/50 hover:bg-[#16273a]',
  quiet: 'bg-transparent text-body border border-line hover:text-white hover:border-accent/40',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-[12.5px]',
  md: 'h-9 px-4 text-[13px]',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', className, ...rest }: ButtonProps) {
  return <button className={cx(BASE, VARIANTS[variant], SIZES[size], className)} {...rest} />
}

export function ButtonLink({
  to,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: {
  to: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}) {
  return (
    <Link to={to} className={cx(BASE, VARIANTS[variant], SIZES[size], className)}>
      {children}
    </Link>
  )
}

/* ------------------------------------------------------------------ Chips */

export function Chip({
  active,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors duration-200',
        active
          ? 'bg-accent text-[#04222c]'
          : 'border border-line bg-card text-body hover:border-accent/40 hover:text-white',
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/* --------------------------------------------------------------- Sections */

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

/** Eyebrow + heading pair used at the top of every section. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  className?: string
}) {
  return (
    <div className={cx('max-w-2xl', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-[26px] font-bold leading-[1.15] sm:text-[32px]">{title}</h2>
      {intro && <p className="mt-3 text-[14px] leading-relaxed text-body">{intro}</p>}
    </div>
  )
}

/** The recurring bordered section shell. `hero` adds the lit gradient. */
export function Panel({
  children,
  hero,
  className,
  id,
}: {
  children: ReactNode
  hero?: boolean
  className?: string
  id?: string
}) {
  return (
    <section
      id={id}
      className={cx(
        'rounded-panel border border-line-soft shadow-panel',
        hero ? 'bg-hero' : 'bg-panel',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function Card({
  children,
  className,
  interactive,
  id,
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
  id?: string
}) {
  return (
    <div id={id} className={cx('card p-5', interactive && 'card-hover', className)}>
      {children}
    </div>
  )
}

/** Small square icon tile that sits above a card title. */
export function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-raised text-accent">
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------- Avatars */

const AVATAR_TINTS = [
  'from-[#2b4a6f] to-[#12212f]',
  'from-[#3d5a49] to-[#141f1c]',
  'from-[#5a3f5f] to-[#1e1524]',
  'from-[#5c4a2e] to-[#221a10]',
]

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Initials avatar. Drop a file in /public/avatars and pass `src` to swap in a
 * real photo — the ring and sizing stay identical.
 */
export function Avatar({
  name,
  src,
  index = 0,
  size = 40,
}: {
  name: string
  src?: string
  index?: number
  size?: number
}) {
  const dimension = { width: size, height: size }
  if (src) {
    return (
      <img
        src={src}
        alt=""
        style={dimension}
        className="shrink-0 rounded-full border border-line object-cover"
      />
    )
  }
  return (
    <span
      style={dimension}
      aria-hidden="true"
      className={cx(
        'flex shrink-0 items-center justify-center rounded-full border border-line bg-gradient-to-br font-display text-[13px] font-bold text-white/90',
        AVATAR_TINTS[index % AVATAR_TINTS.length],
      )}
    >
      {initials(name)}
    </span>
  )
}

/* ------------------------------------------------------------------ Forms */

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-white">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-faint">{hint}</span>}
    </label>
  )
}

export const inputClass =
  'w-full rounded-lg border border-line bg-[#0a121d] px-3 py-2.5 text-[13.5px] text-white placeholder:text-faint transition-colors duration-200 focus:border-accent/60'
