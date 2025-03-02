import browser from "webextension-polyfill";
import { updateBadge } from "@/lib/reminder";

console.log("background script loaded");

// Update the badge when the extension is loaded
updateBadge();

// Listen for storage changes to update the badge
browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.links) {
    updateBadge();
  }
});

// Update the badge periodically (every hour)
setInterval(updateBadge, 60 * 60 * 1000);
