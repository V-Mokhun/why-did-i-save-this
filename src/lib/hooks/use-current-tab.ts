import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

export function useCurrentTab() {
  const [currentTab, setCurrentTab] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    const getCurrentTab = async () => {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const activeTab = tabs[0];
      if (activeTab?.url && activeTab?.title) {
        setCurrentTab({
          url: activeTab.url,
          title: activeTab.title,
        });
      }
    };

    getCurrentTab();
  }, []);

  return currentTab;
}
