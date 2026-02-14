import TextScramble from "@/components/text-scramble";

export default function IdentityBlock() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-medium">
        <TextScramble text="silas sao" />
      </h1>
      <p className="text-lg text-fg-muted leading-relaxed">
        Software engineer turned product designer, working on AI. Currently
        a design director at IBM working on data for AI.
      </p>
    </div>
  );
}
