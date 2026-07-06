import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/10 bg-white/85 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-lg shadow-sm">
            🏸
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Toronto{" "}
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              Drop-in Sports
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1.5 text-sm font-medium sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/programs"
            className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-white shadow-sm transition hover:bg-emerald-700"
          >
            All programs
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
