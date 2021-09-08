import {rmSync, copyFileSync} from 'fs';
import path from 'path';

export class FilesController {
    public getImagePaths = (files: Array<Record<string, string>>): Array<string> => {
        const paths: Array<string> = [];
        for (const file of files) {
            paths.push('images/' + file.filename);
        }
        return paths;
    };

    public deleteImages = (images: Array<string>): void => {
        for (const image of images) {
            rmSync(path.resolve(__dirname, '../../') + '/' + image);
        }
    };

    public duplicateImages = (images: Array<string>): Array<string> => {
        const duplicatedImages : Array<string> = [];
        for (const image of images) {
            const name = `images/${Date.now()}${path.extname(image)}`;
            copyFileSync(path.resolve(__dirname, '../../') + '/' + image, path.resolve(__dirname, '../../') + '/' + name);
            duplicatedImages.push(name);
        }
        return duplicatedImages;
    };
}
