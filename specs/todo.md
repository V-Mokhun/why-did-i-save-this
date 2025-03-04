# "Why Did I Save This?" To-Do Checklist

This checklist outlines every step required to build the "Why Did I Save This?" browser extension. Use it to track progress as you implement each feature.

## 1. Project Setup & Environment ✅

- [x] **Repository & Structure**
  - [x] Create a new project repository.
  - [x] Set up a basic directory structure:
    - `src/popup`
    - `src/background`
    - `src/assets`
- [x] **Manifest & Permissions**
  - [x] Create `manifest.json` with:
    - Name, version, description.
    - Permissions: `activeTab`, `storage`, etc.
    - Browser action or action configuration.
- [x] **Dependencies**
  - [x] Include the [mozilla/webextension-polyfill](https://github.com/mozilla/webextension-polyfill) library.
  - [x] Configure build process (Using Vite + React)

---

## 2. Basic Popup UI Implementation ✅

- [x] **Popup Implementation**
  - [x] Create Popup component with header
  - [x] Add an input field (textarea) for the note
  - [x] Add a "Save" button
- [x] **Popup Styling**
  - [x] Implement clean, responsive layout using TailwindCSS and shadcn/ui
- [x] **Popup Logic**
  - [x] Set up React component state management
  - [x] Add click handler for the "Save" button
  - [x] Implement basic console logging for verification

---

## 3. Core Link Saving Functionality ✅

- [x] **Capture Active Tab Data**
  - [x] Use WebExtension API (with polyfill) to capture the active tab's URL and title.
- [x] **Extend Popup UI**
  - [x] Add input fields for a note and optional tags.
- [x] **Local Storage Integration**
  - [x] On "Save" button click, gather:
    - URL
    - Title
    - Note
    - Timestamp
  - [x] Save this data to the browser's local storage.
- [x] **Duplicate Detection**
  - [x] Implement logic to check if a URL already exists.
  - [x] Prompt the user to update an existing entry if a duplicate is detected.

---

## 4. Categorization & Organization ✅

- [x] **UI Enhancements**
  - [x] Update `popup.tsx` to allow users to create new categories.
  - [x] Enable assigning colors/icons (including emoji support) to categories.
- [x] **Data Model Updates**
  - [x] Modify the saved link data model to include one or more categories.
- [x] **Category Management**
  - [x] Implement functions to add, edit, and manage categories.
- [x] **Display Organization**
  - [x] Organize and display saved links by category in the popup.
  - [x] Ensure real-time UI updates when links or categories change.

---

## 5. Reminder System Implementation ✅

- [x] **Define Reminder Logic**
  - [x] Set conditions to flag links not opened within a configurable timeframe (default: 7 days).
- [x] **UI for Reminders**
  - [x] Add a "Needs Attention" section in the popup.
  - [x] Display visual cues (e.g., color-coded badges, glow effects) for overdue links.
- [x] **Optional Extension Badge**
  - [x] (Optional) Add functionality to display a badge on the extension icon indicating pending reminders.

---

## 6. Cold Storage (Auto-Archiving) ✅

- [x] **Auto-Archiving Logic**
  - [x] Implement functionality to auto-archive links not accessed within a configurable timeframe (default: 30 days).
- [x] **Category Exclusions**
  - [x] Exclude specific categories (e.g., "Pinned") from auto-archiving.
- [x] **Pre-Archive Notifications**
  - [x] Provide notifications (e.g., "5 links will be archived tomorrow") in the UI.
- [x] **Archived Links View**
  - [x] Create a dedicated view in the popup to display archived links.
  - [x] Implement functionality to restore archived links to active status.

---

## 7. Deletion & Undo System ✅

- [x] **Deletion Options**
  - [x] Implement soft deletion (removing a link from a category).
  - [x] Implement full deletion (moving a link to a Trash view).
- [x] **Trash Management**
  - [x] Create a Trash view to display deleted links.
  - [x] Allow users to restore or permanently delete links from Trash.
- [x] **Undo Feature**
  - [x] After a deletion, display an undo banner with a 15-second reversal option.

---

## 8. Minimal Onboarding Flow ✅

- [x] **Onboarding UI in popup.html**
  - [x] Add an onboarding section with a friendly message ("Save your first link!") and a highlighted action button
- [x] **Onboarding Logic in popup.js**
  - [x] Check via local storage whether the user is new to the extension
  - [x] Display the onboarding message if the user has not saved any links yet
  - [x] Automatically hide the onboarding message once the first link is saved

---

## 9. Backup & Data Export ✅

- [x] **Backup Functionality**
  - [x] Develop a function to generate a local backup file in JSON format.
- [x] **Export/Import Options**
  - [x] Add UI options for exporting saved data as JSON.
  - [x] Implement functionality for importing JSON data.
- [x] **User Feedback**
  - [x] Provide clear notifications upon successful backup, export, or import actions.

---

## Final Steps

- [ ] **Beta Release**
  - [ ] Conduct internal testing.
  - [ ] Prepare for a public beta release for user feedback.
- [ ] **Refinement**
  - [ ] Iterate based on testing and user feedback.
  - [ ] Finalize all features and polish UI/UX.
