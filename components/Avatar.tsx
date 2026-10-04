export default function Avatar({ src, alt, size = 32 }: { src?: string | null; alt?: string; size?: number }) {
  const url = src || process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL || '/default-avatar.png';
  return (
    <img src={url} alt={alt || 'avatar'} width={size} height={size} className="rounded-full object-cover" />
  );
}
