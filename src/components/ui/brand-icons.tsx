import type { ReactNode, SVGProps } from "react"

type BrandIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  title?: string
  color?: string
  size?: number | string
}

/**
 * The brand glyphs Simple Icons has dropped at their owners' request. Every
 * other brand comes straight from the package, imported where it is used
 * (`import { SiGithub } from "@icons-pack/react-simple-icons"`); these three
 * keep the last path Simple Icons published, on its 24 unit grid, and take the
 * package's props (title, color, size) so both read alike in a block.
 */
function BrandSvg({
  children,
  color = "currentColor",
  size = 24,
  title,
  ...props
}: BrandIconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill={color}
      viewBox="0 0 24 24"
      {...props}
    >
      <title>{title}</title>
      {children}
    </svg>
  )
}

function Linkedin(props: BrandIconProps) {
  return (
    <BrandSvg title="LinkedIn" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </BrandSvg>
  )
}

function Slack(props: BrandIconProps) {
  return (
    <BrandSvg title="Slack" {...props}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </BrandSvg>
  )
}

function Twitter(props: BrandIconProps) {
  return (
    <BrandSvg title="Twitter" {...props}>
      <path d="M23.4 4.8c-.8.4-1.7.6-2.6.7.9-.6 1.6-1.5 2-2.5-.9.5-1.9.9-2.9 1.1a4.5 4.5 0 0 0-7.8 4.1A12.8 12.8 0 0 1 2.8 3.5a4.5 4.5 0 0 0 1.4 6.1c-.7 0-1.4-.2-2-.6v.1c0 2.2 1.6 4.1 3.6 4.5-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 1.8 2.2 3.1 4.2 3.1a9.1 9.1 0 0 1-5.6 1.9c-.4 0-.7 0-1.1-.1a12.8 12.8 0 0 0 7 2c8.3 0 12.9-6.9 12.9-12.9v-.6c.9-.6 1.7-1.4 2.3-2.3Z" />
    </BrandSvg>
  )
}

export { Linkedin, Slack, Twitter }
