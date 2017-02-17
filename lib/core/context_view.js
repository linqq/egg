'use strict';

const path = require('path');
const assert = require('assert');
const co = require('co');
const util = require('./util');


const RENDER = Symbol.for('contextView#render');
const RENDER_STRING = Symbol.for('contextView#renderString');
const GET_VIEW_ENGINE = Symbol.for('contextView#getViewEngine');
const SET_LOCALS = Symbol.for('contextView#setLocals');

/**
 * Wrap use defined view class that should implement method of `render` and `renderString`
 *
 * @example
 * ```js
 * // lib/xx.js
 * const egg = require('egg');
 *
 * class NunjucksView {
 *   render(name, locals) {
 *     return Promise.resolve('some html');
 *   }
 *
 *   renderString(tpl, locals) {
 *     return Promise.resolve('some html');
 *   }
 *
 *   // define view helper if you want to get helper from the template
 *   get helper() {
 *     return this.ctx.helper;
 *   }
 * }
 *
 * class XxApplication extends egg.Application {
 *   get [Symbol.for('egg#view')]() {
 *     return NunjucksView;
 *   }
 * }
 * ```
 */
class ContextView {
  constructor(ctx) {
    this.ctx = ctx;
    this.viewManager = ctx.app.view;
    this.config = ctx.app.view.config;
  }

  render(...args) {
    const self = this;
    return co(function* () {
      return yield self[RENDER](...args);
    });
  }

  renderString(...args) {
    const self = this;
    return co(function* () {
      return yield self[RENDER_STRING](...args);
    });
  }

  // ext -> viewEngineName -> viewEngine
  * [RENDER](name, locals, options) {
    locals = this[SET_LOCALS](locals);

    // retrieve fullpath matching name from `config.root`
    const filename = yield this.viewManager.loadFile(name);

    // get the name of view engine,
    // if viewEngine is specified in options, don't match extension
    let viewEngineName = options && options.viewEngine;
    if (!viewEngineName) {
      const ext = path.extname(filename);
      viewEngineName = this.viewManager.extMap.get(ext);
      assert(viewEngineName, `${ext} is not found in config.view.mapping`);
    }

    // get view engine and render
    const view = this[GET_VIEW_ENGINE](viewEngineName);
    return yield view.render(filename, this[SET_LOCALS](locals), options);
  }

  * [RENDER_STRING](tpl, locals, options) {
    const viewEngineName = options && options.viewEngine;
    assert(viewEngineName, 'viewEngine is required');

    // get view engine and render
    const view = this[GET_VIEW_ENGINE](viewEngineName);
    return yield view.renderString(tpl, this[SET_LOCALS](locals), options);
  }

  [GET_VIEW_ENGINE](name) {
    // get view engine
    const ViewEngine = this.viewManager.get(name);
    assert(ViewEngine, `Don't find ViewEngine "${name}"`);

    // use view engine to render
    return new ViewEngine(this.ctx);
  }

  /**
   * set locals for view, inject `locals.ctx`, `locals.request`, `locals.helper`
   * @param {Object} locals - locals
   * @return {Object} locals
   * @private
   */
  [SET_LOCALS](locals) {
    return util.assign({
      ctx: this.ctx,
      request: this.ctx.request,
      helper: this.helper,
    }, [ this.ctx.locals, locals ]);
  }
}

module.exports = ContextView;
