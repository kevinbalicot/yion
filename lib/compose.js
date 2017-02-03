module.exports = (req, res, middlewares) => {
    let next = () => res.status(404).send('Not found');
    let i = middlewares.length;

    while (i--) {
        next = middlewares[i].process.bind(middlewares[i], req, res, next);
    }

    return next;
};
