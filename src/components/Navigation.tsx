import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Image, Video, Headphones } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Bot },
    { path: "/text", label: "Text", icon: FileText },
    { path: "/image", label: "Image", icon: Image },
    { path: "/video", label: "Video", icon: Video },
    { path: "/audio", label: "Audio", icon: Headphones },
  ];

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AI Detector</span>
          </Link>
          
          <div className="flex space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Button
                key={path}
                variant={location.pathname === path ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to={path} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;