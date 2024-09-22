import api_uri from "../config";
import { getLocalStorage } from "../session";

export async function AlbumAddApi(usuario_id, nombre) {
  const response = await fetch(`${api_uri}/album/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario_id,
      nombre,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

export async function AlbumGetApi() {
  const usuario_id = getLocalStorage("data_user").id;
  const response = await fetch(`${api_uri}/album/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  const album = {
    albums: data,
    IdUser: usuario_id
  };

  return album;
}

export async function AlbumUpdateApi(album_id, nombre, usuario_id) {
  const response = await fetch(`${api_uri}/album/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      album_id, nombre, usuario_id
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

export async function AlbumDeleteApi(album_id, usuario_id) {
  const response = await fetch(`${api_uri}/album/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      album_id, 
      usuario_id
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}