export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-900/10 bg-white dark:border-white/10 dark:bg-slate-900/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            🏸 Toronto Badminton Drop-in
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Every badminton drop-in session at Toronto community centres, in
            one place.
          </p>
        </div>
        <div className="max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          <p>
            Schedules are sourced from the{" "}
            <a
              href="https://open.toronto.ca/dataset/registered-programs-and-drop-in-courses-offering/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
            >
              City of Toronto&apos;s open data
            </a>{" "}
            and refresh regularly. This site is not affiliated with the City of
            Toronto — always confirm details with the community centre before
            attending.
          </p>
        </div>
      </div>
    </footer>
  );
}
