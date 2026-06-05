import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { isGoogleAuthEnabled } from "../utils/googleAuth";

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get("mode") === "register");
  const [form, setForm] = useState({ name: "", username: "", identifier: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const heading = useMemo(() => (isRegister ? "Create your Anon account" : "Welcome back to Anon"), [isRegister]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const route = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? {
            name: form.name.trim(),
            username: form.username.trim().toLowerCase(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }
        : { identifier: form.identifier.trim(), password: form.password };
      const { data } = await api.post(route, payload);
      setSession(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      const apiMsg = err?.response?.data?.message;
      const apiDetail = err?.response?.data?.error;
      setError(
        apiDetail
          ? `${apiMsg || "Authentication failed"}. (${apiDetail})`
          : apiMsg || "Authentication failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = (mode) => {
    const nextRegister = mode === "register";
    setIsRegister(nextRegister);
    setError("");
    setSearchParams(nextRegister ? { mode: "register" } : {});
  };

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-8 md:py-12 overflow-hidden">
      <div className="auth-float-orb absolute -top-8 left-[10%] h-40 w-40 rounded-full bg-rose/35 blur-3xl pointer-events-none" />
      <div className="auth-float-orb absolute bottom-0 right-[5%] h-52 w-52 rounded-full bg-skywarm/40 blur-3xl pointer-events-none" style={{ animationDelay: "1.2s" }} />
      <div className="auth-float-orb absolute top-1/3 right-[20%] h-24 w-24 rounded-full bg-white/50 blur-2xl pointer-events-none" style={{ animationDelay: "2s" }} />

      <div className="relative flex flex-col items-center text-center mb-8">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-rose/25 blur-2xl scale-125 logo-glow-pulse" />
          <Logo size="hero" animation="bounce-spin" key={isRegister ? "register" : "login"} />
        </div>
        <p className="mt-4 font-title text-2xl md:text-3xl text-ink">Anon</p>
        <p className="mt-1 text-sm text-inkLight">Anonymous messages · Built by Tosh Developers</p>
      </div>

      <div className="auth-gradient-border p-[2px] rounded-3xl shadow-2xl">
        <div className="grid overflow-hidden rounded-[22px] bg-white/90 backdrop-blur-xl lg:grid-cols-2">
          <section className="relative p-8 md:p-10 bg-gradient-to-br from-cream via-beige to-white hidden lg:block">
            <img src="/heart-illustration.svg" alt="" className="h-48 w-full rounded-2xl object-cover opacity-95" />
            <h2 className="mt-6 text-3xl font-bold text-ink leading-tight">{heading}</h2>
            <p className="mt-3 text-inkLight leading-relaxed">
              {isRegister
                ? "Create a username, set a secure password, and start receiving anonymous support."
                : "Log in with username or email and continue reading your anonymous messages."}
            </p>
            <ul className="mt-6 space-y-2 text-sm text-ink/85">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                Private inbox for every question card
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                Share links — replies stay anonymous
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                Warm, safe community tone
              </li>
            </ul>
          </section>

          <section className="p-8 md:p-10">
            <h2 className="lg:hidden text-2xl font-bold text-ink mb-1">{heading}</h2>

            <div className="mb-6 inline-flex w-full rounded-full bg-beige p-1">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${!isRegister ? "bg-rose text-white shadow-md" : "text-ink hover:bg-white/60"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${isRegister ? "bg-rose text-white shadow-md" : "text-ink hover:bg-white/60"}`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              {isRegister && (
                <>
                  <input
                    className="input"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    className="input"
                    placeholder="Username (letters, numbers, underscore)"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                  <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </>
              )}
              {!isRegister && (
                <input
                  className="input"
                  placeholder="Email or username"
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  required
                />
              )}
              <input
                className="input"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
              {error && (
                <p className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
              )}
              <button
                disabled={submitting}
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-rose to-roseDark text-white py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition disabled:opacity-60"
              >
                {submitting ? "Please wait…" : isRegister ? "Create Account" : "Login"}
              </button>
            </form>

            {isGoogleAuthEnabled() ? (
              <>
                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-rose/25" />
                  <span className="text-xs uppercase tracking-wider text-inkLight">or</span>
                  <span className="h-px flex-1 bg-rose/25" />
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const token = credentialResponse.credential;
                        const decoded = jwtDecode(token);
                        const { data } = await api.post("/auth/google", {
                          email: decoded.email,
                          name: decoded.name,
                          googleId: decoded.sub,
                          photo: decoded.picture,
                        });
                        setSession(data.token, data.user);
                        navigate("/dashboard");
                      } catch {
                        setError("Google sign-in failed. Try email login.");
                      }
                    }}
                    onError={() => setError("Google sign-in was cancelled.")}
                  />
                </div>
              </>
            ) : null}

            <p className="mt-5 text-center text-sm text-inkLight">
              {isRegister ? "Already have an account?" : "Need a new account?"}{" "}
              <button type="button" className="font-semibold text-roseDark underline" onClick={() => switchMode(isRegister ? "login" : "register")}>
                {isRegister ? "Login here" : "Create account"}
              </button>
            </p>
            <p className="mt-3 text-center text-xs text-inkLight">
              By continuing you agree to Anon usage terms.{" "}
              <Link to="/" className="underline text-roseDark">
                Back home
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
