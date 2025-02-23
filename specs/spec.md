# "Why Did I Save This?" Developer Specification

## 1. Overview

**"Why Did I Save This?"** is a browser extension that lets users quickly save links along with a required note explaining why they saved them. It emphasizes context, organization, and long-term management through reminders, cold storage (auto-archiving), and optional local backup functionality. All data is stored locally within the browser profile to maintain user privacy.

---

## 2. Supported Browsers & Cross-Browser Compatibility

- **MVP Targets:** Chrome, Firefox, Safari
- **Future Considerations:** Edge support based on user demand.
- **API Compatibility:**  
  - Use [mozilla/webextension-polyfill](https://github.com/mozilla/webextension-polyfill) to standardize and polyfill WebExtension APIs across supported browsers.

---

## 3. Core Features

### 3.1. Saving a Link

- **Activation:**
  - **Method:** Click the extension icon or use the default shortcut (`Ctrl+Shift+L` on Windows/Linux, `Cmd+Shift+L` on macOS).  
  - **Customization:** Users can remap the shortcut via settings.
- **User Interaction:**
  - A popup appears requiring a note (e.g., "Read later", "For project research").  
  - Users may optionally add tags.
- **Data Storage:**
  - The current page’s URL, title, note, and timestamp are saved.
  - **Duplicate Handling:** A link is considered a duplicate if its URL exactly matches an existing entry. If detected, prompt the user to update the existing entry instead of creating a duplicate.

### 3.2. Categorization & Organization

- **Manual Categorization:**
  - Users create and manage custom categories.
  - Each link can be assigned to one or more categories.
  - Categories can have user-assigned colors and icons (preset options and emoji support).
- **Auto-Suggestions:**  
  - Auto-suggestions for categorization are deferred to a future release (backlogged) to keep MVP scope manageable.
- **Display:**
  - The main list displays each link only once, with badges indicating its categories.

### 3.3. User Interface & Display Components

- **Popup UI Components:**
  - **Search Bar:** Instant filtering of saved links.
  - **Pinned Links:** A dedicated section for user-pinned links.
  - **Needs Attention:** Highlights links overdue for review (see Reminder System).
  - **Categorized Lists:** Organizes links by category.
  - **Recently Opened:** Displays the last 3–5 links accessed.
  - **Drag & Drop:** Enables manual reordering of links.
- **Sorting Options:**  
  - Sort by date added, category, or revisit priority.
- **Dark Mode:**
  - Auto-detects system preferences with an option to toggle manually.

### 3.4. Reminder System

- **Conditions for Reminders:**
  - A link is marked “forgotten” if it has not been opened within a configurable timeframe (default: 7 days) or is manually scheduled for later.
- **Visual Cues:**
  - Overdue links appear in the “Needs Attention” section with color-coded badges (e.g., ⚠️ for overdue, ⏳ for scheduled).
  - A subtle glow effect emphasizes neglected links.
- **Optional Browser Badge:**  
  - A red dot on the extension icon signals pending reminders; clicking it opens the overdue links.

### 3.5. Cold Storage (Auto-Archiving)

- **Functionality:**
  - Auto-archives links not opened within a configurable timeframe (default: 30 days).
  - Specific categories (e.g., “Pinned”) are excluded from auto-archiving.
- **User Notifications & Recovery:**
  - Provide pre-archive notifications (e.g., “5 links will be archived tomorrow”).
  - Archived links are clearly marked and accessible via a dedicated “Cold Storage” view.
  - Users can restore links individually or in bulk using options such as “Restore & Pin” or “Reset Archive Timer.”

### 3.6. Deletion & Undo System

- **Deletion Options:**
  - Remove a link from a category without full deletion.
  - Fully delete a link; it then moves to Trash.
- **Trash Management:**
  - Users can restore or permanently delete links from Trash.
  - Trash auto-clears after a configurable period (default range: 7–30 days).
- **Undo Feature:**
  - After any delete or significant action, display an undo banner with a 15-second window for the user to reverse the action.

### 3.7. Backup & Data Export

- **Local Backup Option:**
  - Provide functionality to generate and store a local backup file.
  - Offer optional JSON import/export for data transfer or recovery.

---

## 4. Architecture & Implementation

### 4.1. Frontend

- **Technology Stack:**
  - Built with HTML, CSS, and JavaScript.
  - For MVP, decide between a modern framework (e.g., React) or vanilla JS based on complexity and timeline.
- **UI/UX Considerations:**
  - Optimize the popup design for speed and ease-of-use.
  - Ensure responsive design to support various screen sizes.
- **Storage:**
  - Use browser extension storage APIs (e.g., Chrome Storage API, IndexedDB) via webextension-polyfill for efficient, cross-browser local storage.

### 4.2. Future Backend Considerations

- **MVP Approach:**  
  - No backend; all data remains local.
- **Future Enhancements:**
  - Explore secure cloud sync or backup services if user demand increases, ensuring robust encryption and privacy.

### 4.3. Permissions

- **Required Permissions:**
  - **Active Tab:** To capture the current page's URL and title.
  - **Storage:** For saving links, categories, settings, and backup files locally.
  - **Notifications:** If enhanced reminder notifications are implemented in the future.
  - **Optional:** Additional permissions might be needed if extended file system access is required for backup operations.

---

## 5. Error Handling & Edge Cases

### 5.1. Duplicate Detection

- **Mechanism:**  
  - Compare new link URLs against existing entries for an exact match.
  - Prompt the user to update the existing entry if a duplicate is found.

### 5.2. User Input & Accidental Popup Closure

- **Auto-Recovery:**  
  - Implement a temporary cache for unsaved user input in the popup, ensuring recovery if the popup is accidentally closed.
- **Handling Storage Errors:**  
  - Detect and gracefully handle any errors from local storage operations.
  - Display clear, actionable error messages and log errors locally for debugging.

### 5.3. Performance & Scalability

- **Scalability:**  
  - Design for efficient performance even with hundreds of saved links.
  - Consider indexing or lazy-loading strategies to keep the search/filter functionality fast and responsive.

---

## 6. Testing Plan

### 6.1. Unit Testing

- **Functionality:**
  - Validate link saving, duplicate detection, and retrieval operations.
  - Test backup file creation and JSON import/export functionalities.
  - Ensure reminders trigger as per user-configured settings.
  
### 6.2. UI/UX Testing

- **Visual & Interaction:**
  - Test the popup UI across different screen sizes and browsers.
  - Verify the functionality of drag-and-drop reordering.
  - Ensure shortcut remapping works without conflicts.
  - Confirm that dark mode activates correctly and the toggle functions as expected.
- **Undo Feature:**
  - Validate that the undo banner remains available for 15 seconds and correctly reverts actions.

### 6.3. Integration Testing

- **Workflow Simulation:**
  - Run end-to-end tests simulating real user interactions including saving links, categorizing, setting reminders, auto-archiving, and restoration.
  - Verify pre-archive notifications and the transition to Cold Storage.
- **Cross-Browser Testing:**
  - Test on Chrome, Firefox, and Safari to ensure consistency using webextension-polyfill.

### 6.4. Edge Case & Stress Testing

- **Storage Limits:**
  - Simulate conditions where storage quota limits are reached, and ensure the extension handles such cases gracefully.
- **Bulk Operations:**
  - Test performance and behavior during mass operations (e.g., bulk delete or restore).

---

## 7. Next Steps for Implementation

1. **UI/UX Design:**
   - Finalize wireframes and workflow diagrams.
2. **Framework Selection:**
   - Decide between React or vanilla JavaScript based on MVP requirements.
3. **Project Setup:**
   - Set up the project environment with webextension-polyfill to ensure cross-browser support.
4. **Core Feature Development:**
   - Implement link saving, duplicate detection, manual categorization, and reminder functionality.
   - Develop Cold Storage (auto-archiving) and the deletion/undo systems.
   - Integrate backup file generation and JSON import/export features.
5. **Error Handling & Testing:**
   - Integrate error handling strategies and set up the testing framework for unit, UI/UX, integration, and edge case testing.
6. **Beta Release:**
   - Conduct internal testing before rolling out a public beta for user feedback and further refinement.
