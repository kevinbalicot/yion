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
        const pattern = `^${this.pattern}([^\\?]+)`;
        const regexp = new RegExp(pattern, 'i');
        const result = regexp.exec(url);

        if (!!result && fs.existsSync(this.target + result[1])) {
            return result[1];
        }

        return null;
    }

    /**
     * @protected
     * @param {string|null} ext
     *
     * @return {string}
     *
     * @alias: module:link
     */
    _getContentType(ext) {
        switch (ext) {
            case 'ogg': return 'application/ogg';
            case 'pdf': return 'application/pdf';
            case 'json': return 'application/json';
            case 'xml': return 'application/xml';
            case 'zip': return 'application/zip';
            case 'js': return 'application/js';

            case 'gif': return 'image/gif';
            case 'jpeg':
            case 'jpg': return 'image/jpeg';
            case 'png': return 'image/png';
            case 'tiff': return 'image/tiff';
            case 'svg': return 'image/svg+xml';
            case 'ico': return 'image/x-icon';

            case 'css': return 'text/css';
            case 'csv': return 'text/csv';
            case 'html':
            case 'htm': return 'text/html';

            case 'mp3': return 'audio/mpeg';

            case 'mpg':
            case 'mpeg': return 'video/mpeg';
            case 'm4v':
            case 'm4a':
            case 'mp4': return 'video/mp4';
            case 'mov': return 'video/quicktime';
            case 'wmv': return 'video/x-ms-wmv';
            case 'avi': return 'video/x-msvideo';
            case 'flv': return 'video/x-flv';
            case 'webm': return 'video/webm';

            default: return 'text/plain';
        }
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
            const ext = targetFile.split('.').pop();
            const file = fs.readFileSync(this.target + targetFile);

            res.set('Content-Length', stats.size);
            res.set('Content-Type', this._getContentType(ext || null));
            res.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(targetFile.replace('/', '')));
            res.send(file, 'binary');
            res.matched = true;
        } else {
            next(...args);
        }
    }
}

module.exports = Link;
