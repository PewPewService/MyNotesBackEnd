"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var FilesController = /** @class */ (function () {
    function FilesController() {
        this.getImagePaths = function (files) {
            var paths = [];
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                paths.push(file.path);
            }
            return paths;
        };
        this.deleteImages = function (images) {
            for (var _i = 0, images_1 = images; _i < images_1.length; _i++) {
                var image = images_1[_i];
                fs_1.rmSync('./' + image);
            }
        };
        this.duplicateImages = function (images) {
            var duplicatedImages = [];
            for (var _i = 0, images_2 = images; _i < images_2.length; _i++) {
                var image = images_2[_i];
                var name_1 = "images\\" + Date.now() + path_1.default.extname(image);
                fs_1.copyFileSync(image, name_1);
                duplicatedImages.push(name_1);
            }
            return duplicatedImages;
        };
    }
    return FilesController;
}());
exports.FilesController = FilesController;
