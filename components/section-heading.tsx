export default function SectionHeading({
  children,
  prefix = "*",
}: {
  children: React.ReactNode;
  prefix?: string;
}) {
  return (
    <h2 className="mb-4 text-sm font-normal lowercase text-fg-muted">
      <span className="text-fg-subtle mr-1">{prefix}</span> {children}
    </h2>
  );
}
