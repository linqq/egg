'use strict';

exports.renderEjs = ctx => ctx.render('ext/a.ejs', { data: 1 }, { opt: 1 });
exports.renderNunjucks = ctx => ctx.render('ext/a.nj', { data: 1 }, { opt: 1 });
exports.renderWithoutExt = ctx => ctx.render('ext/a', { data: 1 }, { opt: 1 });
