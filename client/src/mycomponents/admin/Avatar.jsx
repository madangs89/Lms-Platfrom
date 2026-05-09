const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Avatar({ name, size = 36, color = "green" }) {
  const palettes = {
    green: { bg: "bg-green-100", text: "text-green-700" },
    slate: { bg: "bg-slate-100", text: "text-slate-600" },
  };
  const p = palettes[color] ?? palettes.slate;
  return (
    <div
      className={`${p.bg} ${p.text} rounded-full flex items-center justify-center font-bold shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.33 }}
    >
      {initials(name)}
    </div>
  );
}

export default Avatar;
