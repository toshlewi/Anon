import { mediaUrl } from "../utils/mediaUrl";

export default function AdMedia({ ad, className }) {
  if (ad.mediaType === "poster" && ad.videoUrl) {
    return (
      <video
        src={mediaUrl(ad.videoUrl)}
        poster={ad.imageUrl ? mediaUrl(ad.imageUrl) : undefined}
        className={className}
        muted
        playsInline
        loop
        autoPlay
      />
    );
  }
  if ((ad.mediaType === "poster" || ad.mediaType === "image") && ad.imageUrl) {
    return <img src={mediaUrl(ad.imageUrl)} alt={ad.title} className={className} loading="lazy" />;
  }
  if (ad.mediaType === "video" && ad.videoUrl) {
    return <video src={mediaUrl(ad.videoUrl)} className={className} muted playsInline loop autoPlay />;
  }
  if (ad.mediaType === "text") {
    return <p className="text-xs text-inkLight leading-snug line-clamp-3">{ad.description || ad.title}</p>;
  }
  return null;
}
