const fs = require('fs');

class Link {
    constructor (pattern, target) {
        this.pattern = pattern;
        this.target = target;
    }

    _validPattern (url) {
        const pattern = `^${this.pattern}(.*)`;
        const regexp = new RegExp(pattern, 'g');
        const result = regexp.exec(url);

        if (!!result && fs.existsSync(this.target + result[1])) {
            return result[1];
        }
        return null;
    }

    process (req, res, next) {
        let targetFile = this._validPattern(req.url);
        if (!!targetFile) {
            const stats = fs.statSync(this.target + targetFile);
            const file = fs.readFileSync(this.target + targetFile);

            res.set('Content-Length', stats.size);
            res.set('Content-Disposition', 'attachment; filename=' + targetFile.replace('/', ''));
            res.send(file, 'binary');
            res.matched = true;
        } else {
            next();
        }
    }
}

module.exports = Link;
