import { useEffect, useRef, useState } from "react";

type SmartImageProps = {
  /** Optimized source (webp). */
  src: string;
  /** Original source used as an automatic fallback if webp fails. */
  fallback?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
};

/**
 * Robust image renderer:
 * - reserves layout space (no shift) and shows a shimmer until decoded
 * - lazy + async decoding by default, eager/high-priority for the hero
 * - falls back to the original file, then retries once on network failure
 */
export function SmartImage({
  src,
  fallback,
  alt,
  width,
  height,
  className = "",
  wrapperClassName = "",
  priority = false,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  // Images restored from cache can complete before hydration attaches onLoad.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const failed = attempt > 1;
  const activeSrc = failed && fallback ? fallback : src;
  const cacheBust = attempt === 1 ? `${activeSrc.includes("?") ? "&" : "?"}retry=1` : "";

  return (
    <span
      className={`relative block overflow-hidden ${wrapperClassName}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {!loaded && (
        <span aria-hidden="true" className="img-shimmer absolute inset-0 block rounded-[inherit]" />
      )}
      <picture>
        {!failed && fallback && <source srcSet={src} type="image/webp" />}
        <img
          ref={imgRef}
          src={`${activeSrc}${cacheBust}`}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setAttempt((a) => (a < 2 ? a + 1 : a))}
          className={`relative h-full w-full transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        />
      </picture>
    </span>
  );
}
