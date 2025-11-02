import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single("file");
// if we want our file as req.file then single("file")
// if we want our file as req.image then single("image")
// and kept this as middleware b/w routes