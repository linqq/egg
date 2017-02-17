'use strict';

module.exports = app => {
  app.get('/render-ejs', 'view.renderEjs');
  app.get('/render-nunjucks', 'view.renderNunjucks');
  app.get('/render-without-ext', 'view.renderWithoutExt');
};
