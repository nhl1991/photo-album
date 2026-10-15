import Link from "next/link";

export default function Brand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 font-serif text-base uppercase tracking-[0.3em] text-ink sm:text-lg ${className}`}
    >
      <span>Photo</span>
      <span aria-hidden="true" className="hidden h-px w-10 bg-ink/60 sm:block" />
      <span>Album</span>
    </Link>
  );
}
