import api_uri from "../config";
import { getLocalStorage } from "../session";

//para la imagen de perfil
export async function ProfileImageApi() {
  const id = getLocalStorage("data_user").id;
  const response = await fetch(`${api_uri}/user/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

//para actualizar la información del usuario
export async function updateUserInfoApi(formData) {
  const response = await fetch(`${api_uri}/user/update`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

//para eliminar la cuenta
export async function deleteAccountApi(password) {
  const id = getLocalStorage("data_user").id;
  const response = await fetch(`${api_uri}/user/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

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
    IdUser: usuario_id,
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
      album_id,
      nombre,
      usuario_id,
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
      usuario_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

export async function UploadImage(album_id, descripcion, file) {
  const usuario_id = getLocalStorage("data_user").id;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("album_id", album_id);
  formData.append("descripcion", descripcion);
  formData.append("usuario_id", usuario_id);

  const response = await fetch(`${api_uri}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

export async function GetAlbumGridApi() {
  const usuario_id = getLocalStorage("data_user").id;
  const response = await fetch(`${api_uri}/image/gallery`, {
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

  return data;
}

export async function GetGalleryApi(album_id) {
  const response = await fetch(`${api_uri}/image/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      album_id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

export async function GetTagsApi(id, descripcion) {
  const response = await fetch(`${api_uri}/image/getags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      descripcion,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}

export async function GetTranslateApi(text, lang) {
  const response = await fetch(`${api_uri}/image/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      lang,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || response.statusText);
  }

  return data;
}
