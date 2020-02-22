describe("renderer", function() {
    beforeAll(function (done) {
        if (
            typeof module !== 'undefined' &&
            module.exports &&
            typeof exports !== 'undefined'
        ) {
            renderer = require('../notebook_renderer.js');
            fs = require('fs');
            // chrome = require('sinon-chrome');
            document = require('mock-browser').mocks.MockBrowser.createDocument();
            window = require('mock-browser').mocks.MockBrowser.createWindow();
            done();
        }
    });

    describe("render_notebook", function() {
        var j;
        beforeAll( function(done) {
            fs.readFile('spec/simplenb.ipynb', 'utf8', function (err, data) {
                if (err) throw err;
                j = JSON.parse(data);
                done();
            });
        });
        it("no errors", function() {
            expect(renderer.render_notebook(j)).toBeDefined();
        });
        it("main div", function() {
            expect(renderer.render_notebook(j).nodeType).toEqual(1);
        });
    });
});