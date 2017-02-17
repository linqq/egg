'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('mz/fs');


class ViewManager extends Map {

  constructor(app) {
    super();
    this.config = app.config.view;
    this.config.root = this.config.root.split(/\s*,\s*/g);
    this.extMap = new Map();
    this.fileMap = new Map();
    for (const ext of Object.keys(this.config.mapping)) {
      this.extMap.set(ext, this.config.mapping[ext]);
    }
  }

  use(name, viewEngine) {
    assert(name, 'name is required');
    assert(!this.has(name), `${name} has been registered`);

    assert(viewEngine, 'viewEngine is required');
    assert(viewEngine.prototype.render, 'viewEngine should implement `render` method');
    assert(viewEngine.prototype.renderString, 'viewEngine should implement `renderString` method');

    this.set(name, viewEngine);
  }

  * loadFile(name) {
    // check cache
    let filename = this.fileMap.get(name);
    if (filename) return filename;

    const config = this.config;
    // try find it with default extension
    filename = yield loadFile([ name, name + config.defaultExt ], config.root);
    assert(filename, `Don't find ${name} from ${config.root.join(',')}`);

    // set cache
    this.fileMap.set(name, filename);
    return filename;
  }
}

module.exports = ViewManager;

function* loadFile(names, root) {
  for (const name of names) {
    for (const dir of root) {
      const filename = path.join(dir, name);
      if (yield fs.exists(filename)) {
        return filename;
      }
    }
  }
}
