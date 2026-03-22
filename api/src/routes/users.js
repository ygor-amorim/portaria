const express = require('express');
const adminOnly = require('../middlewares/adminOnly');

module.exports = (app) => {
    const router = express.Router();
    const usersService = require('../services/users')(app);

    // GET /users — list org's users (admin only)
    router.get('/', adminOnly, async (req, res, next) => {
        try {
            const users = await usersService.findAll(req.user.organization_id);
            res.json(users);
        } catch (err) {
            next(err);
        }
    });

    // POST /users — create a new operator in the org (admin only)
    // role is always 'operator' — only admins are created via signup
    router.post('/', adminOnly, async (req, res, next) => {
        try {
            const user = await usersService.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                organization_id: req.user.organization_id,
                role: 'operator',
            });
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    });

    return router;
};
