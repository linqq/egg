'use strict';

module.exports = app => {
  app.get('/render-ejs', 'view.renderEjs');
  app.get('/render-nunjucks', 'view.renderNunjucks');
  app.get('/render-with-options', 'view.renderWithOptions');
  app.get('/render-without-ext', 'view.renderWithoutExt');
  app.get('/render-ext-without-config', 'view.renderExiWithoutConfig');
  app.get('/render-without-view-engine', 'view.renderWithoutViewEngine');
  app.get('/render-multiple-root', 'view.renderMultipleRoot');
  app.get('/render-multiple-root-without-extenstion', 'view.renderMultipleRootWithoutExtension');
  app.get('/load-same-file', 'view.loadSameFile');
};
