/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
/* "dev": "node -r dotenv/config ./build/server.js
dotenv_config_path=env_development/.env.development", */
import {Router, Response, Request} from 'express';
import {NotesService} from '../services/notes.service';
import {UsersService} from '../services/users.service';
import {FilesController} from './files.controller';

export class NotesController {
    public router: Router;
    public notesService! : NotesService;
    public usersService! : UsersService;
    private filesController: FilesController;

    constructor() {
      this.notesService = new NotesService();
      this.usersService = new UsersService();
      this.filesController = new FilesController();
      this.router = Router();
      this.routes();
    }

    public userControl =
        async (req: Request, res: Response, func: Function) => {
          const jwt = req.body.jwt;
          const userId = await this.usersService.auth(jwt);
          if (userId.status == 200) {
            func(req, res, Number(userId.data));
          } else {
            res.status(400).send('Invalid token! Please, re-login.').json;
            res.end();
          }
        }

    /* private decodeBase64Image(dataString: string) {
      const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const response: any = {};
      if (matches && matches.length > 2) {
        const dataType = matches[1].match(/image\/([A-Za-z]+)/);
        if (dataType && dataType.length>1) {
          response.dataType = dataType[1];
          response.file = Buffer.from(matches[2], 'base64');
        }
      }
      return response;
    } */

    // private decodeBase64Image(dataString: string) {
    //   return Buffer.from(dataString, 'base64');
    // }

    private saveImagePaths = async (paths: Array<string>,
        userId: number, noteId: number, res: Response) => {
      const response =
        await this.notesService.saveImagePaths(paths, userId, noteId);
      res.status(response.status).send(response.data).json;
      res.end();
    }

    public createNote = async (req: Request, res: Response, userId: number) => {
      const note = req.body.note;
      const NewNote = await this.notesService.addNote(note, userId);
      if (NewNote.status == 200 && note.images.length > 0) {
        const noteId = NewNote.data.identifiers[0].id;
        const filePaths =
          this.filesController.saveImages(note.images, userId, noteId);
        console.log(filePaths);
        if (filePaths.status == 200) {
          await this.saveImagePaths(filePaths.data, userId, noteId, res);
        }
      } else {
        res.status(NewNote.status).send(NewNote.data).json;
        res.end();
      }
    }

    public getNote = async (req: Request, res: Response, userId: number) => {
      const id = req.params.id;
      const note = await this.notesService.getNote(Number(id), userId);
      res.status(note.status).send(note.data).json;
      res.end();
    }

    public editNote = async (req: Request, res: Response, userId: number) => {
      const NoteData = req.body.note;
      this.filesController.deleteFolder(Number(NoteData.id), userId);
      const filePaths =
        this.filesController.saveImages(NoteData.images, userId, NoteData.id);
      if (filePaths.status == 200) NoteData.images = filePaths.data;
      const EditedNote = await this.notesService.editNote(NoteData, userId);
      res.status(EditedNote.status).send(EditedNote.data).json;
      res.end();
    }

    public duplicateNote =
      async (req: Request, res: Response, userId: number) => {
        const id = Number(req.params.id);
        const duplicate = await this.notesService.duplicate(id, userId);
        if (duplicate.status == 200) {
          const filePaths =
            this.filesController.duplicateFolder(id, duplicate.data, userId);
          if (filePaths.status == 200) {
            this.saveImagePaths(filePaths.data, userId, duplicate.data, res);
          } else {
            res.status(filePaths.status).send(filePaths.data).json;
          }
        } else {
          res.status(duplicate.status).send(duplicate.data).json;
          res.end();
        }
      }

    public deleteNote = async (req: Request, res: Response, userId: number) => {
      const id = Number(req.params.id);
      const result = await this.notesService.delete(id, userId);
      if (result.status==200) this.filesController.deleteFolder(id, userId);
      res.status(result.status).send(result.data).json;
      res.end();
    }

    public pinNote = async (req: Request, res: Response, userId: number) => {
      const id = req.params.id;
      const result = await this.notesService.pinNote(Number(id), userId);
      res.status(result.status).send(result.data).json;
      res.end();
    }

    public getNotes = async (req: Request, res: Response, userId: number) => {
      const page = req.body.page;
      const pinned = req.body.pinned;
      const query = req.body.queryString;
      const result =
        await this.notesService.getNotes(userId, Number(page), pinned, query);
      res.status(result.status).send(result.data).json;
      res.end();
    }

    public routes() {
      this.router.post('/getNotes', (req, res) => {
        this.userControl(req, res, this.getNotes);
      });
      this.router.post('/getNote/:id', (req, res) => {
        this.userControl(req, res, this.getNote);
      });

      this.router.post('/createNote', (req, res) => {
        this.userControl(req, res, this.createNote);
      });
      this.router.post('/editNote', (req, res) => {
        this.userControl(req, res, this.editNote);
      });
      this.router.post('/duplicateNote/:id', (req, res) => {
        this.userControl(req, res, this.duplicateNote);
      });
      this.router.post('/deleteNote/:id', (req, res) => {
        this.userControl(req, res, this.deleteNote);
      });
      this.router.post('/pinNote/:id', (req, res) => {
        this.userControl(req, res, this.pinNote);
      });
    }
}
