import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Todo App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/todos"
            >
              Todos
            </Link>
            <Link
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/about"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* 検索バーなどを追加可能 */}
          </div>
          <nav className="flex items-center">
            {/* ユーザーメニューなどを追加可能 */}
          </nav>
        </div>
      </div>
    </header>
  );
}
