'use strict';

const path = require('path');
const assert = require('assert');
const co = require('co');


const RENDER = Symbol.for('contextView#render');
const RENDER_STRING = Symbol.for('contextView#renderString');

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

  // ext -> viewEngineName -> viewEngine
  * [RENDER](name, locals, options) {
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

    // get view engine
    const ViewEngine = this.viewManager.get(viewEngineName);
    assert(ViewEngine, `Don't find ViewEngine "${viewEngineName}", filename: ${filename}`);

    // use view engine to render
    const view = new ViewEngine(this.ctx);
    return yield view.render(filename, locals, options);
  }

  renderString(...args) {
    const self = this;
    return co(function* () {
      return yield self[RENDER_STRING](...args);
    });
  }

  * [RENDER_STRING]() {
    // const ViewEngine = this.viewManager.get(ext);
    // const view = new ViewEngine(this.ctx);
    // return yield view.render(filename, locals, options);
  }

}

module.exports = ContextView;

// module.exports = ctx => {
//
//
//   // global view cache
//   let View = ctx.app[VIEW];
//   if (!View) {
//     assert(ctx.app[EGG_VIEW], 'should enable view plugin');
//     View = ctx.app[VIEW] = extendView(ctx.app[EGG_VIEW]);
//   }
//
//   return new View(ctx);
// };
//
//
// function extendView(ViewClass) {
//
//   /**
//    * Wrap use defined view class that should implement method of `render` and `renderString`
//    *
//    * @example
//    * ```js
//    * // lib/xx.js
//    * const egg = require('egg');
//    *
//    * class NunjucksView {
//    *   render(name, locals) {
//    *     return Promise.resolve('some html');
//    *   }
//    *
//    *   renderString(tpl, locals) {
//    *     return Promise.resolve('some html');
//    *   }
//    *
//    *   // define view helper if you want to get helper from the template
//    *   get helper() {
//    *     return this.ctx.helper;
//    *   }
//    * }
//    *
//    * class XxApplication extends egg.Application {
//    *   get [Symbol.for('egg#view')]() {
//    *     return NunjucksView;
//    *   }
//    * }
//    * ```
//    */
//   class View extends ViewClass {
//     constructor(ctx) {
//       super(ctx);
//       this.ctx = ctx;
//       this.app = ctx.app;
//     }
//
//     /**
//      * render for template path
//      * @param {String} name - template path
//      * @param {Object} locals - locals
//      * @return {Promise} promise - resolve html string
//      */
//     render(name, locals) {
//       locals = this.setLocals(locals);
//       return super.render(name, locals);
//     }
//
//     /**
//      * render for template string
//      * @param {String} tpl - template string
//      * @param {Object} locals - locals
//      * @return {Promise} promise - resolve html string
//      */
//     renderString(tpl, locals) {
//       locals = this.setLocals(locals);
//       return super.renderString(tpl, locals);
//     }
//
//     /**
//      * set locals for view, inject `locals.ctx`, `locals.request`, `locals.helper`
//      * @param {Object} locals - locals
//      * @return {Object} locals
//      * @private
//      */
//     setLocals(locals) {
//       return util.assign({
//         ctx: this.ctx,
//         request: this.ctx.request,
//         helper: this.helper,
//       }, [ this.ctx.locals, locals ]);
//     }
//   }
//
//   return View;
// }
