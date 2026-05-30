type Props = {
  uri?: string;
  name?: string;
  size?: number;
};

function initialsFromName(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase() || "?";
}

export function Avatar({ uri, name, size = 40 }: Props) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-sunken"
    >
      {uri ? (
        <img
          src={uri}
          alt={name ?? "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="font-inter font-semibold text-ink-secondary"
          style={{ fontSize: size * 0.36 }}
        >
          {initialsFromName(name)}
        </span>
      )}
    </span>
  );
}
