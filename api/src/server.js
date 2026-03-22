const app = require('./app'); 

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`
◉ PORTARIA API
─────────────────────────────
  Port    : ${PORT}
  Env     : ${process.env.NODE_ENV || 'development'}
─────────────────────────────
  npm run dev          start (keep data)
  npm run dev:fresh    start (wipe data)
  npm run db:reset     wipe data only
  npm test             run test suite
─────────────────────────────
`);
})