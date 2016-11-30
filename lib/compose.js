module.exports = (req, res, middlewares) => {
    let next = () => {};
    let i = middlewares.length;

    while (i--) {
        next = middlewares[i].process.bind(middlewares[i], req, res, next);
    }

    return next;
};
