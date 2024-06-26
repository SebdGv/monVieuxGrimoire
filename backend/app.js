const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

//Importer les routes
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

// Connexion à la base de données MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json()); // Middleware pour parser le corps des requêtes en JSON

app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware pour configurer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  // Gérer les requêtes OPTIONS
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Utiliser les routes définies pour les livres et les utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
