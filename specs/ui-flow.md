# UI Flow for "Why Did I Save This?" Browser Extension

This document outlines the complete UI flow for the extension, detailing each view, navigation controls, and interactions to ensure a smooth and intuitive user experience.

---

## 1. Global Navigation

- **Persistent Bottom Tab Bar:**  
  Available on all primary screens (Main, Cold Storage, Trash, Options) with the following tabs:
  - **Dashboard (Main)**
  - **Cold Storage (Archive)**
  - **Trash**
  - **Options (Settings)**
- **Floating Action Button (FAB):**  
  A prominent “+” button on the Dashboard that launches the Save Link modal.
- **Shortcut Activation:**  
  Pressing the designated shortcut (Ctrl+Shift+L / Cmd+Shift+L) opens the **Save Link** modal overlay pre-populated with the current page’s URL and title.

---

## 2. Views Overview

### 2.1. Save Link View (Modal Overlay)

- **Purpose:** Quickly save the current page with a required note and optional category selection.
- **Layout & Components:**
  - **Header:**
    - Title: “Save Link”
    - Close icon ("X") in the top-right corner to cancel the operation.
  - **Form Fields:**
    - **URL & Title:** Pre-populated (read-only by default, with optional edit capability).
    - **Note:** A required text area with placeholder text (e.g., "Why did you save this?").
    - **Category Selection:**  
      - Dropdown or free-text input for selecting an existing category or adding a new one.
  - **Action Buttons:**
    - **Primary:** “Save”
    - **Secondary:** “Cancel” (alternatively, use the close icon)
- **Behavior:**
  - Input validation ensures that the note is provided.
  - Upon saving or cancelling, the modal closes and returns the user to the underlying view (typically the Dashboard).

---

### 2.2. Main View (Home)

- **Purpose:** Display all saved links in a unified list with filtering and sorting capabilities.
- **Layout & Components:**
  - **Header:**
    - Large, prominent heading: “Home”
    - **Search Bar:** Directly below the heading; filters links by title, category, or note content in real time.
  - **Filter Controls:**
    - **Quick Filter Tabs:** Horizontal tabs or pill-style buttons for:
      - **Pinned**
      - **Needs Attention**
      - **Recently Opened**
    - **Category Chips:**  
      - A horizontal, scrollable list of user-created category chips (with icon and assigned color).
      - **Multi-Selection Enabled:** Users can select multiple chips; the view updates to show links that belong to any of the selected categories.
  - **Link List:**
    - **Unified Display:** Each link appears once, regardless of how many categories it belongs to.
    - **Link Card Details:**
      - **Title:** Bold and prominent at the top of the card.
      - **Note:** Displayed directly below the title, using a legible font size and high contrast to emphasize its importance.
      - **Category Badges:** Inline badges indicating all assigned categories.
      - **Additional Info:** Optionally, the date added can be shown in a subtle corner.
    - **Sorting Options:**
      - **Default Sorting:** By date added (most recent first).
      - **Custom Sorting:**  
        - A “Reorder” toggle/button in the header or options menu.
        - When activated, drag handles appear on each link card.
        - Users can drag and drop cards to create a custom order.
        - A “Done” button saves the new order, overriding the default sort order.
- **Interactions:**
  - Tapping on a link card opens additional details or actions (e.g., pin/unpin, delete).
  - The FAB remains visible to quickly add new links.

---

### 2.3. Cold Storage View (Archive)

- **Purpose:** Store links that have been auto-archived after a period of inactivity.
- **Layout & Components:**
  - **Header:**
    - Title: “Cold Storage”
    - Optional back arrow for quick return to the Dashboard.
  - **Link List:**
    - Similar in design to the Dashboard link cards.
    - Each card is styled with a subtle “Archived” indicator (e.g., grayed out or an “Archived” badge).
    - **Action:** Each card includes a “Restore” icon/button to move the link back to the main list.
  - **Search/Filter:**
    - A search bar for filtering archived links.
- **Navigation:**  
  - The Bottom Tab Bar highlights the Cold Storage tab.

---

### 2.4. Trash View

- **Purpose:** Manage soft-deleted links with options to restore or permanently delete them.
- **Layout & Components:**
  - **Header:**
    - Title: “Trash”
    - Back arrow or home button as needed.
  - **Link List:**
    - Each soft-deleted link appears as a card or list item with:
      - Title, a snippet of the note, and the deletion timestamp.
      - **Actions:** “Restore” and “Delete Permanently” buttons/icons.
    - Informational banner indicating that items will be permanently deleted after a configurable period (default 7 days).
  - **Search/Filter:**
    - A search bar may be provided if the list grows long.
- **Navigation:**  
  - The Bottom Tab Bar highlights the Trash tab.

---

### 2.5. Options (Settings) View

- **Purpose:** Provide configuration options for the extension.
- **Layout & Components:**
  - **Header:**
    - Title: “Options” or “Settings”
  - **Settings Sections:**
    - **General Settings:**
      - Configure the auto-clear period for trashed links (default 7 days; adjustable).
      - Set rules for auto-archiving (specify categories and inactivity periods).
    - **Data Management:**
      - **Import/Export:** Buttons for JSON-based data import/export.
      - **Backup:** Option to generate and store a local backup file.
    - **UI/UX Preferences:**
      - Shortcut remapping interface to change the default keyboard shortcut.
- **Navigation:**  
  - The Bottom Tab Bar highlights the Options tab.
  - A “Back” or “Home” button in the header can quickly return to the Dashboard.

---

## 3. Navigation Flow Summary

1. **Launching the Extension:**
   - **Icon Click:** Opens the Dashboard (Main View) with the Bottom Tab Bar visible.
   - **Shortcut Activation:** Opens the Save Link modal overlay directly, pre-filled with current page details.
2. **Adding a Link:**
   - Triggered via the FAB or shortcut → Save Link modal appears → After saving/cancelling, return to the Dashboard.
3. **Filtering & Sorting:**
   - **Dashboard:** Use the search bar, quick filter tabs, and horizontal category chips to filter the unified list.
   - **Custom Sorting:** Activate “Reorder” mode to drag and drop link cards and then save the custom order.
4. **Managing Archived & Deleted Links:**
   - Navigate to Cold Storage and Trash via the Bottom Tab Bar.
   - Use provided actions (Restore, Delete Permanently) within each view.
5. **Configuring Settings:**
   - Access Options from the Bottom Tab Bar to manage general settings, data management, and UI preferences.

---

## 4. Interaction Highlights & UX Considerations

- **Consistent Visual Hierarchy:**
  - **Dashboard Link Cards:** Emphasize the note (main content) below a bold title.
  - **Category Badges:** Use distinct colors and icons for easy recognition.
- **Responsive Filtering:**
  - Real-time updates as users type in the search bar or select category chips.
- **User Feedback:**
  - Visual indicators (e.g., animations, tooltips) when entering drag & drop mode or when actions like restore/delete are performed.
- **Simplicity and Efficiency:**
  - Eliminating tags in favor of categories reduces cognitive load and simplifies the UI.
  - The unified link list prevents duplication and provides a clear overview regardless of how many categories a link belongs to.
