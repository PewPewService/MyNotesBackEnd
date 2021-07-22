import { Router, Response, Request } from "express";
import { NotesService } from "../services/notes.service";
import { UsersService } from "../services/users.service";

export class NotesController {
    public router: Router;
    public notesService! :  NotesService;
    public usersService! : UsersService;
    public base64img = require("node-base64-img");

    constructor(){
        this.notesService = new NotesService();
        this.usersService = new UsersService();
        this.router = Router();
        this.routes();
    }

    public UserControl = async (req: Request, res: Response, func: Function) => {
        const jwt = req.body.jwt;
        const UserId = await this.usersService.auth(jwt);        
        if (UserId.status == 200) {
            func(req, res, Number(UserId.data));
        }
        else {
            res.status(400).send("Invalid token! Please, re-login.").json;
            res.end();
        }
    }

    public CreateNote  = async (req: Request, res: Response, UserId: number) => {
        const note = req.body.note;
        const NewNote = await this.notesService.AddNote(note, UserId);
        res.status(NewNote.status).send(NewNote.data).json;
        res.end();
    }

    public GetNote = async (req: Request, res: Response, UserId: number) => {
        const id = req.params.id;
        const note = await this.notesService.GetNote(Number(id), UserId);
        res.status(note.status).send(note.data).json;
        res.end();
    }

    public EditNote = async (req: Request, res: Response, UserId: number) => {
        const NoteData = req.body.note;
        const EditedNote = await this.notesService.EditNote(NoteData, UserId);
        res.status(EditedNote.status).send(EditedNote.data).json;
        res.end();
    }

    public DuplicateNote = async (req: Request, res: Response, UserId: number) => {
        const id = req.params.id;
        const duplicate = await this.notesService.Duplicate(Number(id), UserId);
        res.status(duplicate.status).send(duplicate.data).json;
        res.end();
    }

    public DeleteNote = async (req: Request, res: Response, UserId: number) => {
        const id = req.params.id;
        const result = await this.notesService.Delete(Number(id), UserId);
        res.status(result.status).send(result.data).json;
        res.end();
    }

    public PinNote = async (req: Request, res: Response, UserId: number) => {
        const id = req.params.id;
        const result = await this.notesService.PinNote(Number(id), UserId)
        res.status(result.status).send(result.data).json;
        res.end();
    }

    public GetNotes = async (req: Request, res: Response, UserId: number) => {
        const page = req.body.page;
        const pinned = req.body.pinned;
        const query = req.body.queryString;
        const result = await this.notesService.GetNotes(UserId, Number(page), pinned, query);
        res.status(result.status).send(result.data).json;
        res.end();
    }

    public routes(){
        this.router.post('/getNotes', (req,res) => {this.UserControl(req, res, this.GetNotes)});
        this.router.post('/getNote/:id', (req, res) => {this.UserControl(req, res, this.GetNote)});

        this.router.post('/createNote', (req, res) => {this.UserControl(req, res, this.CreateNote)});
        this.router.post('/editNote', (req, res) => {this.UserControl(req, res, this.EditNote)});
        this.router.post('/duplicateNote/:id', (req, res) => {this.UserControl(req, res, this.DuplicateNote)});
        this.router.post('/deleteNote/:id', (req, res) => {this.UserControl(req, res, this.DeleteNote)});
        this.router.post('/pinNote/:id', (req, res) => {this.UserControl(req, res, this.PinNote)});
    }
}