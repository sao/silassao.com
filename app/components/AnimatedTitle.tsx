type AnimatedTitleProps = {
  text: string;
  className?: string;
  /** Delay between each word, in milliseconds. */
  stagger?: number;
};

export default function AnimatedTitle({
  text,
  className,
  stagger = 60,
}: AnimatedTitleProps) {
  const words = text.split(" ");

  return (
    <h1 className={className} aria-label={text}>
      {words.map((word, index) => (
        <span key={index} className="inline-block" aria-hidden="true">
          <span
            className="animate-word-in inline-block"
            style={{ animationDelay: `${index * stagger}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
