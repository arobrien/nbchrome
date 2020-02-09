MathJax = {
    tex: {
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: true,
        processEnvironments: true
    },
    // Center justify equations in code and markdown cells. Elsewhere
    // we use CSS to left justify single line equations in code cells.
    chtml: {
        displayAlign: 'center',
        fontURL: chrome.runtime.getURL('mathjax/woff-v2')
    }
};