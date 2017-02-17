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

    it('should render ejs', function* () {
      const res = yield request(app.callback())
        .get('/render-ejs')
        .expect(200);

      assert(res.body.filename === path.join(baseDir, 'app/view/ext/a.ejs'));
      assert(res.body.locals.data === 1);
      assert(res.body.options.opt === 1);
    });

    it('should render nunjucks', function* () {
      const res = yield request(app.callback())
        .get('/render-nunjucks')
        .expect(200);

      assert(res.body.filename === path.join(baseDir, 'app/view/ext/a.nj'));
      assert(res.body.locals.data === 1);
      assert(res.body.options.opt === 1);
    });

    it('should render without extension', function* () {
      const res = yield request(app.callback())
        .get('/render-without-ext')
        .expect(200);

      assert(res.body.filename === path.join(baseDir, 'app/view/ext/a.ejs'));
      assert(res.body.locals.data === 1);
      assert(res.body.options.opt === 1);
    });
  });

});
