import Logo from "./Logo";

export default function PageLoader({ message = "Loading Anon…" }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream/95 backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-rose/30 blur-2xl scale-150 logo-glow-pulse" />
        <Logo size="hero" animation="bounce-spin" />
      </div>
      <p className="mt-6 text-sm font-medium text-ink/80 tracking-wide">{message}</p>
    </div>
  );
}
