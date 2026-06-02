import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const categories = [
  { label: "General", color: "#F7D6E0" },
  { label: "Crush", color: "#F9C5D1" },
  { label: "Confession", color: "#BCD4E6" },
  { label: "Advice", color: "#F8EDE3" },
];

export default function PublicInboxPage() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState("");

  const prompt = useMemo(() => `Send an anonymous message to @${username}`, [username]);

  const submit = async (e) => {
    e.preventDefault();
    await api.post(`/messages/${username}`, { text: message, category: category.label, cardColor: category.color });
    setMessage("");
    setStatus("Sent anonymously.");
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h2 className="font-title text-4xl">{prompt}</h2>
      <p className="mt-2 text-sm text-ink/70">No sender identity is collected or displayed.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {categories.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setCategory(item)}
              className="rounded-full px-3 py-1 text-xs border"
              style={{ backgroundColor: item.color }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <textarea
          className="input min-h-36"
          placeholder="Write your anonymous message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="rounded-full bg-ink text-white px-5 py-2">Send</button>
      </form>
      {status && <p className="mt-3 text-sm text-green-700">{status}</p>}
    </main>
  );
}
