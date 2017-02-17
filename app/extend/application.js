'use strict';

const ViewManager = require('../../lib/core/view_manager');
const VIEW = Symbol('Application#view');

module.exports = {
  get view() {
    if (!this[VIEW]) {
      this[VIEW] = new ViewManager(this);
    }
    return this[VIEW];
  },
};
