# nbchrome
A lightweight viewer for Jupyter Notebooks as a Chrome Extension.
This project differentiates from Jupyter Notebook Viewer by not requiring any server process.
No data is sent or received over the network by the plugin.

**Note: This project is currently at the proof-of-concept phase and some functionality may be missing.
I would appreciate pull requests or git issues.**

- The plugin will intercept any *.ipynb file read using the file:// protocol - ie. it will not
  be activated for notebooks served via a Jupyter server process.
- The plugin will not check notebook versions, and only supports text/html, image/png and text/plain output types.

## Installation:

### Using the Chrome Web Store
Coming soon

### Simple
The 0.1 release of the software was designed to be installed quickly and easily using Chrome's 'developer mode'.
This is currently the easiest way to install the plugin.

1. Download the v0.1 release from https://github.com/arobrien/nbchrome/releases/tag/v0.1
2. Go to chrome://extensions and enable developer mode in the top-right corner.
3. Click 'Load unpacked' from the top-left corner and select the extension.
4. Open any .ipynb file in Chrome.
5. For added convenience, set your computer to open .ipynb files using Google Chrome. On windows use 'open with'.

### Development
Since the initial 0.1 release, changes have been made to facilitate better software practices, preparing for
adding the extension to the web store. They have however made manual installation more complicated.

1. Download to a local folder.
2. Install nodejs
3. npm install
4. npm build-dev
5. Go to chrome://extensions and enable developer mode in the top-right corner.
6. Click 'Load unpacked' from the top-left corner and select the extension folder.
7. Open any .ipynb file in Chrome.
8. For added convenience, set your computer to open .ipynb files using Google Chrome. On windows use 'open with'.

At the moment, if you hit an error it's probably because of some element that the script isn't handling.
If this happens it will probably just show you the raw json and look like nothing else happened.
Currenty, to view the error, you will need to use the Chrome developer tools, or hit the 'errors' button for the
extension in the extensions manager (chrome://extensions).
If this happens to you please take the time to post the error and a sample notebook that triggers it.
