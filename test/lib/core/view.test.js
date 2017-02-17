'use strict';

const assert = require('assert');
const path = require('path');
const request = require('supertest');
const mock = require('egg-mock');
const utils = require('../../utils');


describe.only('test/lib/core/view.test.js', () => {
  afterEach(mock.restore);

  describe('multiple view engine', () => {
    const baseDir = utils.getFilepath('apps/multiple-view-engine');
    let app;
    before(() => {
      app = utils.app('apps/multiple-view-engine');
      return app.ready();
    });
    after(() => app.close());

    describe('use', () => {
      it('should throw when name do not exist', () => {
        assert.throws(() => {
          app.view.use();
        }, /name is required/);
      });

      it('should throw when viewEngine do not exist', () => {
        assert.throws(() => {
          app.view.use('a');
        }, /viewEngine is required/);
      });

      it('should throw when name has been registered', () => {
        class View {
          render() {}
          renderString() {}
        }
        app.view.use('b', View);
        assert.throws(() => {
          app.view.use('b', View);
        }, /b has been registered/);
      });

      it('should throw when not implement render', () => {
        class View {}
        assert.throws(() => {
          app.view.use('c', View);
        }, /viewEngine should implement `render` method/);
      });

      it('should throw when not implement render', () => {
        class View {
          render() {}
        }
        assert.throws(() => {
          app.view.use('d', View);
        }, /viewEngine should implement `renderString` method/);
      });

      it('should register success', () => {
        class View {
          render() {}
          renderString() {}
        }
        app.view.use('e', View);
        // assert(app.view.has('e'));
      });
    });

    describe('render', () => {
      it('should render ejs', function* () {
        const res = yield request(app.callback())
          .get('/render-ejs')
          .expect(200);

        assert(res.body.filename === path.join(baseDir, 'app/view/ext/a.ejs'));
        assert(res.body.locals.data === 1);
        assert(res.body.options.opt === 1);
        assert(res.body.type === 'ejs');
      });

      it('should render nunjucks', function* () {
        const res = yield request(app.callback())
          .get('/render-nunjucks')
          .expect(200);

        assert(res.body.filename === path.join(baseDir, 'app/view/ext/a.nj'));
        assert(res.body.locals.data === 1);
        assert(res.body.options.opt === 1);
        assert(res.body.type === 'nunjucks');
      });

      it('should render with options.viewEngine', function* () {
        const res = yield request(app.callback())
          .get('/render-with-options')
          .expect(200);

        assert(res.body.filename === path.join(baseDir, 'app/view/ext/a.nj'));
        assert(res.body.type === 'ejs');
      });
    });

    describe('renderString', () => {

    });

    describe('loadFile', () => {
      it('should loader without extension', function* () {
        const res = yield request(app.callback())
          .get('/render-without-ext')
          .expect(200);
        assert(res.body.filename === path.join(baseDir, 'app/view/loader/a.ejs'));
      });

      it('should throw when render file that extension is not configured', function* () {
        yield request(app.callback())
          .get('/render-ext-without-config')
          .expect(500)
          .expect(/.noext is not found in config.view.mapping/);
      });

      it('should throw when render file without viewEngine', function* () {
        yield request(app.callback())
          .get('/render-without-view-engine')
          .expect(500)
          .expect(/Don&#39;t find ViewEngine &quot;html&quot;/);
      });

      it('should load file from multiple root', function* () {
        const res = yield request(app.callback())
          .get('/render-multiple-root')
          .expect(200);
        assert(res.body.filename === path.join(baseDir, 'app/view2/loader/from-view2.ejs'));
      });

      it('should load file from multiple root when without extension', function* () {
        const res = yield request(app.callback())
          .get('/render-multiple-root-without-extenstion')
          .expect(200);
        assert(res.body.filename === path.join(baseDir, 'app/view2/loader/from-view2.ejs'));
      });

      it('should render load "name" before "name + defaultExt" in multiple root', function* () {
        const res = yield request(app.callback())
          .get('/load-same-file')
          .expect(200);
        assert(res.body.filename === path.join(baseDir, 'app/view2/loader/a.nj'));
      });
    });
  });

});
