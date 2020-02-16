DISPLAY_DATA_PRIORITY = [
  'text/html',
  'application/pdf',
  'text/latex', 
  'image/svg+xml', 
  'image/png',
  'image/jpeg', 
  'text/markdown', 
  'text/plain'
];

function filter_data_type(value) {
  for (fmt of DISPLAY_DATA_PRIORITY) {
    if (value.hasOwnProperty(fmt)) return [fmt];
  }
  // TODO: handle warning
  return [undefined];
}


if (
    typeof module !== 'undefined' &&
    module.exports &&
    typeof exports !== 'undefined'
  ) {
  module.exports = {
    filter_data_type: filter_data_type
  };
}
else {
  data_type_filter = {
    filter_data_type: filter_data_type
  };
}
