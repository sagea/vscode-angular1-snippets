var fs = require ('fs');
var path = require ('path');
var _ = require ('lodash');
var fspath = require ('fs-path');

compileSnippet('./templates', './snippets/javascript.json');



function compileSnippet(srcDirectory, output) {
    var sourceFolder = path.resolve(srcDirectory);

    var files = fs.readdirSync (sourceFolder);
    var snippets = files.map (function (name) {
        return getSnippet (name);
    }).reduce (function (result, snippet) {
        return _.merge (result, snippet);
    }, {});

    fspath.writeFileSync (output || 'snippets/javascript.json', JSON.stringify (snippets, null, '\t'));

    function getSnippet(name) {
        var result = {};
        var json = require (path.resolve (sourceFolder, name, 'snippet'));
        var body = fs.readFileSync (path.resolve ('templates', name, json.body), 'utf8');
        result[name] = _.merge ({}, json, {body: body.split ('\n')});
        return result;
    }

}