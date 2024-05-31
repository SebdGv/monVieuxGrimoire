const express = require("express");

const app = express();

app.use(express.json());

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

  next();
});

app.post("api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({ message: "livre créé !" });
});

app.get("/api/books", (req, res, next) => {
  const books = [
    {
      userId: "oeihfzeoi",
      title: "Les misérables",
      author: "Victor Hugo",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      year: 4900,
      genre: "SF",
      ratings: [
        {
          userID: "oeihfzeoi",
          grade: 4,
        },
      ],
      averageRating: 4,
    },
    {
      userId: "oeihoi",
      title: "John Rambo",
      author: "Charles Beaudelaire",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      year: 2016,
      genre: "Recueil de poèmes",
      ratings: [
        {
          userID: "oeiheoi",
          grade: 5,
        },
      ],
      averageRating: 4.9,
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
