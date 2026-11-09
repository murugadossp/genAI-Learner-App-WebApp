import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";
// /studio is a design preview and is not served in production.
const production =
  process.env.VERCEL_ENV === "production" ||
  process.env.APP_ENV === "production";
export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link className="skip" href="#main">
        Skip to content
      </Link>
      <header>
        <Link className="brand" href="/">
          <span className="brand-icon">
            g<span>↗</span>
          </span>
          genai<span className="brand-light">/ learner</span>
        </Link>
        <nav aria-label="Main">
          {production ? (
            <>
              <Link href="/course/chapter-1">AI foundations</Link>
              <Link href="/course">How language models work</Link>
            </>
          ) : (
            <>
              <Link href="/studio">Explore</Link>
              <Link href="/studio#catalog">Learning paths</Link>
            </>
          )}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          {!production && (
            <Link className="button small" href="/studio">
              Enter the studio <span>↗</span>
            </Link>
          )}
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer>
        <Link className="brand" href="/">
          genai / learner
        </Link>
        <span>Build understanding. Then build something.</span>
        <span className="demo-label">INTERACTIVE DESIGN PREVIEW</span>
      </footer>
    </>
  );
}
