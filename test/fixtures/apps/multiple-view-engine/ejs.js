'use strict';

const sleep = require('mz-modules/sleep');

class EjsView {
  * render(filename, locals, options) {
    yield sleep(10);
    return {
      filename,
      locals,
      options,
    };
  }

  * renderString() {}
}

module.exports = EjsView;
