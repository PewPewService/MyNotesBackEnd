import {DeleteResult, EntityRepository, InsertResult, Repository, UpdateResult} from 'typeorm';
import {NotesEntity} from '../database/entities/notes.entity';
import {FilesController} from '../controllers/files.controller';

@EntityRepository(NotesEntity)
export class NotesRepository extends Repository<NotesEntity> {
    private NotesOnPage = 10;
    private filesController : FilesController = new FilesController();


    private async countPages(query: any): Promise<number> {
        const count = await query.getCount();
        let pages = count/this.NotesOnPage;
        if (pages % 1) pages = Math.floor(pages)+1;
        return pages;
    }

    public async getNote(id: number, userId: number): Promise<Record<string, any>> {
        try {
            const note = await this.createQueryBuilder('Notes')
                .select()
                .where('id = :id and Notes.userId = :userId',
                    {id, userId})
                .getOne();
            if (!note) return {status: 400, data: 'Note wasn\'t found'};
            else {
                return {status: 200, data: note};
            }
        } catch (err) {
            return {status: 500, data: err};
        }
    }

    public async duplicateNote(id: number, UserId: number): Promise<Record<string, string | number>> {
        const note = await this.getNote(id, UserId);
        if (note.status == 200) {
            note.data.images =
          this.filesController.duplicateImages(note.data.images);
            await this.createQueryBuilder('Notes')
                .insert()
                .values(note.data)
                .execute();
            return {status: 200, data: 'The note was successfully copied!'};
        } else return note;
    }

    public async findNotes(UserId: number,
        page: number, pinned: boolean, query: any): Promise<Record<string, any>> {
        let queryString = '';
        let i=0;
        const queryValues: any = {};
        for (const word of query.split(' ')) {
            queryString += ' and (name like :name'+i+' or text like :name'+i;
            queryValues['name'+i] = '%'+word+'%';
            i += 1;
            queryString += ' or :name'+i+' = ANY(tags))';
            queryValues['name'+i] = word;
            i += 1;
        }
        let SendingQuery = {};
        if (query) {
            SendingQuery = {query: '1=1 '+queryString, values: queryValues};
        }
        const notes = await this.getNotes(UserId, page, pinned, SendingQuery);
        return notes;
    }

    public async deleteNote(id: number, userId: number): Promise<Record<string, string | number | unknown>> {
        const note = await this.getNote(id, userId);
        if (note.status == 200) {
            try {
                this.filesController.deleteImages(note.data.images);
                await this.createQueryBuilder('Notes')
                    .delete()
                    .where('id = :id and userId = :userId', {id, userId})
                    .execute();
                return {status: 200, data: 'Success!'};
            } catch (err) {
                return {status: 500, data: err};
            }
        } else return note;
    }

    public async pinNote(id: number, userId: number): Promise<Record<string, string | number | unknown>> {
        try {
            const note = await this.getNote(id, userId);
            if (note.status == 200) {
                await this.createQueryBuilder('Notes')
                    .update()
                    .set({'pinned': !note.data.pinned})
                    .where('id = :id and userId = :userId', {id, userId})
                    .execute();
                return {status: 200, data: 'Success!'};
            }
            return note;
        } catch (err) {
            return {status: 500, data: err};
        }
    }

    public async addNote(note: any, UserId: number): Promise<Record<string, number | InsertResult | unknown>> {
        try {
            const newNote = await this.createQueryBuilder('Notes')
                .insert()
                .values({
                    name: note.name,
                    text: note.text,
                    images: note.images,
                    tags: note.tags,
                    userId: UserId,
                    pinned: false,
                })
                .execute();
            return {status: 200, data: newNote};
        } catch (err) {
            return {status: 500, data: err};
        }
    }

    public async editNote(note: any, userId: number): Promise<Record<string, number | UpdateResult | unknown>> {
        try {
            const EditedNote = await this.createQueryBuilder('Notes')
                .update()
                .set({
                    name: note.name,
                    text: note.text,
                    images: note.images,
                    tags: note.tags,
                    pinned: note.pinned,
                })
                .where('id = :id and userId = :userId',
                    {id: note.id, userId})
                .execute();
            return {status: 200, data: EditedNote};
        } catch (err) {
            return {status: 500, data: err};
        }
    }

    public async getNotes(userId: number,
        page: number, pinned = false, where : any = {}): Promise<Record<string, any>> {
        try {
            const offset = page * this.NotesOnPage;
            let notes: any = await this.createQueryBuilder('Notes')
                .select()
                .where('Notes.userId = :userId and pinned = :pinned',
                    {userId, pinned});
            if (Object.keys(where).length) {
                notes = await notes.andWhere(where.query, where.values);
            }
            const pagesCount = await this.countPages(notes);
            notes = await notes.orderBy('id', 'DESC')
                .offset(offset)
                .limit(this.NotesOnPage)
                .getMany();
            return {status: 200, data: [notes, pagesCount]};
        } catch (err) {
            return {status: 500, data: err};
        }
    }

    public async dropTable(): Promise<Record<string, number | DeleteResult | unknown>> {
        try{
            const drop = await this.createQueryBuilder('Notes')
                .delete()
                .execute();
            return {status: 200, data: drop};
        } catch (err) {
            return {status: 500, data: err};
        }
    }
}
