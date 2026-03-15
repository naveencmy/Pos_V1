import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  Wifi,
  WifiOff,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/sales", icon: ShoppingCart, label: "Sales", shortcut: "F1" },
  { path: "/purchase", icon: Package, label: "Purchase", shortcut: "F2" },
  { path: "/inventory", icon: Package, label: "Inventory", shortcut: "F3" },
  { path: "/parties", icon: Users, label: "Parties", shortcut: "F4" },
  { path: "/reports", icon: FileText, label: "Reports" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentTime = new Date();
  const isOnline = true; // Placeholder - would be real LAN status
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div
      className="h-screen bg-background flex flex-col"
      style={{
        "--sidebar-width": sidebarOpen ? "256px" : "0px",
      } as React.CSSProperties}
    >
      {/* Fixed Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-secondary rounded-sm transition text-muted-foreground hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">POS</span>
          </div>
          <h1 className="text-lg font-semibold text-foreground">RetailPOS</h1>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="text-muted-foreground">
            {currentTime.toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-[hsl(var(--success))]" />
                <span className="text-[hsl(var(--success))]">LAN Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-[hsl(var(--error))]" />
                <span className="text-[hsl(var(--error))]">Offline</span>
              </>
            )}
          </div>
          <div className="border-l border-border pl-6 flex items-center gap-3">
            <div className="text-right">
              <div className="text-foreground font-medium text-sm">John Owner</div>
              <div className="text-muted-foreground text-xs">Owner</div>
            </div>
            <button className="p-1.5 hover:bg-secondary rounded-sm transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside
          className={cn(
            "border-r border-border bg-sidebar fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300 ease-in-out z-30",
            sidebarOpen ? "w-64" : "w-0"
          )}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 rounded-sm transition whitespace-nowrap",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </div>
                  {sidebarOpen && item.shortcut && (
                    <span className="text-xs font-mono text-muted-foreground">
                      {item.shortcut}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main
          className={cn(
            "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
            sidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
