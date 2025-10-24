import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-4 py-8 sm:px-8 sm:py-14 md:px-16">
        <div className="max-w-4xl">
          {/* Logo */}
          <div className="mb-8 sm:mb-12">
            <Image
              src="/logo.svg"
              alt="Silas Sao"
              width={120}
              height={40}
              className="h-12 sm:h-16 w-auto"
            />
          </div>

          {/* Hero Section */}
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-[-2.1px]">
              My name is Silas. I'm a software engineer turned product designer, working on AI.
            </h1>
          </div>

          {/* Bio Section */}
          <div className="mb-12 sm:mb-16 max-w-3xl">
            <p className="mb-4 text-base text-gray-300">
              I was born in Hawaii and now live in the Pacific Northwest. As a lifelong learner, I'm completely self-taught. I devote my time to experimenting with emerging technologies and exploring how they shape human behavior. Being around passionate builders and makers energizes me. I have a high bar for quality and am obsessed with every detail.
            </p>
            <p className="text-base text-gray-300">
              Currently, you can find me leading design at IBM, working on agentic developer tools, or writing the next post for{" "}
              <a href="http://userinference.substack.com/" target="_blank" className="underline hover:no-underline text-white">
                my newsletter
              </a>
              .
            </p>
          </div>

          {/* Social Links */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-wrap gap-4 sm:gap-6 text-base">
              <a href="https://www.linkedin.com/in/silassao/" target="_blank" className="underline hover:no-underline">LinkedIn</a>
              <a href="https://x.com/silassao" target="_blank" className="underline hover:no-underline">X</a>
              <a href="https://www.instagram.com/silassao/" target="_blank" className="underline hover:no-underline">Instagram</a>
              <a href="http://userinference.substack.com/" target="_blank" className="underline hover:no-underline">Substack</a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs sm:text-sm text-gray-400">
            © Silas Sao 2025
          </div>
        </div>
      </main>
    </div>
  );
}
