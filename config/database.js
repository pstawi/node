const mysql = require('mysql2');
// initialisation connexion à la base de données

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cocktailsdb'
});

// export de la connexion à la base de données
module.exports = connection;