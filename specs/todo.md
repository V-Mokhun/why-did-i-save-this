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

## 4. Categorization & Organization
- [ ] **UI Enhancements**
  - [ ] Update `popup.tsx` to allow users to create new categories.
  - [ ] Enable assigning colors/icons (including emoji support) to categories.
- [ ] **Data Model Updates**
  - [ ] Modify the saved link data model to include one or more categories.
- [ ] **Category Management**
  - [ ] Implement functions to add, edit, and manage categories.
- [ ] **Display Organization**
  - [ ] Organize and display saved links by category in the popup.
  - [ ] Ensure real-time UI updates when links or categories change.

---

## 5. Reminder System Implementation
- [ ] **Define Reminder Logic**
  - [ ] Set conditions to flag links not opened within a configurable timeframe (default: 7 days).
- [ ] **UI for Reminders**
  - [ ] Add a "Needs Attention" section in the popup.
  - [ ] Display visual cues (e.g., color-coded badges, glow effects) for overdue links.
- [ ] **Optional Extension Badge**
  - [ ] (Optional) Add functionality to display a badge on the extension icon indicating pending reminders.

---

## 6. Cold Storage (Auto-Archiving)
- [ ] **Auto-Archiving Logic**
  - [ ] Implement functionality to auto-archive links not accessed within a configurable timeframe (default: 30 days).
- [ ] **Category Exclusions**
  - [ ] Exclude specific categories (e.g., "Pinned") from auto-archiving.
- [ ] **Pre-Archive Notifications**
  - [ ] Provide notifications (e.g., "5 links will be archived tomorrow") in the UI.
- [ ] **Archived Links View**
  - [ ] Create a dedicated view in the popup to display archived links.
  - [ ] Implement functionality to restore archived links to active status.

---

## 7. Deletion & Undo System
- [ ] **Deletion Options**
  - [ ] Implement soft deletion (removing a link from a category).
  - [ ] Implement full deletion (moving a link to a Trash view).
- [ ] **Trash Management**
  - [ ] Create a Trash view to display deleted links.
  - [ ] Allow users to restore or permanently delete links from Trash.
- [ ] **Undo Feature**
  - [ ] After a deletion, display an undo banner with a 15-second reversal option.

---

## 8. Dark Mode Implementation
- [ ] **Add Dark Mode Styles in popup.css**
  - [ ] Define alternative color schemes for backgrounds, text, and elements in dark mode
- [ ] **Implement Dark Mode Toggle in popup.js**
  - [ ] Detect system dark mode preferences using media queries or browser APIs
  - [ ] Add a toggle control in popup.html to switch between dark and light modes
  - [ ] Persist the user's dark mode preference using local storage

---

## 9. Minimal Onboarding Flow
- [ ] **Onboarding UI in popup.html**
  - [ ] Add an onboarding section with a friendly message ("Save your first link!") and a highlighted action button
- [ ] **Onboarding Logic in popup.js**
  - [ ] Check via local storage whether the user is new to the extension
  - [ ] Display the onboarding message if the user has not saved any links yet
  - [ ] Automatically hide the onboarding message once the first link is saved

---

## 10. Backup & Data Export
- [ ] **Backup Functionality**
  - [ ] Develop a function to generate a local backup file in JSON format.
- [ ] **Export/Import Options**
  - [ ] Add UI options for exporting saved data as JSON.
  - [ ] Implement functionality for importing JSON data.
- [ ] **User Feedback**
  - [ ] Provide clear notifications upon successful backup, export, or import actions.

---

## 11. Integration, Error Handling & Testing
- [ ] **Module Integration**
  - [ ] Wire together all modules: popup UI, link saving, categorization, reminders, cold storage, deletion/undo, and backup.
- [ ] **Error Handling**
  - [ ] Implement error handling for storage operations and duplicate detection.
  - [ ] Display clear, actionable error messages to users.
- [ ] **Testing Setup**
  - [ ] Set up unit tests for core functionalities (e.g., link saving, duplicate detection, reminder triggering).
  - [ ] Set up integration tests simulating complete user workflows.
  - [ ] Conduct cross-browser testing using webextension-polyfill.
- [ ] **Documentation**
  - [ ] Add comprehensive code comments and documentation for maintainability.

---

## Final Steps
- [ ] **Beta Release**
  - [ ] Conduct internal testing.
  - [ ] Prepare for a public beta release for user feedback.
- [ ] **Refinement**
  - [ ] Iterate based on testing and user feedback.
  - [ ] Finalize all features and polish UI/UX.
