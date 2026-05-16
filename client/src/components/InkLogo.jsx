/**
 * Replace /logo.png with the actual transparent logo file.
 * Drop the file into client/public/ and update the src path.
 */
export default function InkLogo({ height = 56 }) {
  return (
    <img
      src="/logo.png"
      alt="Innobiz-K Ethiopia"
      height={height}
      style={{ height, width: 'auto' }}
    />
  )
}
