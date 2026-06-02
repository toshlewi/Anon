import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { mediaUrl } from "../utils/mediaUrl";

const emptyForm = {
  title: "",
  mediaType: "image",
  imageUrl: "",
  videoUrl: "",
  description: "",
  businessContact: "",
  link: "",
  slot: "send",
  active: true,
};

export default function AdminPage() {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/admin/ads/all").then(({ data }) => setAds(data));

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setVideoFile(null);
    setEditingId(null);
  };

  const startEdit = (ad) => {
    setEditingId(ad._id);
    setForm({
      title: ad.title,
      mediaType: ad.mediaType,
      imageUrl: ad.imageUrl || "",
      videoUrl: ad.videoUrl || "",
      description: ad.description || "",
      businessContact: ad.businessContact || "",
      link: ad.link,
      slot: ad.slot,
      active: ad.active,
    });
    setImageFile(null);
    setVideoFile(null);
    setSuccess("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildFormData = () => {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "active") data.append(key, String(value));
      else data.append(key, value ?? "");
    });
    if (imageFile) data.append("image", imageFile);
    if (videoFile) data.append("video", videoFile);
    return data;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const data = buildFormData();
      if (editingId) {
        const res = await api.patch(`/admin/ads/${editingId}`, data);
        setSuccess(res.data.message || "Ad updated successfully.");
      } else {
        const res = await api.post("/admin/ads", data);
        setSuccess(res.data.message || "Ad created successfully.");
      }
      resetForm();
      load();
    } catch (err) {
      const msg = err.response?.data?.message || "Could not save ad.";
      setError(
        err.response?.status === 403
          ? `${msg} Add ADMIN_EMAILS=${user?.email || "your@email.com"} to server/.env, restart the server, then log out and log in again.`
          : msg,
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this ad permanently?")) return;
    try {
      const res = await api.delete(`/admin/ads/${id}`);
      setSuccess(res.data.message || "Ad deleted.");
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete ad.");
    }
  };

  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : form.imageUrl ? mediaUrl(form.imageUrl) : "";
  const videoPreview = videoFile ? URL.createObjectURL(videoFile) : form.videoUrl ? mediaUrl(form.videoUrl) : "";

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="font-title text-4xl text-white drop-shadow">Admin Advertising Panel</h2>
      <p className="mt-1 text-white/90 text-sm max-w-2xl">
        Homepage slots (hero / sidebar / footer) scroll right-to-left at the bottom of the home page. Send page ads pop up on the right when someone opens a shared link (mobile-friendly).
      </p>
      {user?.role === "admin" && (
        <p className="mt-1 text-white/75 text-xs">Signed in as admin · {user.email}</p>
      )}

      {success && (
        <p className="mt-4 rounded-xl bg-green-100 border border-green-300 px-4 py-3 text-green-800 font-medium">
          {success}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-red-100 border border-red-300 px-4 py-3 text-red-800">{error}</p>
      )}

      <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-2 rounded-2xl bg-white/95 p-5 border border-rose/30">
        <input
          className="input"
          placeholder="Ad title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <select
          className="input"
          value={form.mediaType}
          onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
        >
          <option value="image">Image Ad</option>
          <option value="video">Video Ad</option>
          <option value="poster">Poster Ad</option>
          <option value="text">Text Ad</option>
        </select>

        {form.mediaType === "poster" && (
          <>
            <label className="md:col-span-2 text-sm font-medium text-ink">
              Poster image (from your device)
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
            <label className="md:col-span-2 text-sm font-medium text-ink">
              Poster video (from your device)
              <input
                type="file"
                accept="video/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </label>
            <input
              className="input md:col-span-2"
              placeholder="Or paste image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <input
              className="input md:col-span-2"
              placeholder="Or paste video URL"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="md:col-span-2 h-36 w-full rounded-xl object-cover" />
            )}
            {videoPreview && (
              <video src={videoPreview} controls className="md:col-span-2 h-36 w-full rounded-xl object-cover" />
            )}
          </>
        )}

        {form.mediaType === "image" && (
          <>
            <label className="md:col-span-2 text-sm font-medium text-ink">
              Upload image from your device
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </label>
            <input
              className="input md:col-span-2"
              placeholder="Or paste image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="md:col-span-2 h-36 w-full rounded-xl object-cover" />
            )}
          </>
        )}

        {form.mediaType === "video" && (
          <>
            <label className="md:col-span-2 text-sm font-medium text-ink">
              Upload video from your device
              <input
                type="file"
                accept="video/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </label>
            <input
              className="input md:col-span-2"
              placeholder="Or paste video URL"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            />
            {videoPreview && (
              <video src={videoPreview} controls className="md:col-span-2 h-36 w-full rounded-xl object-cover" />
            )}
          </>
        )}

        <textarea
          className="input md:col-span-2 min-h-20"
          placeholder="Business description / advert words"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="input"
          placeholder="Advert contact (phone/email)"
          value={form.businessContact}
          onChange={(e) => setForm({ ...form, businessContact: e.target.value })}
        />
        <input
          className="input"
          placeholder="Target link (https://...)"
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          required
        />
        <select className="input" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })}>
          <option value="send">Send page (popup on shared links)</option>
          <option value="footer">Homepage bottom marquee (recommended)</option>
          <option value="hero">Homepage marquee</option>
          <option value="sidebar">Homepage marquee</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Active (visible on site)
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="rounded-full bg-rose px-5 py-2 text-white disabled:opacity-60">
            {saving ? "Saving…" : editingId ? "Update Ad" : "Create Ad"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-full border border-ink/30 px-5 py-2">
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <section className="mt-8">
        <h3 className="font-title text-2xl text-white mb-4">Your ads ({ads.length})</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {ads.map((ad) => (
            <article key={ad._id} className="rounded-xl border border-rose/30 bg-white p-4">
              {ad.mediaType === "image" && ad.imageUrl && (
                <img src={mediaUrl(ad.imageUrl)} alt={ad.title} className="h-40 w-full object-cover rounded-md" />
              )}
              {ad.mediaType === "poster" && ad.videoUrl && (
                <video
                  src={mediaUrl(ad.videoUrl)}
                  poster={ad.imageUrl ? mediaUrl(ad.imageUrl) : undefined}
                  controls
                  className="h-40 w-full rounded-md object-cover"
                />
              )}
              {ad.mediaType === "poster" && !ad.videoUrl && ad.imageUrl && (
                <img src={mediaUrl(ad.imageUrl)} alt={ad.title} className="h-40 w-full object-cover rounded-md" />
              )}
              {ad.mediaType === "video" && ad.videoUrl && (
                <video src={mediaUrl(ad.videoUrl)} controls className="h-40 w-full rounded-md object-cover" />
              )}
              <h3 className="mt-2 font-semibold">{ad.title}</h3>
              <p className="text-xs uppercase text-ink/60">
                {ad.slot} · {ad.active ? "Active" : "Paused"}
              </p>
              {ad.description && <p className="mt-1 text-sm text-inkLight line-clamp-2">{ad.description}</p>}
              {ad.businessContact && <p className="mt-1 text-xs text-ink">Contact: {ad.businessContact}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(ad)}
                  className="rounded-full bg-ink/90 px-4 py-1.5 text-sm text-white"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(ad._id)}
                  className="rounded-full border border-red-400 px-4 py-1.5 text-sm text-red-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
