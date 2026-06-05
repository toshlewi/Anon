import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { validateUsername } from "../utils/validation";

export default function ProfilePage() {
  const { user, setSession } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
  });
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    const usernameError = validateUsername(form.username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    try {
      const { data } = await api.patch("/users/me", {
        ...form,
        username: form.username.trim().toLowerCase(),
      });
      const token = localStorage.getItem("anon_token");
      setSession(token, data);
      setStatus("Profile updated.");
      setTimeout(() => setStatus(""), 1600);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update profile.");
    }
  };

  const uploadPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    setUploading(true);
    const { data } = await api.post("/users/me/photo", formData);
    const token = localStorage.getItem("anon_token");
    setSession(token, data);
    setUploading(false);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h2 className="font-title text-4xl">Profile</h2>
      <p className="mt-2 text-inkLight">Edit your identity, username, bio and display photo.</p>

      <section className="mt-6 rounded-2xl border border-white/60 bg-white/75 p-5">
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePhoto ? `${import.meta.env.VITE_SERVER_URL || "http://localhost:5000"}${user.profilePhoto}` : "/anonlogo.png"}
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover border border-white"
          />
          <label className="text-sm">
            <span className="block mb-1">Upload profile photo</span>
            <input type="file" accept="image/*" onChange={uploadPhoto} />
            {uploading && <span className="ml-2">Uploading...</span>}
          </label>
        </div>

        <form onSubmit={saveProfile} className="mt-5 grid gap-3">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={80} />
          <input
            className="input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]{3,20}"
          />
          <textarea className="input min-h-32" placeholder="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} />
          <button className="btn-primary w-fit">Save profile</button>
          {error && <p className="text-sm text-red-700">{error}</p>}
          {status && <p className="text-sm text-green-700">{status}</p>}
        </form>
      </section>
    </main>
  );
}
