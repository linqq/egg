'use strict';

const path = require('path');
const assert = require('assert');
const co = require('co');
const fs = require('mz/fs');


const RENDER = Symbol.for('contextView#render');
// const RENDER_STRING = Symbol.for('contextView#renderString');

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

  * [RENDER](name, locals, options) {
    const filename = yield loadFile(name, this.config);
    const ext = path.extname(filename);
    const ViewEngine = this.viewManager.get(ext);
    assert(ViewEngine, `Don't find ViewEngine by extension ${ext}, filename: ${filename}`);
    const view = new ViewEngine(this.ctx);
    const a = yield view.render(filename, locals, options);
    return a;
  }

  // renderString(...args) {
  //   const self = this;
  //   return co(function* () {
  //     return yield self[RENDER_STRING](...args);
  //   });
  // }

  // * [RENDER_STRING](name, locals, options) {
  //
  // }
}

module.exports = ContextView;

function* loadFile(name, config) {
  const names = [
    name,
    // try find it with default extension
    name + config.defaultExt,
  ];
  for (const name of names) {
    for (const dir of config.root) {
      const filename = path.join(dir, name);
      if (yield fs.exists(filename)) {
        return filename;
      }
    }
  }
  throw new Error(`Don't find ${name} from ${config.root.join(',')}`);
}
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