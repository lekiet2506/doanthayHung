import { Router } from "express";
import movieModel from "../Model/movie.js";
import authorizationMiddleWare from "../Middleware/authorization.js";

import dotenv from "dotenv";
dotenv.config();

const movieRoute = Router();
movieRoute.post("/addfilm", async (req, res) => {
  const { ...movie } = req.body;
  const isExists = await movieModel.findOne(
    { nameFilm: movie?.nameFilm },
    { _id: 0, nameFilm: 1 }
  );

  if (!isExists) {
    movieModel.create({ ...movie }, (err) => {
      if (err) res.sendStatus(500);
      console.log("Created new movie!");
      return res.send({ type: "success" });
    });
  } else {
    return res.status(400).send("movie exist");
  }
});

movieRoute.get("/getList", authorizationMiddleWare, async (req, res) => {
  try {
    const movieList = await movieModel.find(
      {},
      {
        nameFilm: 1,
        _id: 0,
        picture: 1,
        date: 1,
        time: 1,
        genres: 1,
        content: 1,
        directors: 1,
        actors: 1,
      }
    );
    res.send(movieList);
  } catch (error) {
    // res.status(500).send('Internal server error')
  }
});

export default movieRoute;
