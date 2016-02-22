var fs = require ('fs');
var path = require ('path');
var _ = require ('lodash');
var fspath = require ('fs-path');
var xmlParser = require ('xml2json');

compileSnippet('./templates/', './snippets/javascript.json');



function compileSnippet(srcDirectory, output) {
    var sourceFolder = path.resolve(srcDirectory);

    var files = fs.readdirSync (sourceFolder);
    var snippets = _(files)
        .chain()
        .map(function (name) {
            return getSnippet (name);
        })
        .filter()
        .reduce (function (result, snippet) {
            return _.merge (result, snippet);
        }, {})
        .value();

    fspath.writeFileSync (output || 'snippets/javascript.json', JSON.stringify (snippets, null, '\t'));

    function getSnippet(snippetName){
        var result = {};
        if(path.parse(snippetName).ext !== '.xml'){
            return;
        }
        var xml = fs.readFileSync (path.resolve ('./templates', snippetName), 'utf8');
        var snippet = xmlParser.toJson (xml, {
            object: true,
            sanitize: false
        }).snippet;
        snippet.body = (_.isString(snippet.body) ? snippet.body: '').split('\n');
        result[snippet.displayName] = snippet;
        delete result[snippet.displayName].displayName;

        return result;
    }
}