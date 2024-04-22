const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true
}));

const checkSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.post('/login', (req, res) => {
  req.session.user = 'usuario';
  res.redirect('/');
});

app.get('/', checkSession, (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/login');
    }
  });
});

app.use(express.static(path.join(__dirname, 'html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
