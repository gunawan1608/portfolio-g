type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-xs">
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className="mt-4 font-serif text-3xl leading-[1.1] tracking-[-0.02em]"
        style={{ color: "var(--ink)" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[0.9375rem] leading-[1.75]" style={{ color: "var(--ink-soft)" }}>
          {description}
        </p>
      )}
    </div>
  );
}