const sizes = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-9 w-9",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
  hero: "h-32 w-32",
};

const animations = {
  none: "",
  bounce: "logo-bounce-in",
  spin: "logo-spin-in",
  "bounce-spin": "logo-bounce-spin",
};

export default function Logo({ size = "md", animation = "bounce", className = "", alt = "Anon" }) {
  return (
    <img
      src="/anonlogo.png"
      alt={alt}
      className={`rounded-full object-cover shadow-sm ring-2 ring-white/60 ${sizes[size] || sizes.md} ${animations[animation] || ""} ${className}`}
      decoding="async"
    />
  );
}
