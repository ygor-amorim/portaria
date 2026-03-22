// eslint-disable-next-line no-unused-vars
module.exports = (err, _req, res, _next) => {
    const status = err.status || 500;
    if (status === 500) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(status).json({ error: err.message });
};
