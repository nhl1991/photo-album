export default function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-line pb-6 pt-10 sm:flex-row sm:items-end sm:justify-between md:pt-14">
      <div>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="font-serif text-[clamp(2rem,1.4rem+2.4vw,3.25rem)] leading-[1.05] tracking-tight text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-sm text-muted md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </header>
  );
}
