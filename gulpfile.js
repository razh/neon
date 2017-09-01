/* eslint-env node */

'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();

const browserSync = require('browser-sync').create();
const del = require('del');
const flow = require('rollup-plugin-flow');
const rollup = require('rollup').rollup;

const composer = require('gulp-uglify/composer');
const uglify = composer(require('uglify-es'), console);

const escapeStringRegexp = require('escape-string-regexp');
const operators = require('glsl-tokenizer/lib/operators');

const SPACES_AROUND_OPERATORS_REGEX = new RegExp(
  `\\s*(${
    operators.map(escapeStringRegexp).join('|')
  })\\s*`,
  'g'
);

let production = false;

gulp.task('browser-sync', () => {
  return browserSync.init({
    browser: [],
    server: {
      baseDir: './dist',
    },
  });
});

gulp.task('clean', () => del(['build', 'dist']));

// https://github.com/mrdoob/three.js/blob/dev/rollup.config.js
function glsl() {
  function minify(code) {
    return code
      // Remove //
      .replace(/\s*\/\/.*\n/g, '')
      // Remove /* */
      .replace(/\s*\/\*[\s\S]*?\*\//g, '')
      // # \n+ to \n
      .replace(/\n{2,}/g, '\n')
      // Remove tabs and consecutive spaces with a single space
      .replace(/\s{2,}|\t/g, ' ')
      .split('\n')
      .map((line, index, array) => {
        line = line.trim();

        // Remove spaces around operators if not an #extension directive.
        // For example, #extension GL_OES_standard_derivatives : enable.
        if (!line.startsWith('#extension')) {
          line = line.replace(SPACES_AROUND_OPERATORS_REGEX, '$1');
        }

        // Append newlines after preprocessor directives.
        if (line[0] === '#') {
          line += '\n';

          // Append newlines before the start of preprocessor directive blocks.
          if (index > 0) {
            if (array[index - 1][0] !== '#') {
              line = '\n' + line;
            }
          }
        }

        return line;
      })
      .join('');
  }

  return {
    transform(code, id) {
      if (!/\.glsl$/.test(id)) {
        return;
      }

      return {
        code: `export default ${
          JSON.stringify(production ? minify(code) : code)
        };`,
        map: { mappings: '' },
      };
    },
  };
}

gulp.task('rollup', () => {
  return rollup({
    input: 'modules/index.js',
    plugins: [flow(), glsl()],
  })
    .then(bundle => bundle.write({
      file: 'build/bundle.js',
      format: 'iife',
    }));
});

gulp.task('js', gulp.series('rollup', function js() {
  return gulp.src('build/bundle.js')
    .pipe($.if(production, uglify()))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}));

gulp.task('html', () => {
  return gulp.src('./index.html')
    .pipe($.if(production, $.htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
      minifyCSS: true,
    })))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  gulp.watch(['modules/**/*.js'], gulp.series('js'));
  gulp.watch(['./index.html'], gulp.series('html'));
});

gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('html', 'js'),
  gulp.parallel('browser-sync', 'watch')
));

gulp.task('build', gulp.series(
  'clean',
  function build(done) {
    production = true;
    done();
  },
  gulp.parallel('html', 'js')
));

gulp.task('compress', () => {
  return gulp.src('dist/**/*')
    .pipe($.zip('build.zip'))
    .pipe($.size())
    .pipe($.size({ pretty: false }))
    .pipe(gulp.dest('build'));
});

gulp.task('dist', gulp.series('build', 'compress'));
