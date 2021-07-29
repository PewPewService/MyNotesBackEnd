/* eslint-disable linebreak-style */
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
import {existsSync, mkdirSync, writeFileSync, rmSync, readdirSync,
  copyFileSync} from 'fs';
// const multer = require('multer');

export class FilesController {
   public saveImages =
    (images: Array<string>, userId: number, noteId: number) => {
      try {
        const userDirectory = `./images/${userId}/${noteId}`;
        const imagesPaths : Array<string> = [];
        if (!existsSync(userDirectory)) {
          mkdirSync(userDirectory, {recursive: true});
        }
        for (const image of images) {
          const fileName = new Date().getTime();
          const fullPath = `${userDirectory}/${fileName}`;
          writeFileSync(fullPath, image);
          imagesPaths.push(fullPath);
        }
        // this.saveImagePaths(userId, imagesPaths, noteId, res);
        return {status: 200, data: imagesPaths};
      } catch (err) {
        return {status: 500, data: err};
      }
    }

   /*  public saveImages =
    (images: FormData, userId: number, noteId: number) => {
      try {
        const userDirectory = `./images/${userId}/${noteId}`;
        const imagesPaths: Array<string> = [];
        const storage = multer.diskStorage({
          destination: function(req: Request, cb: any) {
            cb(null, userDirectory);
          },
          filename: function(req: Request, file: File, cb: any) {
            cb(null, file.name);
          },
        });
        const upload = multer({storage: storage});
        upload.array(images);
        return {status: 200, data: imagesPaths};
      } catch (err) {
        console.log(err);
        return {status: 500, data: err};
      }
    } */

    public deleteFolder = (noteId: number, userId: number) => {
      const folderPath = `./images/${userId}/${noteId}`;
      if (existsSync(folderPath)) rmSync(folderPath, {recursive: true});
    }

    public duplicateFolder =
      (oldNoteId: number, newNoteId: number, userId: number) => {
        try {
          const oldPath = `./images/${userId}/${oldNoteId}`;
          const newPath = `./images/${userId}/${newNoteId}`;
          if (!existsSync(newPath)) {
            mkdirSync(newPath, {recursive: true});
          }
          const files = readdirSync(oldPath);
          const imagesPaths: Array<string> = [];
          for (const file of files) {
            copyFileSync(`${oldPath}/${file}`, `${newPath}/${file}`);
            imagesPaths.push(`${newPath}/${file}`);
          }
          return {status: 200, data: imagesPaths};
        } catch (err) {
          return {status: 500, data: err};
        }
      }
}
