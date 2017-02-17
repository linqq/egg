'use strict';

exports.renderEjs = ctx => ctx.render('ext/a.ejs', { data: 1 }, { opt: 1 });
exports.renderNunjucks = ctx => ctx.render('ext/a.nj', { data: 1 }, { opt: 1 });

exports.renderWithoutExt = ctx => ctx.render('loader/a', { data: 1 }, { opt: 1 });
exports.renderExiWithoutConfig = ctx => {
  try {
    return ctx.render('loader/a.noext')
  } catch (err) {
    return Promise.reject(err.message);
  }
};

exports.renderWithoutViewEngine = ctx => {
  try {
    return ctx.render('loader/a.html')
  } catch (err) {
    return Promise.reject(err.message);
  }
};

exports.renderMultipleRoot = ctx => ctx.render('loader/from-view2.ejs');
exports.renderMultipleRootWithoutExtension = ctx => ctx.render('loader/from-view2');
exports.loadSameFile = ctx => ctx.render('loader/a.nj');
