import express from "express";
let router = express.Router();

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";

function validateId(req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).send("Invalid ID format");
  }
  req.numericId = id;
  next();
}

async function validateTrackId(req, res, next) {
  if (!req.body?.trackId) {
    return res.status(400).send("Request body requires: trackId");
  }

  const trackId = Number(req.body.trackId);
  if (isNaN(trackId)) {
    return res.status(400).send("trackId must be a number");
  }

  const track = await getTrackById(trackId);
  if (!track) {
    return res.status(400).send("Track not found");
  }

  req.numericTrackId = trackId;
  next();
}
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId, getTrackById } from "#db/queries/tracks";

router.get("/", async (req, res) => {
  let playlists = await getPlaylists();
  res.send(playlists);
});

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  let { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");

  let playlist = await createPlaylist(name, description);
  res.status(201).send(playlist);
});

router.get("/:id", validateId, async (req, res) => {
  const playlist = await getPlaylistById(req.numericId);
  if (!playlist) {
    return res.status(404).send("Playlist not found");
  }
  res.send(playlist);
});

router.get("/:id/tracks", validateId, async (req, res) => {
  const playlist = await getPlaylistById(req.numericId);
  if (!playlist) {
    return res.status(404).send("Playlist not found");
  }
  const tracks = await getTracksByPlaylistId(req.numericId);
  res.send(tracks);
});

router.post("/:id/tracks", validateId, validateTrackId, async (req, res) => {
  const playlist = await getPlaylistById(req.numericId);
  if (!playlist) {
    return res.status(404).send("Playlist not found");
  }

  try {
    const playlistTrack = await createPlaylistTrack(
      req.numericId,
      req.numericTrackId
    );
    res.status(201).send(playlistTrack);
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).send("Track is already in the playlist");
    }
    throw error;
  }
});
export default router;
