import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({ className = "input", placeholder = "Password", value, onChange, required, minLength }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        className={`${className} pr-11`}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoComplete={placeholder.includes("Confirm") ? "new-password" : "current-password"}
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
      </button>
    </div>
  );
}
