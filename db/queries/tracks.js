import db from "#db/client";

export async function createTrack(name, durationMs) {
  let sql = `
  INSERT INTO tracks
    (name, duration_ms)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  let {
    rows: [track],
  } = await db.query(sql, [name, durationMs]);
  return track;
}

export async function getTracks() {
  let sql = `
  SELECT *
  FROM tracks
  `;
  let { rows: tracks } = await db.query(sql);
  return tracks;
}

export async function getTracksByPlaylistId(id) {
  let sql = `
  SELECT tracks.*
  FROM
    tracks
    JOIN playlists_tracks ON playlists_tracks.track_id = tracks.id
    JOIN playlists ON playlists.id = playlists_tracks.playlist_id
  WHERE playlists.id = $1
  `;
  let { rows: tracks } = await db.query(sql, [id]);
  return tracks;
}

export async function getTrackById(id) {
  let sql = `
  SELECT *
  FROM tracks
  WHERE id = $1
  `;
  let {
    rows: [track],
  } = await db.query(sql, [id]);
  return track;
}
