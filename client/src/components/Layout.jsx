import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import PageEnter from "./PageEnter";
import PageLoader from "./PageLoader";
import { useAuth } from "../context/AuthContext";
import { FiGrid, FiLogOut, FiMenu, FiPlusSquare, FiUser, FiX } from "react-icons/fi";

const Header = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-20 bg-beige/90 backdrop-blur border-b border-rose/40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 font-title text-2xl text-ink">
          <Logo size="md" animation="bounce-spin" key={location.pathname} />
          Anon
        </Link>
        <button
          className="md:hidden rounded-lg border border-rose/40 bg-white/80 p-2"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
        <nav className={`${open ? "flex" : "hidden"} md:flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 text-sm absolute md:static top-16 left-4 right-4 md:left-auto md:right-auto rounded-2xl md:rounded-none bg-white/95 md:bg-transparent p-3 md:p-0 shadow-lg md:shadow-none border md:border-0 border-rose/30`}>
          {user ? (
            <>
              <Link to="/dashboard" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-rose/15 transition">
                <FiGrid /> Dashboard
              </Link>
              <Link to="/create-card" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-rose/15 transition">
                <FiPlusSquare /> Create Card
              </Link>
              <Link to="/profile" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-rose/15 transition">
                <FiUser /> Profile
              </Link>
              {user.role === "admin" && <Link to="/admin" className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 hover:bg-rose/15 transition">Admin</Link>}
              <button onClick={logout} className="btn-primary-sm">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=register" className="rounded-full bg-white/80 px-4 py-1.5 border border-rose/40 transition hover:shadow-sm">
                Create Account
              </Link>
              <Link to="/auth" className="btn-primary-sm pulse-glow">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default function Layout({ children }) {
  const { loading } = useAuth();

  return (
    <div
      className="min-h-screen pb-16 text-ink font-body bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "linear-gradient(rgba(248,237,227,0.82), rgba(248,237,227,0.88)), url('/anonbackground.png')",
      }}
    >
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Header />
          <PageEnter>{children}</PageEnter>
        </>
      )}
      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-rose/40 bg-white/90 backdrop-blur py-2 text-center shadow-lg">
        <p className="text-sm text-ink/90">Built by Tosh Developers • Contact: 0711527211</p>
      </footer>
    </div>
  );
}
