'use strict';

const assert = require('assert');

class ViewManager extends Map {

  constructor(app) {
    super();
    this.config = app.config.view;
    this.config.root = this.config.root.split(/\s*,\s*/g);
    this.extMap = new Map();
    for (const ext of Object.keys(this.config.mapping)) {
      this.extMap.set(ext, this.config.mapping[ext]);
    }
  }

  use(name, viewEngine) {
    assert(name, 'name should exists');
    assert(!this.has(name), `${name} exists`);

    assert(viewEngine, 'viewEngine should exists');
    assert(viewEngine.prototype.render, 'viewEngine should implement `render` method');
    assert(viewEngine.prototype.renderString, 'viewEngine should implement `renderString` method');

    this.set(name, viewEngine);
  }

  get(ext) {
    const viewEngineName = this.extMap.get(ext);
    assert(viewEngineName, `${ext} is not found in config.view.mapping`);
    return super.get(viewEngineName);
  }
}

module.exports = ViewManager;
