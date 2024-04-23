const express = require('express');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

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
  let usuario = req.body.usuario;
  let clave = req.body.clave;
  const url = 'http://localhost:8080/api/usuarios/login/';
  const data = {
    nombre: usuario,
    clave: clave
  };

  axios.post(url, data)
    .then(response => {
      console.log('Respuesta del servidor:', response.data);
      if (response.data.message === 'Inicio de sesión exitoso') {
        req.session.user = usuario;
        res.redirect('/');
      } else {
        res.redirect("/login");
      }
    })
    .catch(error => {
      console.error('Error al hacer la solicitud:', error);
      res.redirect("/login");
    });
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

app.get('/', (req, res) => {
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
