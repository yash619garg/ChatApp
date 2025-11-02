import dataUriParser from "datauri/parser.js"
import path, { extname } from "path"

export const getDataUri = (file) => {
    const parser = new dataUriParser();
    console.log(file);

    const extName = path.extname(file.originalname).toString();
    console.log(extName);
    return parser.format(extName, file.buffer);

}