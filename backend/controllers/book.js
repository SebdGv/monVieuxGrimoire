const Book = require("../models/Book");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

exports.createBook = (req, res, next) => {
  console.log("Received book data:", req.body);

  // Parser les données du livre à partir de la requête
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  // Créer une nouvelle instance de livre avec les données parsées
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // Sauvegarder le nouveau livre dans la base de données
  book
    .save()
    .then((createdBook) => {
      res
        .status(201)
        .json({ message: "Objet enregistré !", bookId: createdBook._id });
    })
    .catch((error) => {
      console.error("Error saving book:", error);
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;

  // Trouver le livre à modifier en fonction de son id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // SUPPRIMER L'ANCIENNE IMAGE OPTIMISÉE SI UNE NOUVELLE IMAGE EST TÉLÉCHARGÉE
      if (req.file) {
        const oldFilename = book.imageUrl.split("/images/")[1];
        const oldFilePath = path.join(__dirname, "../images", oldFilename);

        fs.promises
          .unlink(oldFilePath)
          .then(() => {
            console.log(`Deleted previous optimized file: ${oldFilePath}`);
          })
          .catch((error) => {
            console.error("Error deleting previous optimized image:", error);
          });
      }
      // Mettre à jour les détails du livre
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Objet modifié!" }))
        .catch((error) => {
          console.error("Error updating book:", error);
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      console.error("Error finding book:", error);
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  // Trouver le livre à supprimer selon id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Supprimer le livre dans la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => {
      console.error("Error fetching book:", error);
      if (!res.headersSent) {
        res.status(400).json({ error });
      }
    });
};

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => {
      console.error("Error fetching books:", error);
      if (!res.headersSent) {
        res.status(400).json({ error });
      }
    });
};

exports.rateBook = (req, res, next) => {
  const { id } = req.params;
  const rating = parseInt(req.body.rating, 10);
  const userId = req.auth.userId;
  console.log("Received ID:", id);
  console.log("Received rating:", rating);

  // Valider la valeur de la note
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res
      .status(400)
      .json({ message: "Rating should be between 1 and 5" });
  }
  // Valider l'ID du livre
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  // Trouver le livre pour ajouter ou mettre à jour la note
  Book.findOne({ _id: id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Ajouter ou mettre à jour la note de l'utilisateur dans le tableau `ratings`
      const existingRatingIndex = book.ratings.findIndex(
        (rating) => rating.userId === userId
      );

      if (existingRatingIndex !== -1) {
        // Mettre à jour la note existante
        book.ratings[existingRatingIndex].grade = rating;
      } else {
        // Ajouter une nouvelle note
        book.ratings.push({ userId, grade: rating });
      }

      // Recalculer la note moyenne
      const newRatingsCount = book.ratings.length;
      const newAverageRating =
        book.ratings.reduce((acc, curr) => acc + curr.grade, 0) /
        newRatingsCount;

      book.averageRating = Math.round(newAverageRating * 100) / 100;

      return book.save();
    })
    .then((updatedBook) => {
      console.log("Book rating updated successfully");
      res.status(200).json(updatedBook); // Retourner le livre mis à jour
    })
    .catch((error) => {
      console.error("Error updating book rating:", error);
      res.status(500).json({ error });
    });
};

exports.bestRatingBooks = (req, res, next) => {
  Book.find({ averageRating: { $gte: 1 } })
    .sort({ averageRating: -1 }) // Trier les livres par note moyenne décroissante
    .limit(3) // Limiter le résultat à 3 livres
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
