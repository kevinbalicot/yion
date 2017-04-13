const fs = require('fs');
const Middleware = require('./middleware');

/**
 * Link module
 * @module Link
 * @example
 * const Link = require('yion/lib/link');
 *
 * const link = new Link('/js', __dirname + '/public/js');
 * [ ... ]
 * link.process(req, res);
 */
class Link extends Middleware {

    /**
     * @extends Middleware
     * @param {string} pattern - what you use into html file (into link or script tags)
     * @param {string} target - filepath where there are files
     *
     * @alias module:Link
     */
    constructor(pattern, target) {
        super(null);

        this.pattern = pattern;
        this.target = target;
    }

    /**
     * @protected
     * @param {string} url
     *
     * @returns {string|null}
     *
     * @alias module:Link
     */
    _validPattern(url) {
        const pattern = `^${this.pattern}(.*)`;
        const regexp = new RegExp(pattern, 'g');
        const result = regexp.exec(url);

        if (!!result && fs.existsSync(this.target + result[1])) {
            return result[1];
        }

        return null;
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {Callback} next
     * @param {Array} [args]
     *
     * @alias module:Link
     */
    process(req, res, next, ...args) {
        let targetFile = this._validPattern(req.url);
        if (!!targetFile) {
            const stats = fs.statSync(this.target + targetFile);
            const file = fs.readFileSync(this.target + targetFile);

            res.set('Content-Length', stats.size);
            res.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(targetFile.replace('/', '')));
            res.send(file, 'binary');
            res.matched = true;
        } else {
            next(...args);
        }
    }
}

module.exports = Link;
