import db from "#db/client";

export async function createPlaylist(name, description) {
  let sql = `
  INSERT INTO playlists
    (name, description)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  let {
    rows: [playlist],
  } = await db.query(sql, [name, description]);
  return playlist;
}

export async function getPlaylists() {
  let sql = `
  SELECT *
  FROM playlists
  `;
  let { rows: playlists } = await db.query(sql);
  return playlists;
}

export async function getPlaylistById(id) {
  let sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  let {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}
