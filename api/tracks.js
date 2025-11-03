import express from "express";
let router = express.Router();

import { getTracks, getTrackById } from "#db/queries/tracks";

function validateId(req, res, next) {
  let id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("Invalid ID format");
  }
  req.numericId = id;
  next();
}

router.get("/", async (req, res) => {
  let tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", validateId, async (req, res) => {
  let track = await getTrackById(req.numericId);
  if (!track) {
    return res.status(404).send("Track not found");
  }
  res.send(track);
});
export default router;
