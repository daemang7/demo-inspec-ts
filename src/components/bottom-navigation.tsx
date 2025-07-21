import { Home, ClipboardList, QrCode, BarChart, Settings } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: ClipboardList, label: "Inspections", path: "/inspections" },
  { icon: QrCode, label: "Scan", path: "/scan" },
  { icon: BarChart, label: "Reports", path: "/report" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <div className="bottom-nav fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-2">
      <div className="flex justify-around items-center">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link key={path} to={path} style={{ textDecoration: "none" }}>
              <button
                className={`flex flex-col items-center py-2 px-3 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
