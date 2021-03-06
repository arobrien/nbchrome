describe("Filters", function() {
  describe("ansi2html", function() {
    beforeAll(function () {
      if (
        typeof module !== 'undefined' &&
        module.exports &&
        typeof exports !== 'undefined'
      ) {
        ansi = require('../filters/ansi.js');
      }
    });
    
    // test colors verified with results from nbconvert/filters/ansi.py
    describe("_get_extended_color", function() {
      it("24bit rgb", function() {
        expect(ansi._get_extended_color([38,2,3,4,5], 0)).toEqual([[3,4,5], 3]);
        expect(ansi._get_extended_color([38,2,3,4,5,6,7], 0)).toEqual([[3,4,5], 3]);
        expect(ansi._get_extended_color([0,0,0,38,2,3,4,5,6,7], 3)).toEqual([[3,4,5], 6]);
      });
      it("16 default terminal colors", function() {
        expect(ansi._get_extended_color([38,5,0], 0)).toEqual([0, 2]);
        expect(ansi._get_extended_color([38,5,6], 0)).toEqual([6, 2]);
        expect(ansi._get_extended_color([38,5,15], 0)).toEqual([15, 2]);
      });
      it("6x6x6 color cube", function() {
        expect(ansi._get_extended_color([38,5,16 ], 0)).toEqual([[0, 0, 0]      , 2]);
        expect(ansi._get_extended_color([38,5,56 ], 0)).toEqual([[95, 0, 215]   , 2]);
        expect(ansi._get_extended_color([38,5,143], 0)).toEqual([[175, 175, 95] , 2]);
        expect(ansi._get_extended_color([38,5,231], 0)).toEqual([[255, 255, 255], 2]);
      });
      it("grayscale", function() {
        expect(ansi._get_extended_color([38,5,232], 0)).toEqual([[8,8,8],       2]);
        expect(ansi._get_extended_color([38,5,240], 0)).toEqual([[88,88,88],    2]);
        expect(ansi._get_extended_color([38,5,255], 0)).toEqual([[238,238,238], 2]);
      });
    });
    // test results verified with results from nbconvert/filters/ansi.py
    describe("_make_ansi_tags", function() {
      it("no tags", function() {
        expect(ansi._make_ansi_tags(undefined, undefined, false, false, false)).toEqual(['','']);
      });
      it("bold", function() {
        expect(ansi._make_ansi_tags(undefined, undefined, true, false, false)).toEqual(['<span class="ansi-bold">','</span>']);
      });
      it("underline", function() {
        expect(ansi._make_ansi_tags(undefined, undefined, false, true, false)).toEqual(['<span class="ansi-underline">','</span>']);
      });
      it("inverse", function() {
        expect(ansi._make_ansi_tags(undefined, undefined, false, false, true)).toEqual(['<span class="ansi-default-inverse-fg ansi-default-inverse-bg">','</span>']);
      });
      it("fg int", function() {
        expect(ansi._make_ansi_tags(4, undefined, false, false, false)).toEqual(['<span class="ansi-blue-fg">','</span>']);
      });
      it("fg triple", function() {
        expect(ansi._make_ansi_tags([1,2,3], undefined, false, false, false)).toEqual(['<span style="color: rgb(1,2,3)">','</span>']);
      });
      it("bg int", function() {
        expect(ansi._make_ansi_tags(undefined, 4, false, false, false)).toEqual(['<span class="ansi-blue-bg">','</span>']);
      });
      it("bg triple", function() {
        expect(ansi._make_ansi_tags(undefined, [1,2,3], false, false, false)).toEqual(['<span style="background-color: rgb(1,2,3)">','</span>']);
      });
      it("all options", function() {
        expect(ansi._make_ansi_tags(8, [1,2,3], true, true, true)).toEqual(['<span class="ansi-black-intense-bg ansi-bold ansi-underline" style="color: rgb(1,2,3)">','</span>']);
      });
    });
    // test cases from nbconvert/filters/tests/test_ansi.py
    describe("ansi2html", function() {
      beforeAll(function () {
        // var escape = function ()
        jinjaToJS = {
          runtime: {
            escape: (t) => t
          }
        }
        // spyOn(jinjaToJS.runtime, 'escape');
      });
      
      it("all", function() {
        expect(ansi.ansi2html('\x1b[31m')).toEqual('');
        expect(ansi.ansi2html('hello\x1b[34m')).toEqual('hello');
        expect(ansi.ansi2html('he\x1b[32m\x1b[36mllo')).toEqual('he<span class="ansi-cyan-fg">llo</span>');
        expect(ansi.ansi2html('\x1b[1;33mhello')).toEqual('<span class="ansi-yellow-intense-fg ansi-bold">hello</span>');
        expect(ansi.ansi2html('\x1b[37mh\x1b[0;037me\x1b[;0037ml\x1b[00;37ml\x1b[;;37mo')).toEqual('<span class="ansi-white-fg">h</span><span class="ansi-white-fg">e</span><span class="ansi-white-fg">l</span><span class="ansi-white-fg">l</span><span class="ansi-white-fg">o</span>');
        expect(ansi.ansi2html('hel\x1b[0;32mlo')).toEqual('hel<span class="ansi-green-fg">lo</span>');
        expect(ansi.ansi2html('hellø')).toEqual('hellø');
        expect(ansi.ansi2html('\x1b[1mhello\x1b[33mworld\x1b[0m')).toEqual('<span class="ansi-bold">hello</span><span class="ansi-yellow-intense-fg ansi-bold">world</span>');
        expect(ansi.ansi2html('he\x1b[4mll\x1b[24mo')).toEqual('he<span class="ansi-underline">ll</span>o');
        expect(ansi.ansi2html('\x1b[35mhe\x1b[7mll\x1b[27mo')).toEqual('<span class="ansi-magenta-fg">he</span><span class="ansi-default-inverse-fg ansi-magenta-bg">ll</span><span class="ansi-magenta-fg">o</span>');
        expect(ansi.ansi2html('\x1b[44mhe\x1b[7mll\x1b[27mo')).toEqual('<span class="ansi-blue-bg">he</span><span class="ansi-blue-fg ansi-default-inverse-bg">ll</span><span class="ansi-blue-bg">o</span>');
      });
    });
  });
  
  describe("simple_filters", function() {
    beforeAll(function () {
      if (
        typeof module !== 'undefined' &&
        module.exports &&
        typeof exports !== 'undefined'
      ) {
        simple_filters = require('../filters/simple_filters.js');
      }
    });
    
    describe("filter_data_type", function() {
      it("all", function() {
        expect(simple_filters.filter_data_type({"hair":"1", "water":2, "image/png":3, "rock":4.0})).toEqual(['image/png']);
        expect(simple_filters.filter_data_type({"application/pdf":"file_path", "hair":2, "water":"yay", "png":'not a png', "rock":'is a rock'})).toEqual(['application/pdf']);
        expect(simple_filters.filter_data_type({"hair":"this is not", "water":"going to return anything", "rock":"or is it"})).toEqual([undefined]);
      });
    });
    
    describe("get_metadata", function() {
      it("all", function() {
        var obj = {
        'metadata': {
            'width': 1,
            'height': 2,
            'image/png': {
                'unconfined': true,
                'height': 3,
            }
          }
        }
        
        expect(simple_filters.get_metadata(obj, 'nowhere')).toEqual(undefined);
        expect(simple_filters.get_metadata(obj, 'height')).toEqual(2);
        expect(simple_filters.get_metadata(obj, 'unconfined')).toEqual(undefined);
        expect(simple_filters.get_metadata(obj, 'unconfined', 'image/png')).toEqual(true);
        expect(simple_filters.get_metadata(obj, 'width', 'image/png')).toEqual(1);
        expect(simple_filters.get_metadata(obj, 'height', 'image/png')).toEqual(3);
      });
    });
    
    // describe("highlight_code", function() {
      // it("all", function() {
        // expect(simple_filters.highlight_code()).toEqual();
      // });
    // });
    
    
    describe("json_dumps", function() {
      it("all", function() {
        expect(simple_filters.json_dumps()).toEqual();
      });
    });
    
    // describe("markdown2html", function() {
      // it("all", function() {
        // expect(simple_filters.markdown2html()).toEqual();
      // });
    // });
    
    describe("posix_path", function() {
      it("all", function() {
        expect(simple_filters.posix_path('path/with/forward\\and\\back')).toEqual('path/with/forward/and/back');
      });
    });
    
    describe("strip_files_prefix", function() {
      it("all", function() {
        expect(simple_filters.strip_files_prefix('')).toEqual('');
        expect(simple_filters.strip_files_prefix('/files')).toEqual('/files');
        expect(simple_filters.strip_files_prefix('test="/files"')).toEqual('test="/files"')
        expect(simple_filters.strip_files_prefix('My files are in `files/`')).toEqual('My files are in `files/`');
        expect(simple_filters.strip_files_prefix('<a href="files/test.html">files/test.html</a>')).toEqual('<a href="test.html">files/test.html</a>');
        expect(simple_filters.strip_files_prefix('<a href="/files/test.html">files/test.html</a>')).toEqual('<a href="test.html">files/test.html</a>');
        expect(simple_filters.strip_files_prefix("<a href='files/test.html'>files/test.html</a>")).toEqual("<a href='test.html'>files/test.html</a>");
        expect(simple_filters.strip_files_prefix('<img src="files/url/location.gif">')).toEqual('<img src="url/location.gif">');
        expect(simple_filters.strip_files_prefix('<img src="/files/url/location.gif">')).toEqual('<img src="url/location.gif">');
        expect(simple_filters.strip_files_prefix('hello![caption]')).toEqual('hello![caption]');
        expect(simple_filters.strip_files_prefix('hello![caption](/url/location.gif)')).toEqual('hello![caption](/url/location.gif)');
        expect(simple_filters.strip_files_prefix('hello![caption](url/location.gif)')).toEqual('hello![caption](url/location.gif)');
        expect(simple_filters.strip_files_prefix('hello![caption](url/location.gif)')).toEqual('hello![caption](url/location.gif)');
        expect(simple_filters.strip_files_prefix('hello![caption](files/url/location.gif)')).toEqual('hello![caption](url/location.gif)');
        expect(simple_filters.strip_files_prefix('hello![caption](/files/url/location.gif)')).toEqual('hello![caption](url/location.gif)');
        expect(simple_filters.strip_files_prefix('hello [text](/files/url/location.gif)')).toEqual('hello [text](url/location.gif)');
        expect(simple_filters.strip_files_prefix('hello [text space](files/url/location.gif)')).toEqual('hello [text space](url/location.gif)');
      });
    });
  });
});