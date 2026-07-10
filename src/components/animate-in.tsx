import { useEffect, useRef, type ReactNode } from "react";

type Animation = "fade-in" | "fade-in-left" | "fade-in-right" | "scale-in";

export function AnimateIn({
  children,
  animation = "fade-in",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  animation?: Animation;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`animate-${animation} ${className}`}>
      {children}
    </div>
  );
}
