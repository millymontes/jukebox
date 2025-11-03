import express from "express";
import playlistsRouter from "./api/playlists.js";
import tracksRouter from "./api/tracks.js";

const app = express();

app.use(express.json());

app.use("/playlists", playlistsRouter);
app.use("/tracks", tracksRouter);

export default app;
