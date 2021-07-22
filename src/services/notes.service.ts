import { getConnection } from "typeorm";
import { NotesRepository } from '../repository/notes.repository';

export class NotesService {
    private NotesRepository : NotesRepository;

    constructor(){
        this.NotesRepository = getConnection("MyNotes").getCustomRepository(NotesRepository);
    }

    public AddNote = async (note: object, UserId: number) => {
        const NewNote = await this.NotesRepository.AddNote(note, UserId);
        return NewNote;
    }

    public EditNote = async (note: object, UserId: number) => {
        const EditedNote = await this.NotesRepository.EditNote(note, UserId);
        return EditedNote;
    }

    public Delete = async (id: number, UserId: number) => {
        const deleteNote = await this.NotesRepository.DeleteNote(id, UserId);
        return deleteNote;
    }

    public Duplicate = async (id: number, UserId: number) => {
        const duplicateNote = await this.NotesRepository.DuplicateNote(id, UserId);
        return duplicateNote;
    }

    public GetNote = async (id: number, UserId: number) => {
        const note = await this.NotesRepository.GetNote(id, UserId);
        return note;
    }

    public PinNote = async (id: number, UserId: number) => {
        const result = await this.NotesRepository.PinNote(id, UserId);
        return result;
    }

    public GetNotes = async (UserId: number, page: number, pinned: boolean, query: any) => {
        const result = await this.NotesRepository.FindNotes(UserId, page, pinned, query);
        return result;
    }
}