export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="grid-atmosphere absolute inset-0" />
      <div className="absolute top-24 left-[12%] h-40 w-40 rounded-full bg-cyan/10 blur-3xl" />
      <div className="absolute top-40 right-[8%] h-52 w-52 rounded-full bg-magenta/10 blur-3xl" />
    </div>
  );
}
