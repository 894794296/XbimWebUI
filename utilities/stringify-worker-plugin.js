const fs = require('fs');
const path = require('path');
function StringifyWorkerPlugin() { }


StringifyWorkerPlugin.prototype.apply = function (compiler) {
    compiler.plugin('after-emit', function (compilation, callback) {
        var outDir = compilation.outputOptions.path;
        Object.getOwnPropertyNames(compilation.assets).forEach(a => {
            if (!a.endsWith('.js')) {
                return;
            }
            var data = fs.readFileSync(path.join(outDir, a), 'utf8');
            data = data.replace(/"/g, "\\\"");

            var name = path.basename(a, '.js');
            var content = `export const ${name} = "${data}"`;
            var result = path.join(outDir, name + '.ts');
            fs.writeFileSync(result, content, {encoding: 'utf8'});
        });
        callback();
    })
};

module.exports = StringifyWorkerPlugin;