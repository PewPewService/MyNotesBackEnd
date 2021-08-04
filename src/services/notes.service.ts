import {getConnection} from 'typeorm';
import {NotesRepository} from '../repository/notes.repository';

export class NotesService {
    private NotesRepository : NotesRepository;

    constructor() {
        this.NotesRepository =
        getConnection('MyNotes').getCustomRepository(NotesRepository);
    }

    public addNote = async (note: object, userId: number): Promise<any> => {
        const newNote = await this.NotesRepository.addNote(note, userId);
        return newNote;
    };

    public editNote = async (note: object, userId: number): Promise<any> => {
        const editedNote = await this.NotesRepository.editNote(note, userId);
        return editedNote;
    };

    public delete = async (id: number, userId: number): Promise<any> => {
        const deleteNote = await this.NotesRepository.deleteNote(id, userId);
        return deleteNote;
    };

    public duplicate = async (id: number, userId: number): Promise<any> => {
        const duplicateNote =
        await this.NotesRepository.duplicateNote(id, userId);
        return duplicateNote;
    };

    public getNote = async (id: number, userId: number): Promise<any> => {
        const note = await this.NotesRepository.getNote(id, userId);
        return note;
    };

    public pinNote = async (id: number, userId: number): Promise<any> => {
        const result = await this.NotesRepository.pinNote(id, userId);
        return result;
    };

    public getNotes =
    async (userId: number, page: number, pinned: boolean, query: any): Promise<any> => {
        const result =
          await this.NotesRepository.findNotes(userId, page, pinned, query);
        return result;
    };
}
