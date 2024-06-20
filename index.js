// const express = require('express');
// const exphbs = require('express-handlebars');
// const fileUpload = require('express-fileupload');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcryptjs');
// const { Pool } = require('pg');
// const app = express();

// // Configuraciones
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(fileUpload());

// // Configuración de la base de datos
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'skatepark',
//   password: '11235',
//   port: 5432,
// });

// // Endpoint para verificar que el servidor funciona
// app.get('/', (req, res) => {
//   res.send('Servidor funcionando');
// });

// app.post('/upload', (req, res) => {
//     let sampleFile;
//     let uploadPath;
  
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).send('No files were uploaded.');
//     }
  
//     sampleFile = req.files.sampleFile;
//     uploadPath = __dirname + '/uploads/' + sampleFile.name;
  
//     sampleFile.mv(uploadPath, (err) => {
//       if (err)
//         return res.status(500).send(err);
  
//       res.send('File uploaded!');
//     });
//   });
  
//   const secretKey = 'your_secret_key';

// function generateToken(user) {
//   return jwt.sign(user, secretKey, { expiresIn: '1h' });
// }

// function verifyToken(req, res, next) {
//   const token = req.headers['authorization'];

//   if (!token) return res.status(403).send('Token is required.');

//   jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) return res.status(500).send('Invalid token.');

//     req.user = decoded;
//     next();
//   });
// }

// app.get('/perfil', verifyToken, (req, res) => {
//     const user = req.user;
//     // Renderiza la vista de perfil con los datos del usuario
//     res.render('perfil', { user });
//   });
  
//   // Ejemplo para obtener todos los participantes
// app.get('/participantes', async (req, res) => {
//     try {
//       const result = await pool.query('SELECT * FROM skaters');
//       res.json(result.rows);
//     } catch (err) {
//       res.status(500).send(err.message);
//     }
//   });
  


// // Puerto de escucha
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor escuchando en el puerto ${PORT}`);
// });

const express = require('express');
const mime = require('mime');
const { engine } = require('express-handlebars');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const app = express();

// Configuraciones
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'skatepark',
  password: '11235',
  port: 5432,
});

// Endpoint para verificar que el servidor funciona
app.get('/', (req, res) => {
//   res.send('Servidor funcionando');
res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
      const mimeType = mime.lookup(path);
      res.setHeader('Content-Type', mimeType);
    }
  }));

app.post('/upload', (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/uploads/' + sampleFile.name;

  sampleFile.mv(uploadPath, (err) => {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

const secretKey = 'your_secret_key';

function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: '1h' });
}

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) return res.status(403).send('Token is required.');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(500).send('Invalid token.');

    req.user = decoded;
    next();
  });
}

app.get('/perfil', verifyToken, (req, res) => {
  const user = req.user;
  // Renderiza la vista de perfil con los datos del usuario
  res.render('perfil', { user });
});

// Ejemplo para obtener todos los participantes
app.get('/participantes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skaters');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

