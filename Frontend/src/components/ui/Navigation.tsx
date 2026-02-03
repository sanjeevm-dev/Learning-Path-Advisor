// Top navigation bar
import { NavLink } from "react-router-dom";
import { BookOpen, Sparkles, LayoutDashboard } from "lucide-react";

function Navigation() {
  const navItems = [
    { href: "/", label: "Library", icon: BookOpen },
    { href: "/advisor", label: "AI Advisor", icon: Sparkles },
    { href: "/admin", label: "Manage", icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
            L
          </div>
          <span className="font-bold text-xl tracking-tight">LevelUp</span>
        </NavLink>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navigation;
