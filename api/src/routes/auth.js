const express = require('express');

module.exports = (app) => {
    const router = express.Router();
    const authService = require('../services/auth')(app);

    // POST /auth/signup — register organization + first admin user
    router.post('/signup', async (req, res, next) => {
        try {
            const result = await authService.signup(req.body);
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    });

    // POST /auth/signin — login, get JWT
    router.post('/signin', async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await authService.signin(email, password);
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    return router;
};
