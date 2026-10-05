/**
 * Global Background Layer
 *
 * Decommissioned per the approved Editorial Engineering specification.
 * The page canvas is rendered as a calm, solid ground (#0B0E14) via theme tokens.
 * This component returns null to eliminate the 30fps canvas loop, memory allocations,
 * and sci-fi dataflow animations while preserving RootLayout component structure.
 */
export default function AnimatedBackground() {
  return null;
}
