import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { nanoid } from "nanoid/non-secure";

function uriToBlob(uri: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error("uriToBlob failed"));
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
}

export async function uploadJournalImage(uri: string): Promise<string> {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not authenticated");

  const blob = await uriToBlob(uri);

  const storage = getStorage();
  const imageRef = ref(storage, `journals/${user.uid}/${nanoid()}.jpg`);

  const uploadTask = uploadBytesResumable(imageRef, blob, {
    contentType: "image/jpeg",
  });

  await new Promise<void>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      () => resolve()
    );
  });

  return await getDownloadURL(uploadTask.snapshot.ref);
}
