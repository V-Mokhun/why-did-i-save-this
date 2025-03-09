import { Toaster } from "@/components/ui/sonner";
import {
  ColdStorageView,
  HomeView,
  SaveLinkView,
  SettingsView,
  TrashView,
} from "@/components/views";
import { View } from "@/lib/types";
import { useState } from "react";
import { PopupNavigation } from "./components/popup-navigation";

export default function Popup() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [isSaveLinkDialogOpen, setIsSaveLinkDialogOpen] = useState(false);

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "cold-storage":
        return <ColdStorageView onViewChange={setCurrentView} />;
      case "trash":
        return <TrashView onViewChange={setCurrentView} />;
      case "settings":
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-md">
      {/* <PopupHeader /> */}
      <main className="flex-1 pb-16">
        {renderCurrentView()}
        <SaveLinkView
          isOpen={isSaveLinkDialogOpen}
          setIsOpen={setIsSaveLinkDialogOpen}
        />
      </main>
      <PopupNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onSaveLinkClick={() => setIsSaveLinkDialogOpen(true)}
      />

      <Toaster />
    </div>
  );
}
