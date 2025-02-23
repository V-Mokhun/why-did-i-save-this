# Prompt 1: Project Setup & Environment

Create a new project repository for the "Why Did I Save This?" browser extension. Set up the following basic structure:

- A manifest.json file with permissions for "activeTab", "storage", and any required host permissions.
- A "src" folder containing separate directories for "popup", "background", and "assets".
- Include the mozilla/webextension-polyfill library for cross-browser support.
  Provide the content for manifest.json with the basic configuration (name, version, description, permissions, browser_action or action, etc.). Ensure the manifest is compatible with Chrome, Firefox, and Safari.

# Prompt 2: Basic Popup UI Implementation

Develop the basic popup UI for the extension. Create an HTML file (popup.html) with:

- A simple layout that includes a header, an input field for the note, and a "Save" button.
- Minimal CSS to ensure the popup looks clean and is responsive.
- A JavaScript file (popup.js) that is loaded by the HTML and sets up an event listener for the "Save" button.
  For now, when the "Save" button is clicked, log a dummy message to the console. Wire the HTML, CSS, and JS together.

# Prompt 3: Implementing Core Link Saving Functionality

Enhance the popup functionality to capture the current page's details and save them locally:

- In popup.js, use the WebExtension API (with webextension-polyfill) to capture the active tab's URL and title.
- Extend the popup.html to include input fields for a note and optional tags.
- When the "Save" button is clicked, collect the URL, title, note, and current timestamp.
- Save this data into the browser's local storage (using the storage API).
- Implement logic to detect duplicates (by checking if the URL already exists in storage). If a duplicate is found, prompt the user to update the existing entry.
  Ensure all parts are wired together so that clicking "Save" results in the data being stored correctly.

# Prompt 4: Adding Categorization & Organization

Integrate a categorization system into the extension:

- Update the UI in popup.html to allow users to create new categories and assign colors/icons to them.
- Modify the data model to allow each saved link to be assigned to one or more categories.
- In popup, implement functions to manage category creation, assignment, and listing.
- Update the popup UI to display saved links organized by category (e.g., in separate sections for each category).
  Make sure that the categorization system is fully integrated and updates in real time when links or categories change.

# Prompt 5: Implementing the Reminder System

Develop the reminder system for the extension:

- In popup.js, add logic to check the timestamp of saved links and flag any that have not been opened within a configurable timeframe (default 7 days).
- Modify the UI to include a "Needs Attention" section, where overdue links are visually highlighted (e.g., using color-coded badges or glow effects).
- (Optional) Add functionality to display a badge on the extension icon indicating the number of pending reminders.
  Ensure that this system integrates with the saved links and updates dynamically.

# Prompt 6: Building Cold Storage (Auto-Archiving)

Implement auto-archiving (Cold Storage) functionality:

- Add logic in popup.js (or a dedicated module) to automatically archive links that have not been accessed within a configurable timeframe (default 30 days).
- Exclude specific categories (e.g., "Pinned") from auto-archiving.
- Provide pre-archive notifications in the UI (e.g., "5 links will be archived tomorrow").
- Create a dedicated view in the popup for accessing archived links, and functions to restore them back to active status.
  Wire this functionality together so that auto-archiving integrates with the reminder system and overall data storage.

# Prompt 7: Developing the Deletion & Undo System

Create the deletion and undo system:

- In popup.js, add functionality for soft deletion (removing a link from a category) and full deletion (moving a link to a Trash view).
- Implement a Trash view in the popup where users can see deleted links, with options to restore or permanently delete them.
- After any delete action, display an undo banner that allows the user to reverse the deletion within 15 seconds.
  Ensure that these deletion actions and undo operations are integrated with the main storage system and UI.

# Prompt 8: Implementing Dark Mode

Detect system dark mode preferences and allow users to toggle dark mode manually.

- Update popup.css:
  - Create styles for dark mode (color scheme, backgrounds, text).
- In popup.js:
  - Detect system preferences for dark mode (using media queries or browser APIs).
  - Add a toggle control in the UI that allows users to switch between dark and light modes.
  - Ensure that the selected mode persists (via local storage) across sessions.
- Wire the dark mode styles so that they are applied seamlessly across the extension.

# Prompt 9: Implementing Backup & Data Export

Develop the backup and data export functionality:

- In popup.js, implement a function to generate a local backup file (e.g., in JSON format) of all saved data (links, categories, settings).
- Provide options in the UI for the user to export and import data as JSON.
- Ensure that the backup process is integrated with the extension’s storage system and that any imported data correctly updates the UI.
  Wire all backup functionality with appropriate user feedback.

# Prompt 9: Minimal Onboarding Flow

Provide first-time users with an onboarding message and guidance to “Save your first link!”

- In popup.html:
  - Add an onboarding section that appears only for new users.
- In popup.js:
  - Check (using local storage) whether the user has already used the extension.
  - If not, display a friendly onboarding message with a highlighted action button.
  - Once the user saves their first link, hide the onboarding message.
- Ensure that the onboarding experience is simple and non-intrusive.

# Prompt 10: Integration, Error Handling & Testing

Integrate all the previous functionalities and add robust error handling and testing hooks:

- Ensure that the modules for link saving, categorization, reminders, cold storage, deletion/undo, and backup are fully wired together.
- In popup.js, implement error handling for storage operations and user input (e.g., duplicate entries, storage quota reached).
- Set up basic unit tests for core functions (link saving, duplicate detection, reminder triggering) and an integration test that simulates a complete user workflow.
- Document and comment the code for clarity and maintainability.
  Conclude this prompt by ensuring that every feature is interconnected and that the extension functions as a cohesive whole.
