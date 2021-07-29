/* eslint-disable new-cap */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {EntityRepository, Repository} from 'typeorm';
import {NotesEntity} from '../database/entities/notes.entity';
import {readFileSync} from 'fs';

@EntityRepository(NotesEntity)
export class NotesRepository extends Repository<NotesEntity> {
    private NotesOnPage: number = 10;

    private async countPages(query: any) {
      const count = await query.getCount();
      let pages = count/this.NotesOnPage;
      if (pages % 1) pages = Math.floor(pages)+1;
      return pages;
    }

    public async getNote(id: number, UserId: number) {
      try {
        const note = await this.createQueryBuilder('Notes')
            .select()
            .where('id = :id and Notes.userId = :userId',
                {id: id, userId: UserId})
            .getOne();
        if (!note) return {status: 400, data: 'Note wasn\'t found'};
        else {
          note.images = await this.getImages(note.images);
          return {status: 200, data: note};
        }
      } catch (err) {
        return {status: 500, data: err};
      }
    }

    public async duplicateNote(id: number, UserId: number) {
      const note = await this.getNote(id, UserId);
      if (note.status==200) {
        const duplicate = await this.createQueryBuilder('Notes')
            .insert()
            .values(note.data)
            .execute();
        return {status: 200, data: duplicate.identifiers[0].id};
      } else return note;
    }

    public async findNotes(UserId: number, page: number, pinned: boolean, query: any) {
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

    public async deleteNote(id: number, UserId: number) {
      try {
        await this.createQueryBuilder('Notes')
            .delete()
            .where('id = :id and userId = :userId', {id: id, userId: UserId})
            .execute();
        return {status: 200, data: 'Success!'};
      } catch (err) {
        return {status: 500, data: err};
      }
    }

    public async pinNote(id: number, UserId: number) {
      try {
        const note = await this.getNote(id, UserId);
        if (note.status == 200) {
          await this.createQueryBuilder('Notes')
              .update()
              .set({'pinned': !note.data.pinned})
              .where('id = :id and userId = :userId', {id: id, userId: UserId})
              .execute();
          return {status: 200, data: 'Success!'};
        }
        return note;
      } catch (err) {
        return {status: 500, data: err};
      }
    }

    public async addNote(note: any, UserId: number) {
      try {
        const newNote = await this.createQueryBuilder('Notes')
            .insert()
            .values({
              name: note.name,
              text: note.text,
              tags: note.tags,
              userId: UserId,
              pinned: false,
            })
            .execute();
        return {status: 200, data: /* 'The Note was successfully added!' */newNote};
      } catch (err) {
        return {status: 500, data: err};
      }
    }

    public async editNote(note: any, UserId: number) {
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
            .where('id = :id and userId = :userId', {id: note.id, userId: UserId})
            .execute();
        return {status: 200, data: EditedNote};
      } catch (err) {
        return {status: 500, data: err};
      }
    }

    public async getNotes(UserId: number, page: number, pinned: boolean = false, where : any = {}) {
      try {
        const offset = page * this.NotesOnPage;
        let notes: any = await this.createQueryBuilder('Notes')
            .select()
            .where('Notes.userId = :userId and pinned = :pinned', {userId: UserId, pinned: pinned});
        if (Object.keys(where).length) notes = await notes.andWhere(where.query, where.values);
        const pagesCount = await this.countPages(notes);
        notes = await notes.orderBy('id', 'DESC')
            .offset(offset)
            .limit(this.NotesOnPage)
            .getMany();
        for (const note of notes) {
          note.images = this.getImages(note.images);
        }
        return {status: 200, data: [notes, pagesCount]};
      } catch (err) {
        return {status: 500, data: err};
      }
    }

    public async saveImagePaths(paths: Array<string>, userId: number, noteId: number) {
      try {
        const note = await this.createQueryBuilder('Notes')
            .update()
            .set({images: paths})
            .where('id = :id and userId = :userId', {id: noteId, userId: userId})
            .execute();
        return {status: 200, data: note};
      } catch (err) {
        return {status: 500, data: err};
      }
    }

    private getImages = (paths: Array<string>) => {
      const base64Images : Array<string> = [];
      if (!paths) return [];
      for (const path of paths) {
        const file = readFileSync(path, {encoding: 'utf8'});
        // const image = Buffer.from(file).toString('base64');
        base64Images.push(file);// image);
      }
      return base64Images;
    }

  /* private getImages = (paths: Array<string>) => {
      const base64Images : Array<string> = [];
      for (let i=0; i<paths.length; i++) {
        const file = readFileSync(paths[i], {encoding: 'base64'});
        // const image = Buffer.from(file).toString('base64', 0, 20);
        base64Images.push(file);// image);
      }
      console.log('returned');
      return base64Images;
    } */
}
