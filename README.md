# nbchrome
A lightweight viewer for Jupyter Notebooks as a Chrome Extension.
This project differentiates from Jupyter Notebook Viewer by not requiring any server process.

**Note: This is currently at the proof of concept stage.
In particular, functionality is missing and potential copyright issues may have not been addressed.
I would appreciate pull requests or git issues.**

- The plugin will intercept any *.ipynb file read using the file:// protocol - ie. it will not
  be activated for notebooks served via a Jupyter server process.
- The plugin will not check notebook versions, process markdown, or perform syntax highlighting,
and only supports text/html, image/png and text/plain output types.

Installation:
1. Download to a local folder.
2. Go to chrome://extensions/ and enable developer mode in the top-right corner.
3. Click 'Load unpacked' from the top-left corner and select the extension.
4. Open any .ipynb file in Chrome.
