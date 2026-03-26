export default function colorFromUuid(uuid) {
  let hash = 0;

  for (let i = 0; i < uuid.length; i++) {
    hash = (hash * 31 + uuid.charCodeAt(i)) >>> 0;
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 55%)`;
}
