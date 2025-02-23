import { Button } from "@/components/ui/button";
import { View } from "@/lib/types";
import { Archive, BookmarkPlus, Home, Settings, Trash2 } from "lucide-react";

interface PopupNavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onSaveLinkClick: () => void;
}

export const PopupNavigation = ({
  currentView,
  onViewChange,
  onSaveLinkClick,
}: PopupNavigationProps) => {
  const tabs: { id: View; label: string; icon: React.ReactNode }[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-4 w-4" />,
    },
    {
      id: "cold-storage",
      label: "Cold Storage",
      icon: <Archive className="h-4 w-4" />,
    },
    {
      id: "trash",
      label: "Trash",
      icon: <Trash2 className="h-4 w-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <nav className="border-t p-2 flex items-center justify-between gap-1">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={currentView === tab.id ? "default" : "ghost"}
          className="flex-1"
          onClick={() => onViewChange(tab.id)}
        >
          {tab.icon}
          <span className="sr-only">{tab.label}</span>
        </Button>
      ))}
      <Button
        variant="default"
        size="icon"
        className="bg-primary"
        onClick={onSaveLinkClick}
      >
        <BookmarkPlus className="h-4 w-4" />
        <span className="sr-only">Save Link</span>
      </Button>
    </nav>
  );
};
