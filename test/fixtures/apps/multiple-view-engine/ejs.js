'use strict';

const sleep = require('mz-modules/sleep');

class EjsView {
  * render(filename, locals, options) {
    yield sleep(10);
    return {
      filename,
      locals,
      options,
      type: 'ejs',
    };
  }

  * renderString() {}
}

module.exports = EjsView;
