import React, { useState, useRef, useEffect } from "react";

/**
 * OptimizedImage — A performance-first image component.
 *
 * Features:
 * - Skeleton shimmer while loading (prevents CLS)
 * - Smooth fade-in on load
 * - Native lazy loading + decoding="async" by default
 * - Enforced width/height to reserve layout space
 * - Optional fetchPriority="high" for LCP images
 * - Error fallback
 */

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Image source URL */
  src: string;
  /** Alt text (required for a11y) */
  alt: string;
  /** Intrinsic or display width — used to reserve layout space and prevent CLS */
  width: number;
  /** Intrinsic or display height — used to reserve layout space and prevent CLS */
  height: number;
  /** If true, loads eagerly with fetchPriority="high" (use for LCP/hero images) */
  priority?: boolean;
  /** CSS class for the <img> element itself */
  className?: string;
  /** CSS class for the outer wrapper div */
  wrapperClassName?: string;
  /** Responsive sizes attribute hint for the browser */
  sizes?: string;
}

const ERROR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  wrapperClassName = "",
  sizes,
  ...rest
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the image is already cached by the browser, onLoad may fire before
  // the effect runs — handle that case.
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  const handleLoad = () => setLoaded(true);
  const handleError = () => {
    setError(true);
    setLoaded(true); // Stop showing skeleton
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 ${wrapperClassName}`}
        style={{ width: "100%", aspectRatio: `${width}/${height}` }}
      >
        <img
          src={ERROR_PLACEHOLDER}
          alt="Failed to load image"
          width={88}
          height={88}
          className="opacity-40"
        />
      </div>
    );
  }

  return (
    <div
      className={`optimized-img-wrapper relative overflow-hidden ${wrapperClassName}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {/* Skeleton shimmer shown until image loads */}
      {!loaded && (
        <div
          className="absolute inset-0 bg-white/5 animate-pulse"
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        {...rest}
      />
    </div>
  );
}
