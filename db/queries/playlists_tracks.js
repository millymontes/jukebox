import db from "#db/client";

export async function createPlaylistTrack(playlistId, trackId) {
  let sql = `
  INSERT INTO playlists_tracks
    (playlist_id, track_id)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  let {
    rows: [playlistTrack],
  } = await db.query(sql, [playlistId, trackId]);
  return playlistTrack;
}
