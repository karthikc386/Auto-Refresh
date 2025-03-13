# Auto Refresh Chrome Extension

This Chrome extension allows you to automatically refresh the current tab at a specified interval. It also provides options to clear the cache on each refresh and to loop the refresh process indefinitely.

## Features

*   **Automatic Page Refresh:** Refreshes the current tab at a user-defined interval.
*   **Customizable Refresh Interval:** Set the refresh interval in seconds.
*   **Clear Cache Option:** Optionally clear the browser cache on each refresh.
*   **Loop Refresh:** Option to continuously refresh the page until manually stopped.
*   **Real-time Status:** Displays the last refresh time, next refresh time, and seconds remaining until the next refresh.
*   **Toggle On/Off:** Easily enable or disable auto-refresh with a toggle switch.
* **Persist Settings:** The settings are saved in the local storage.

## How to Use

1.  **Installation:**
    *   Download the extension's source code.
    *   Open Chrome and go to `chrome://extensions/`.
    *   Enable "Developer mode" in the top right corner.
    *   Click "Load unpacked".
    *   Select the directory where you downloaded the extension's source code.

2.  **Configuration:**
    *   Open the extension's popup by clicking its icon in the Chrome toolbar.
    *   Enter the desired refresh interval in seconds in the "Refresh Interval" field.
    *   Check the "Clear Cache" checkbox if you want to clear the cache on each refresh.
    *   Check the "Loop Refresh" checkbox if you want to continuously refresh the page.
    *   Click "Set Refresh Interval" to apply the settings.

3.  **Start/Stop Auto-Refresh:**
    *   Use the toggle switch to turn the auto-refresh feature "ON" or "OFF".
    *   When the toggle is "ON", the status will display "ON", and the page will refresh automatically according to the configured settings.
    *   When the toggle is "OFF", the status will display "OFF", and the auto-refresh will stop.

4. **Status:**
    * The status will show if the auto refresh is ON or OFF.
    * The last time the page was refreshed.
    * The next time the page will be refreshed.
    * The seconds left until the next refresh.

## Technical Details

*   **`script.js`:** This file handles the user interface logic, including:
    *   Reading and writing settings to Chrome's local storage.
    *   Setting and clearing the refresh interval.
    *   Updating the UI elements with refresh status information.
    *   Handling the toggle switch and other input elements.
    *   Refreshing the page.
*   **`background.js`:** This file handles background tasks, including:
    *   Listening for messages from the popup script.
    *   Saving and retrieving data from Chrome's local storage.
    *   Logging messages to the console.

## Files

*   `script.js`: Contains the main logic for the extension's popup.
*   `background.js`: Contains the background script for the extension.

## Permissions

The extension requires the following permissions:

*   `storage`: To store and retrieve user settings.
*   `tabs`: To reload the current tab.

## Future Improvements

*   Add support for multiple tabs.
*   Add more advanced refresh options (e.g., specific times, conditional refresh).
*   Add a visual indicator on the tab when auto-refresh is active.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.

## License

MIT License (You should add a LICENSE file if you intend to open-source your extension)
