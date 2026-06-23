const Logo = ({ compact = false }) => (
  <span className="inline-flex items-center gap-2.5" aria-label="OpportunityX">
    <span
      className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-black text-white shadow-lg shadow-indigo-500/20"
      aria-hidden="true"
    >
      OX
      <span className="absolute right-1 top-0 text-[9px] text-indigo-100">✦</span>
    </span>
    {!compact && (
      <span className="text-xl font-extrabold tracking-tight text-current">
        Opportunity<span className="text-indigo-500">X</span>
      </span>
    )}
  </span>
);

export default Logo;
