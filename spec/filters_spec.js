describe("Filters", function() {
  describe("ansi2html", function() {
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
  });
});