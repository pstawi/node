const express = require('express');
const connection = require('../config/database');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

// Création des routes

// Route de connexion (login)
router.post('/login', (req, res) => {
    const { email, mot_de_passe } = req.body; // Récupération des données envoyées par l'utilisateur
    
    const sql = 'SELECT * FROM utilisateurs WHERE email = ?'; // Requête SQL pour récupérer l'utilisateur correspondant à l'email fourni
    
    // Exécution de la requête SQL préparée
    connection.query(sql, [email], (error, result) => {
        if (error || result.length === 0) {
            return res.status(401).send('Utilisateur non trouvé ou mot de passe incorrect');
        }

        const { nom } = result[0]; // Extraction du nom de l'utilisateur
        console.log(result);    

        // Comparaison du mot de passe fourni avec le mot de passe haché stocké en base de données
        bcryptjs.compare(mot_de_passe, result[0].mot_de_passe, (err, resultat) => {
            if (err || !resultat) {
                return res.status(401).send('Utilisateur non trouvé ou mot de passe incorrect');
            }

            // Génération du token JWT avec une durée de validité de 24h
            const token = jwt.sign({ email, nom }, process.env.secret_key, { expiresIn: '24h' });

            // Ajout du token dans l'en-tête de la réponse
            res.setHeader('Authorization', token);
            res.status(200).json(result[0]); // Renvoi des informations de l'utilisateur
            console.log(token);
        });
    });
});

// Route de création d'un utilisateur
router.post('/create', (req, res) => {
    const { nom, email, mot_de_passe } = req.body; // Récupération des données du formulaire

    // Hachage du mot de passe avec un facteur de coût de 2
    const hashedPassword = bcryptjs.hashSync(mot_de_passe, 2);

    const sql = 'INSERT INTO utilisateurs (nom, email, mot_de_passe) VALUES (?, ?, ?)';

    // Exécution de la requête SQL préparée
    connection.query(sql, [nom, email, hashedPassword], (err, result) => {
        if (err) {
            res.status(500).send('Erreur lors de la création de l\'utilisateur');
        } else {
            res.status(201).send('Utilisateur créé avec succès');
        }
    });
});

// Route pour récupérer tous les utilisateurs
router.get('/getAll', (req, res) => {
    const sql = 'SELECT * FROM utilisateurs';
    
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération des utilisateurs');
        } else {
            res.status(200).json(result);
        }
    });
});

// Route pour récupérer un utilisateur par son ID
router.get('/getById/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'SELECT * FROM utilisateurs WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
        } else if (result.length === 0) {
            res.status(404).send('Utilisateur non trouvé');
        } else {
            res.status(200).json(result[0]);
        }
    });
});

// Route pour mettre à jour un utilisateur
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nom, email, mot_de_passe } = req.body;
    
    const sql = 'UPDATE utilisateurs SET nom = ?, email = ?, mot_de_passe = ? WHERE id = ?';
    
    connection.query(sql, [nom, email, mot_de_passe, id], (err, result) => {
        if (err) {
            res.status(500).send('Erreur lors de la modification de l\'utilisateur');
        } else {
            res.status(200).send('Utilisateur modifié avec succès');
        }
    });
});

// Route pour supprimer un utilisateur
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM utilisateurs WHERE id = ?';
    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
        } else {
            res.status(200).send('Utilisateur supprimé avec succès');
        }
    });
});

// Exportation des routes pour pouvoir les utiliser dans l'application principale
module.exports = router;
