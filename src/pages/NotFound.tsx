import { ButtonLink, Eyebrow, Panel } from '../components/ui'

export default function NotFound() {
  return (
    <Panel hero className="px-5 py-16 text-center sm:px-8">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-3 text-[28px] font-bold leading-tight sm:text-[36px]">
        This page ran out of battery.
      </h1>
      <p className="mx-auto mt-3 max-w-[48ch] text-[14px] leading-relaxed text-body">
        The page you’re looking for isn’t on the field. Head back to the directory to find a peer or
        mentor.
      </p>
      <div className="mt-7 flex justify-center gap-3">
        <ButtonLink to="/">Back home</ButtonLink>
        <ButtonLink to="/mentors" variant="secondary">
          Browse mentors
        </ButtonLink>
      </div>
    </Panel>
  )
}
