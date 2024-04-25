const express = require('express');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const ruta = "http://localhost:8080";

app.use(session({
  secret: 'playAlmiRedundancia0!?!?!?',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.single('avatar'));

const checkSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'login.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'leaderboard.html'))
})

app.post('/login', (req, res) => {
  let usuario = req.body.usuario;
  let clave = req.body.clave;
  const url = `${ruta}/api/usuarios/login/`;
  const data = {
    nombre: usuario,
    clave: clave
  };

  axios.post(url, data)
    .then(response => {
      console.log('Respuesta del servidor:', response.data);
      if (response.data.message === 'Inicio de sesión exitoso') {
        req.session.user = usuario;
        req.session.id_user = response.data.data._id
        console.log(req.session.id_user);
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

/* app.post('/datosUsuario', (req, res) => {
  const url = `${ruta}/api/usuarios/findbyid/${}`;
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


}) */

app.post('/navbar', (req, res) => {
  if (req.session.user && req.body.pagina == 'home'){
    res.send(`<div class="container">
        <a class="navbar-brand" href="/">FactorySurfer</a>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item active"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/leaderboard">Leaderboard</a></li>
            <li class="nav-item"><a class="nav-link" href="/perfil">${req.session.user}</a></li>
            <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
        </ul>
    </div>`);
  } else if (req.session.user && req.body.pagina == 'leaderboard') {
    res.send(`<div class="container">
      <a class="navbar-brand" href="/">FactorySurfer</a>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item active"><a class="nav-link" href="/leaderboard">Leaderboard</a></li>
            <li class="nav-item"><a class="nav-link" href="/perfil">${req.session.user}</a></li>
            <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
        </ul>
    </div>`);
  } else if (req.session.user && req.body.pagina == 'perfil') {
    res.send(`<div class="container">
      <a class="navbar-brand" href="/">FactorySurfer</a>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item"><a class="nav-link" href="/">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="/leaderboard">Leaderboard</a></li>
            <li class="nav-item active"><a class="nav-link" href="/perfil">${req.session.user}</a></li>
            <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
        </ul>
    </div>`);
  }
  else {
    res.send(`invalido`)
  }
})

app.get('/perfil', checkSession, (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'perfil.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'register.html'));
});

app.post('/perfil', (req, res) => {
  let id_user = req.session.id_user;
  
  axios.get(`http://localhost:8080/api/usuarios/findbyid/${id_user}`)
      .then(response => {
          console.log('Respuesta del servidor:', response.data);
          res.status(200).json(response.data);
      })
      .catch(error => {
          console.error('Error al hacer la petición POST:', error);
          res.status(500).json({
              message: "Error while fetching user information"
          });
      });
});


app.post('/register', (req, res) => {
    const { username, email, password, confirm_password } = req.body;
    const avatar = req.file;

    let avatarValue = "-";
    if (avatar) {
        avatarValue = avatar.originalname;
    }

    const userData = {
        nombre: username,
        clave: password,
        correo: email,
        monedas: 0,
        avatar: avatarValue,
        rango: 0,
        puntuacion: 0
    };

    if (avatar) {
        const nombreArchivo = username + '_' + Date.now() + path.extname(avatar.originalname);
        const rutaArchivo = './uploads/' + nombreArchivo;

        fs.writeFile(rutaArchivo, avatar.buffer, (err) => {
            if (err) {
                console.error('Error al guardar el avatar:', err);
                return res.status(500).json({
                    message: "Error while trying to register user",
                    username: username,
                    email: email,
                    avatar: "No avatar uploaded"
                });
            }

            userData.avatar = nombreArchivo;
            console.log(userData.avatar);

            axios.post('http://localhost:8080/api/usuarios', userData)
                .then(response => {
                    console.log('Respuesta del servidor:', response.data);
                    res.status(200).json({
                        message: "User registered successfully",
                        username: username,
                        email: email,
                        avatar: avatar.originalname
                    });
                })
                .catch(error => {
                    console.error('Error al hacer la petición POST:', error);
                    res.status(500).json({
                        message: "Error while trying to register user",
                        username: username,
                        email: email,
                        avatar: avatar.originalname
                    });
                });
        });
    } else {
        axios.post('http://localhost:8080/api/usuarios', userData)
            .then(response => {
                console.log('Respuesta del servidor:', response.data);
                res.status(200).json({
                    message: "User registered successfully",
                    username: username,
                    email: email,
                    avatar: "No avatar uploaded"
                });
            })
            .catch(error => {
                console.error('Error al hacer la petición POST:', error);
                res.status(500).json({
                    message: "Error while trying to register user",
                    username: username,
                    email: email,
                    avatar: "No avatar uploaded"
                });
            });
    }
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
