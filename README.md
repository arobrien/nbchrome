# nbchrome
A lightweight viewer for Jupyter Notebooks as a Chrome Extension.
This project differentiates from Jupyter Notebook Viewer by not requiring any server process.
No data is sent or received over the network by the plugin.

**Note: This project is currently at the proof-of-concept phase and some functionality may be missing.
I would appreciate pull requests or git issues.**

- The plugin will intercept any *.ipynb file read using the file:// protocol - ie. it will not
  be activated for notebooks served via a Jupyter server process.
- The plugin will not check notebook versions, and only supports text/html, image/png and text/plain output types.

Installation:
1. Download to a local folder.
2. Install nodejs
3. npm install
4. npm build-dev
5. Go to chrome://extensions and enable developer mode in the top-right corner.
6. Click 'Load unpacked' from the top-left corner and select the extension folder.
7. Open any .ipynb file in Chrome.

At the moment, if you hit an error it's probably because of some element that the script isn't handling.
If this happens it will probably just show you the raw json and look like nothing else happened.
If this happens to you please take the time to post the error and a sample notebook that triggers it.
