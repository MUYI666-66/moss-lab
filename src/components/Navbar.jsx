const NAV_ITEMS = [
  { label: '用户生成', href: '#feature1' },
  { label: '交互模拟', href: '#feature2' },
  { label: '旅程分析', href: '#feature3' },
];

export default function Navbar() {
  const handleClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 md:px-10 backdrop-blur-md bg-moss-bg/60 border-b border-white/5">
      <a
        href="#"
        className="text-sm font-semibold tracking-widest uppercase text-moss-text/90 hover:text-moss-accent-light transition-colors duration-500"
      >
        麦克利兰
      </a>

      <div className="flex items-center gap-6 md:gap-8">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className="text-xs font-medium tracking-wide text-moss-muted hover:text-moss-accent-light transition-colors duration-300"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
