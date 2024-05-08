const express = require('express');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors');
const app = express();

/* const rutaDir = "redundancia0.duckdns.org"; */
const rutaDir = "localhost";

const ruta = `http://${rutaDir}:8080`; // RUTA DE LA API
const rutaWeb = `http://${rutaDir}`; // RUTA DE LA WEB

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'html/uploads/'); // Directorio donde se guardarán los archivos subidos
  },
  filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Nombre de archivo único
  }
});


const upload = multer({ storage: storage });

// CLAVES PARA EL CERTIFICADO SSL (HTTPS) DEL CERTBOT

/* const privateKey = fs.readFileSync('/etc/letsencrypt/live/redundancia0.duckdns.org/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/redundancia0.duckdns.org/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/redundancia0.duckdns.org/chain.pem', 'utf8');
 */
/* const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
}; */

// GESTOR DE SESIONES
app.use(session({
  secret: 'playAlmiRedundancia0!?!?!?',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.single('avatar'));


/* const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
 */

// COMPROBAR SESIÓN DE USUARIO
const checkSession = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// COMPROBAR SESIÓN DE ADMIN
const checkSessionAdmin = (req, res, next) => {
  if (!req.session.user || req.session.rank != 1) {
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

app.get('/admin', checkSessionAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'admin.html'))
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
        req.session.id_user = response.data.data._id;
        req.session.rank = response.data.data.rango;
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

function navAdminLi(req){
  console.log(req.session.rank)
  if (req.session.rank == 1){
    return `<li class="nav-item"><a class="nav-link" href="/admin">Admin</a></li>`;
  } else{
    return '';
  }
}

function navAdminLiActive(req){
  console.log(req.session.rank)
  if (req.session.rank == 1){
    return `<li class="nav-item active"><a class="nav-link" href="/admin">Admin</a></li>`;
  } else{
    return '';
  }
}

app.get('/obtenerPartidas5', checkSession, (req, res) => {
  axios.get(`${ruta}/api/partidas/findbyid/${req.session.id_user}`)
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
})

// GESTIÓN DEL NAVBAR
app.post('/navbar', (req, res) => {
  if (req.session.user && req.body.pagina == 'home'){
    res.send(`<div class="container">
    <a href="/" class="navbar-brand">FactorySurfer</a>
    <div class="menu-toggle" onclick="toggleMenu()">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>          
  <ul class="navbar-nav" id="navbarMenu">
    <li class="nav-item active"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="/leaderboard" class="nav-link">Leaderboard</a></li>
    <li class="nav-item"><a class="nav-link" href="/perfil">${req.session.user}</a></li>
    ${navAdminLi(req)}
    <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
  </ul>
  <div id="reproductor">
    <audio controls>
        <source src="mp3/Guardians_of_Honor.mp3" type="audio/mpeg">
        Tu navegador no soporta el elemento de audio.
    </audio>
  </div>
</div>`);
  } else if (req.session.user && req.body.pagina == 'leaderboard') {
    res.send(`<div class="container">
    <a href="/" class="navbar-brand">FactorySurfer</a>
    <div class="menu-toggle" onclick="toggleMenu()">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>          
  <ul class="navbar-nav" id="navbarMenu">
    <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item active"><a href="/leaderboard" class="nav-link">Leaderboard</a></li>
    <li class="nav-item"><a class="nav-link" href="/perfil">${req.session.user}</a></li>
    ${navAdminLi(req)}
    <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
  </ul>
  <div id="reproductor">
    <audio controls>
        <source src="mp3/Guardians_of_Honor.mp3" type="audio/mpeg">
        Tu navegador no soporta el elemento de audio.
    </audio>
  </div>
</div>`);
  } else if (req.session.user && req.body.pagina == 'perfil') {
    res.send(`<div class="container">
    <a href="/" class="navbar-brand">FactorySurfer</a>
    <div class="menu-toggle" onclick="toggleMenu()">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>          
  <ul class="navbar-nav" id="navbarMenu">
    <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="/leaderboard" class="nav-link">Leaderboard</a></li>
    <li class="nav-item active"><a class="nav-link" href="/perfil">${req.session.user}</a></li>
    ${navAdminLi(req)}
    <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
  </ul>
  <div id="reproductor">
    <audio controls>
        <source src="mp3/Guardians_of_Honor.mp3" type="audio/mpeg">
        Tu navegador no soporta el elemento de audio.
    </audio>
  </div>
</div>`);
  } else if (req.session.user && req.body.pagina == 'admin') {
    res.send(`<div class="container">
    <a href="/" class="navbar-brand">FactorySurfer</a>
    <div class="menu-toggle" onclick="toggleMenu()">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>          
  <ul class="navbar-nav" id="navbarMenu">
    <li class="nav-item"><a href="/" class="nav-link">Home</a></li>
    <li class="nav-item"><a href="/leaderboard" class="nav-link">Leaderboard</a></li>
    <li class="nav-item"><a class="nav-link" href="/perfil">${req.session.user}</a></li>
    ${navAdminLiActive(req)}
    <li class="nav-item"><a class="nav-link" href="/logout">Logout</a></li>
  </ul>
  <div id="reproductor">
    <audio controls>
        <source src="mp3/Guardians_of_Honor.mp3" type="audio/mpeg">
        Tu navegador no soporta el elemento de audio.
    </audio>
  </div>
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
  
  axios.get(`${ruta}/api/usuarios/findbyid/${id_user}`)
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

app.post('/topUsuarios', (req, res) => {
  axios.get(`${ruta}/api/partidas/top`)
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
})

app.post('/updateUserAvatar', (req, res) => {
  const { avatar, idUsuario } = req.body;

  if (!avatar || !idUsuario) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  let avatarRuta;

  if (avatar == 1){
    avatarRuta = `${rutaWeb}/img/avatar/1.png`;
  } else if (avatar == 2){
    avatarRuta = `${rutaWeb}/img/avatar/2.png`;
  } else if (avatar == 3){
    avatarRuta = `${rutaWeb}/img/avatar/3.png`;
  }

  const userData = {
    avatar: avatarRuta,
  };

  axios.put(`${ruta}/api/usuarios/findbyid/${idUsuario}`, userData)
    .then(response => {
      console.log('Server response:', response.data);
      res.status(200).json({
        message: "User data updated successfully",
        userId: idUsuario,
      });
    })
    .catch(error => {
      console.error('Error while making PUT request:', error);
      if (error.response) {
        res.status(error.response.status).json({
          message: "Error updating user data",
          error: error.response.data,
          userId: idUsuario,
        });
      } else if (error.request) {
        res.status(500).json({
          message: "No response received from server",
          userId: idUsuario,
        });
      } else {
        res.status(500).json({
          message: "Error setting up request",
          error: error.message,
          userId: idUsuario,
        });
      }
    });
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
app.use(cors());

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


// CUANDO ESTÉ EN PRODUCCIÓN, PARA EL SSL
/* httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
*/
