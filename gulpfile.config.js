'use strict';
var GulpConfig = (function () {
    function gulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)
        this.buildPath = './dist/';
        this.source = './src/';
        this.sourceApp = this.source + 'ts/';

        this.tsOutputPath = this.source + '/js';
        this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.sourceApp + '/**/*.ts';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = './tools/typings/main/**/*.ts';
        this.appTypeScriptReferences = './tools/typings/tsd.d.ts'
    }
    return gulpConfig;
})();
module.exports = GulpConfig;