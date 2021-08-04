import {Router, Response, Request} from 'express';
import {NotesService} from '../services/notes.service';
import {UsersService} from '../services/users.service';
import {FilesController} from './files.controller';
import path from 'path';

export class NotesController {
    public router: Router;
    public notesService! : NotesService;
    public usersService! : UsersService;
    private filesController: FilesController;

    private multer = require('multer');
    private storage = this.multer.diskStorage({
        destination: path.resolve(__dirname, 'images'), 
        filename: function(req: Request, file: Record<string, any>, cb: Function) {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });
    private upload = this.multer({storage: this.storage});

    constructor() {
        this.notesService = new NotesService();
        this.usersService = new UsersService();
        this.filesController = new FilesController();
        this.router = Router();
        this.routes();
    }

    public userControl =
    async (req: Request, res: Response, func: Function): Promise<any> => {
        const jwt = req.body.jwt;
        const userId = await this.usersService.auth(jwt);
        if (userId.status == 200) {
            func(req, res, Number(userId.data));
        } else {
            res.status(400).send('Invalid token! Please, re-login.').json;
            res.end();
        }
    };

    public createNote = async (req: any, res: Response, userId: number): Promise<any> => {
        const note = req.body;
        const images = this.filesController.getImagePaths(req.files);
        note.images = images;
        const NewNote = await this.notesService.addNote(note, userId);
        res.status(NewNote.status).send(NewNote.data).json;
        res.end();
    };

    public getNote = async (req: Request, res: Response, userId: number): Promise<any> => {
        const id = req.params.id;
        const note = await this.notesService.getNote(Number(id), userId);
        res.status(note.status).send(note.data).json;
        res.end();
    };

    public editNote = async (req: any, res: Response, userId: number): Promise<any> => {
        const NoteData = req.body;
        NoteData.leftImages = NoteData.leftImages ?
            NoteData.leftImages.split(',') : [];
        NoteData.deletedImages = NoteData.deletedImages ?
            NoteData.deletedImages.split(',') : [];
        if (NoteData.deletedImages.length > 0) {
            this.filesController.deleteImages(NoteData.deletedImages);
        }
        NoteData.images = this.filesController.getImagePaths(req.files);
        NoteData.images = NoteData.leftImages.concat(NoteData.images);
        const EditedNote = await this.notesService.editNote(NoteData, userId);
        res.status(EditedNote.status).send(EditedNote.data).json;
        res.end();
    };

    public duplicateNote =
    async (req: Request, res: Response, userId: number): Promise<any> => {
        const id = Number(req.params.id);
        const duplicate = await this.notesService.duplicate(id, userId);
        res.status(duplicate.status).send(duplicate.data).json;
        res.end();
    };

    public deleteNote = async (req: Request, res: Response, userId: number): Promise<any> => {
        const id = Number(req.params.id);
        const result = await this.notesService.delete(id, userId);
        res.status(result.status).send(result.data).json;
        res.end();
    };

    public pinNote = async (req: Request, res: Response, userId: number): Promise<any> => {
        const id = req.params.id;
        const result = await this.notesService.pinNote(Number(id), userId);
        res.status(result.status).send(result.data).json;
        res.end();
    };

    public getNotes = async (req: Request, res: Response, userId: number): Promise<any> => {
        const page = req.body.page;
        const pinned = req.body.pinned;
        const query = req.body.queryString;
        const result =
        await this.notesService.getNotes(userId, Number(page), pinned, query);
        res.status(result.status).send(result.data).json;
        res.end();
    };

    public routes(): void {
        this.router.post('/getNotes', (req, res) => {
            this.userControl(req, res, this.getNotes);
        });
        this.router.post('/getNote/:id', (req, res) => {
            this.userControl(req, res, this.getNote);
        });

        this.router.post('/createNote', this.upload.array('images'),
            (req, res) => {
                this.userControl(req, res, this.createNote);
            });
        this.router.post('/editNote', this.upload.array('images'),
            (req, res) => {
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
