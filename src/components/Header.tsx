import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-emerald-700">
          🏸 Toronto Badminton Drop-in
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-emerald-700">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
