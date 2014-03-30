Angularjs Requirejs Seed
========================

Installation
------------

    # Get NPM dependencies:
    npm install

    # Install global NPM dependencies:
    npm -g install bower
    npm -g install gulp
    npm -g install karma

    # Also to be able to run tests from CLI
    # without browser window popping consider
    # to install PhantomJS:
    # http://phantomjs.org/download.html

    # Get Ruby dependencies required to compile styles from Sass:
    bundle install

[Gulp](http://gulpjs.com/) flows
----------

To make development faster and more automated there are several Gulp tasks available:

* `gulp clean`

  clean the build folder

* `gulp build`

  build the less, requirejs and copy them into build folder

* `gulp watch`

  start a static web server and a live reload server.
  you can open page under localhost:4000, and modify the css/js/html file under the source folder, it will trigger reload automatically.

Vendor update
-------------

* `bower install`

  To update all the dependencies to the latest compatible versions.

## Tests

Tests use Jasmin for assertions.