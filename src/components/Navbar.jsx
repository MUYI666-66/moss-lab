const NAV_ITEMS = ['Pricing', 'About Moss', 'Research', 'Login'];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-10 backdrop-blur-md bg-moss-bg/30 border-b border-white/5">
      <a
        href="#"
        className="text-sm font-semibold tracking-widest uppercase text-moss-text/90 hover:text-moss-accent-light transition-colors duration-500"
      >
        Moss Lab
      </a>

      <div className="flex items-center gap-6 md:gap-8">
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href="#"
            className="text-xs font-medium tracking-wide text-moss-muted hover:text-moss-text transition-colors duration-300"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}
