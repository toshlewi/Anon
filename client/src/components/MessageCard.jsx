import html2canvas from "html2canvas";
import { useRef } from "react";

export default function MessageCard({ message }) {
  const ref = useRef(null);

  const downloadCard = async () => {
    const canvas = await html2canvas(ref.current);
    const link = document.createElement("a");
    link.download = `anon-message-${message._id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <article
      ref={ref}
      className="rounded-2xl p-5 shadow-md border border-white/60"
      style={{ backgroundColor: message.cardColor }}
    >
      <p className="text-xs uppercase tracking-wide text-white/90">{message.category}</p>
      <p className="mt-2 font-card text-3xl leading-snug text-white drop-shadow">{message.text}</p>
      <p className="mt-3 text-[11px] text-white/85">
        {new Date(message.createdAt).toLocaleString()}
      </p>
      <p className="mt-4 text-xs text-white/90">Built by Tosh Developers</p>
      <button onClick={downloadCard} className="mt-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
        Save Card
      </button>
    </article>
  );
}
