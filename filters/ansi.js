_ANSI_COLORS = [
    'ansi-black',
    'ansi-red',
    'ansi-green',
    'ansi-yellow',
    'ansi-blue',
    'ansi-magenta',
    'ansi-cyan',
    'ansi-white',
    'ansi-black-intense',
    'ansi-red-intense',
    'ansi-green-intense',
    'ansi-yellow-intense',
    'ansi-blue-intense',
    'ansi-magenta-intense',
    'ansi-cyan-intense',
    'ansi-white-intense',
];

function ansi2html(value) {
  // Convert ANSI colors to HTML colors.
  // Parameters
  // ----------
  // text : unicode
  //        Text containing ANSI colors to convert to HTML
  var value;
  var cleaned = jinjaToJS.runtime.escape(value);
  
  // state
  var fg, bg
  var bold = false
  var underline = false
  var inverse = false
  
  // number collected in each match
  var numbers
  
  // accumulate output
  var out = ""
  
  last_index = 0
  ansi_re = /\x1b\[(.*?)([@-~])/g
  while (m = ansi_re.exec(cleaned)) {
    // [match, group1, group2, index: n]
    
    if (m.index - last_index) {
      // process previous chunk based on current state
      var [starttag, endtag] = _make_ansi_tags(bold && fg < 8 ? fg + 8 : fg,
                                               bg, bold, underline, inverse);
      out += starttag;
      out += cleaned.slice(last_index, m.index);
      out += endtag;
    }
    
    // increment to start of next chunk
    last_index = m.index + m[0].length;
    
    // process state for next chunk
    numbers = m[1].split(';').map(n => Number(n));
    for (var i=0; i < numbers.length; i++) {
      var n = numbers[i]
      switch(n) {
        case 0:
          // same as empty: reset everything
          fg = bg = undefined;
          bold = underline = inverse = false;
          break;
        case 1:
          bold = true;
          break;
        case 4:
          underline = true;
          break;
        case 5:
          bold = true;
          break;
        case 7:
          inverse = true;
          break;
        case 21:
        case 22:
          bold = false;
          break;
        case 24:
          underline = false;
          break;
        case 27:
          inverse = false;
          break;
        case 30:
        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
        case 36:
        case 37:
          fg = n - 30;
          break;
        case 38:
          [fg, i] = _get_extended_color(numbers, i);
          break;
        case 40:
        case 41:
        case 42:
        case 43:
        case 44:
        case 45:
        case 46:
        case 47:
          bg = n - 40;
          break;
        case 48:
          [bg, i] = _get_extended_color(numbers, i);
          break;
        case 49:
          bg = undefined;
          break;
        case 90:
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
        case 96:
        case 97:
          fg = n - 90 + 8;
          break;
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
          fg = n - 100 + 8;
          break;
      }
    }
  }
  return out;
};

function _get_extended_color(numbers, i) {
  var numbers, i;
  var n;
  var c;
  if (numbers.length < i + 1) return [undefined, numbers.length];
  n = numbers[i+1];
  if (n == 2 && numbers.length >= i+4) {
    // 24-bit RGB
    c = numbers.slice(i+2,i+5);
    if (c.some((e) => c < 0 || c > 255)) return [undefined, numbers.length];
    return [c, i + 3];
  }
  else if (n == 5 && numbers.length >= i+2) {
    // 256 colors
    c = numbers[i+2];
    if (c < 0) return [undefined, numbers.length];
    // 16 default terminal colors
    if (c < 16) return [c, i+2];
    // 6x6x6 color cube, see http://stackoverflow.com/a/27165165/500098
    if (c < 232) {
      return [[c < 52           ? 0 : 55 + Math.floor( (c - 16) / 36     ) * 40,
              (c - 16) % 36 < 6 ? 0 : 55 + Math.floor(((c - 16) % 36) / 6) * 40,
              (c - 16) % 6 < 1  ? 0 : 55 + Math.floor(((c - 16) % 6)     ) * 40
              ], i+2];
    }
    // grayscale, see http://stackoverflow.com/a/27165165/500098
    if (c < 256) return [[(c - 232) * 10 + 8,
                          (c - 232) * 10 + 8,
                          (c - 232) * 10 + 8
                          ], i+2];
  }
  return [undefined, numbers.length];
}


function _make_ansi_tags(fg, bg, bold, underline, inverse) {
  var fg, bg, bold, underline, inverse;
  if ([fg, bg, bold, underline, inverse] == [undefined, undefined, false, false, false]) return ['', ''];
  
  var classes = [];
  var styles = [];
  
  if (inverse)[fg, bg] = [bg, fg];
  
  if (fg instanceof Number) classes.push(_ANSI_COLORS[fg] + '-fg');
  else if (fg instanceof Array) styles.push('color: rgb('+fg[0]+','+fg[1]+','+fg[2]+')');
  else if (inverse) classes.push('ansi-default-inverse-fg');
  
  if (bg instanceof Number) classes.push(_ANSI_COLORS[bg] + '-bg');
  else if (bg instanceof Array) styles.push('color: rgb('+bg[0]+','+bg[1]+','+bg[2]+')');
  else if (inverse) classes.push('ansi-default-inverse-bg');
  
  if (bold) classes.push('ansi-bold');
  if (underline) classes.push('ansi-underline');
  
  var starttag = '<span';
  if (classes.length) starttag += ' class="' + classes.join(' ') + '"';
  if (styles.length) starttag += ' style="' + styles.join('; ') + '"';
  starttag += '>';
  
  return [starttag, '</span>']
}


if (
    typeof module !== 'undefined' &&
    module.exports &&
    typeof exports !== 'undefined'
  ) {
  module.exports = {
    ansi2html: ansi2html,
    _get_extended_color: _get_extended_color,
    _make_ansi_tags
  };
}
else {
  ansi = {
    ansi2html: ansi2html,
    _get_extended_color: _get_extended_color,
    _make_ansi_tags
  };
}
