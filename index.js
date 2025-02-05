const express = require('express');
const dotenv = require('dotenv');
const mysql = require('./config/database');
const cors = require('cors');
const routeUser = require('./routes/user');

// chargement variables d'environnement
dotenv.config();

// définition du routeur
const app = express();

// utilisation du middleware express.json() 
// pour traiter les requêtes en JSON
app.use(express.json());
app.use(cors());

// route pour les utilisateurs
app.use('/user', routeUser)

// test connexion base de donnée

mysql.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// lancement server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
