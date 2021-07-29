/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
import {getConnection} from 'typeorm';
import {NotesRepository} from '../repository/notes.repository';

export class NotesService {
    private NotesRepository : NotesRepository;

    constructor() {
      this.NotesRepository =
        getConnection('MyNotes').getCustomRepository(NotesRepository);
    }

    public addNote = async (note: object, userId: number) => {
      const newNote = await this.NotesRepository.addNote(note, userId);
      return newNote;
    }

    public saveImagePaths =
    async (paths: Array<string>, userId: number, noteId: number) => {
      const response =
        await this.NotesRepository.saveImagePaths(paths, userId, noteId);
      return response;
    }

    public editNote = async (note: object, userId: number) => {
      const editedNote = await this.NotesRepository.editNote(note, userId);
      return editedNote;
    }

    public delete = async (id: number, userId: number) => {
      const deleteNote = await this.NotesRepository.deleteNote(id, userId);
      return deleteNote;
    }

    public duplicate = async (id: number, userId: number) => {
      const duplicateNote =
        await this.NotesRepository.duplicateNote(id, userId);
      return duplicateNote;
    }

    public getNote = async (id: number, userId: number) => {
      const note = await this.NotesRepository.getNote(id, userId);
      return note;
    }

    public pinNote = async (id: number, userId: number) => {
      const result = await this.NotesRepository.pinNote(id, userId);
      return result;
    }

    public getNotes =
      async (userId: number, page: number, pinned: boolean, query: any) => {
        const result =
          await this.NotesRepository.findNotes(userId, page, pinned, query);
        return result;
      }
}
