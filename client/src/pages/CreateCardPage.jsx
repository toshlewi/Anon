import { useEffect, useState } from "react";
import api from "../services/api";
import { openSourceCardImages, resolveCardImage } from "../utils/cardIllustration";

const illustrationOptions = [
  { label: "General", value: openSourceCardImages.general },
  { label: "Love", value: openSourceCardImages.love },
  { label: "Secrets", value: openSourceCardImages.secrets },
  { label: "Dark Humor", value: openSourceCardImages.dark },
  { label: "Support", value: openSourceCardImages.support },
  { label: "Thoughts", value: openSourceCardImages.thoughts },
];

const initialForm = {
  title: "",
  prompt: "",
  description: "",
  icon: "💬",
  color: "#F3A6C9",
  textColor: "#ffffff",
  illustration: openSourceCardImages.general,
};

export default function CreateCardPage() {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingCardId, setEditingCardId] = useState("");

  const loadCards = () => api.get("/cards/mine").then(({ data }) => setCards(data));
  useEffect(() => {
    loadCards();
  }, []);

  const saveCard = async (e) => {
    e.preventDefault();
    if (editingCardId) {
      await api.patch(`/cards/${editingCardId}`, form);
    } else {
      await api.post("/cards", form);
    }
    setForm(initialForm);
    setEditingCardId("");
    loadCards();
  };

  const editCard = (card) => {
    setEditingCardId(card._id);
    setForm({
      title: card.title,
      prompt: card.prompt,
      description: card.description || "",
      icon: card.icon || "💬",
      color: card.color || "#F3A6C9",
      textColor: card.textColor || "#ffffff",
      illustration: card.illustration || openSourceCardImages.general,
    });
  };

  const deleteCard = async (cardId) => {
    await api.delete(`/cards/${cardId}`);
    if (editingCardId === cardId) {
      setEditingCardId("");
      setForm(initialForm);
    }
    loadCards();
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h2 className="font-title text-4xl">Create Card</h2>
      <p className="mt-2 text-inkLight">Create and manage question cards here.</p>

      <section className="mt-6 rounded-2xl border border-white/60 bg-white/75 p-5">
        <h3 className="text-xl font-bold">{editingCardId ? "Edit card" : "Create custom question card"}</h3>
        <form onSubmit={saveCard} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Card title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="input" placeholder="Icon emoji (e.g. 😈)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <input className="input md:col-span-2" placeholder="Prompt shown to anonymous senders" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} required />
          <input className="input md:col-span-2" placeholder="Optional short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label className="text-sm">
            Background color
            <input type="color" className="mt-1 h-10 w-full rounded-lg border border-rose/30 bg-white" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          </label>
          <label className="text-sm">
            Text color
            <input type="color" className="mt-1 h-10 w-full rounded-lg border border-rose/30 bg-white" value={form.textColor} onChange={(e) => setForm({ ...form, textColor: e.target.value })} />
          </label>
          <select className="input md:col-span-2" value={form.illustration} onChange={(e) => setForm({ ...form, illustration: e.target.value })}>
            {illustrationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="md:col-span-2 flex gap-2">
            <button className="rounded-full bg-rose px-4 py-2 text-white transition hover:shadow hover:-translate-y-0.5">{editingCardId ? "Save changes" : "Create card"}</button>
            {editingCardId && (
              <button type="button" onClick={() => { setEditingCardId(""); setForm(initialForm); }} className="rounded-full border border-rose/40 px-4 py-2 transition hover:bg-white">
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article key={card._id} className="rounded-2xl p-4 border border-white/50 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl" style={{ backgroundColor: card.color, color: "#fff" }}>
            <img src={resolveCardImage(card)} alt={card.title} className="h-24 w-full rounded-xl object-cover border border-white/40" loading="lazy" />
            <h4 className="text-xl font-bold">{card.title}</h4>
            <p className="text-sm mt-1 opacity-90">{card.prompt}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => editCard(card)} className="rounded-full bg-white/85 px-3 py-1 text-xs text-black transition hover:bg-white hover:shadow">
                Edit
              </button>
              <button onClick={() => deleteCard(card._id)} className="rounded-full bg-black/75 px-3 py-1 text-xs text-white transition hover:bg-black/90 hover:shadow">
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
