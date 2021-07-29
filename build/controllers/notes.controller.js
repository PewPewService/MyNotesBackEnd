"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesController = void 0;
/* eslint-disable no-invalid-this */
/* eslint-disable require-jsdoc */
/* eslint-disable new-cap */
/* "dev": "node -r dotenv/config ./build/server.js
dotenv_config_path=env_development/.env.development", */
var express_1 = require("express");
var notes_service_1 = require("../services/notes.service");
var users_service_1 = require("../services/users.service");
var files_controller_1 = require("./files.controller");
var NotesController = /** @class */ (function () {
    function NotesController() {
        var _this = this;
        this.userControl = function (req, res, func) { return __awaiter(_this, void 0, void 0, function () {
            var jwt, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt = req.body.jwt;
                        return [4 /*yield*/, this.usersService.auth(jwt)];
                    case 1:
                        userId = _a.sent();
                        if (userId.status == 200) {
                            func(req, res, Number(userId.data));
                        }
                        else {
                            res.status(400).send('Invalid token! Please, re-login.').json;
                            res.end();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
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
        this.saveImagePaths = function (paths, userId, noteId, res) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notesService.saveImagePaths(paths, userId, noteId)];
                    case 1:
                        response = _a.sent();
                        res.status(response.status).send(response.data).json;
                        res.end();
                        return [2 /*return*/];
                }
            });
        }); };
        this.createNote = function (req, res, userId) { return __awaiter(_this, void 0, void 0, function () {
            var note, NewNote, noteId, filePaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        note = req.body.note;
                        return [4 /*yield*/, this.notesService.addNote(note, userId)];
                    case 1:
                        NewNote = _a.sent();
                        if (!(NewNote.status == 200 && note.images.length > 0)) return [3 /*break*/, 4];
                        noteId = NewNote.data.identifiers[0].id;
                        filePaths = this.filesController.saveImages(note.images, userId, noteId);
                        console.log(filePaths);
                        if (!(filePaths.status == 200)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.saveImagePaths(filePaths.data, userId, noteId, res)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        res.status(NewNote.status).send(NewNote.data).json;
                        res.end();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.getNote = function (req, res, userId) { return __awaiter(_this, void 0, void 0, function () {
            var id, note;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, this.notesService.getNote(Number(id), userId)];
                    case 1:
                        note = _a.sent();
                        res.status(note.status).send(note.data).json;
                        res.end();
                        return [2 /*return*/];
                }
            });
        }); };
        this.editNote = function (req, res, userId) { return __awaiter(_this, void 0, void 0, function () {
            var NoteData, filePaths, EditedNote;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        NoteData = req.body.note;
                        this.filesController.deleteFolder(Number(NoteData.id), userId);
                        filePaths = this.filesController.saveImages(NoteData.images, userId, NoteData.id);
                        if (filePaths.status == 200)
                            NoteData.images = filePaths.data;
                        return [4 /*yield*/, this.notesService.editNote(NoteData, userId)];
                    case 1:
                        EditedNote = _a.sent();
                        res.status(EditedNote.status).send(EditedNote.data).json;
                        res.end();
                        return [2 /*return*/];
                }
            });
        }); };
        this.duplicateNote = function (req, res, userId) { return __awaiter(_this, void 0, void 0, function () {
            var id, duplicate, filePaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        return [4 /*yield*/, this.notesService.duplicate(id, userId)];
                    case 1:
                        duplicate = _a.sent();
                        if (duplicate.status == 200) {
                            filePaths = this.filesController.duplicateFolder(id, duplicate.data, userId);
                            if (filePaths.status == 200) {
                                this.saveImagePaths(filePaths.data, userId, duplicate.data, res);
                            }
                            else {
                                res.status(filePaths.status).send(filePaths.data).json;
                            }
                        }
                        else {
                            res.status(duplicate.status).send(duplicate.data).json;
                            res.end();
                        }
                        return [2 /*return*/];
                }
            });
        }); };
        this.deleteNote = function (req, res, userId) { return __awaiter(_this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = Number(req.params.id);
                        return [4 /*yield*/, this.notesService.delete(id, userId)];
                    case 1:
                        result = _a.sent();
                        if (result.status == 200)
                            this.filesController.deleteFolder(id, userId);
                        res.status(result.status).send(result.data).json;
                        res.end();
                        return [2 /*return*/];
                }
            });
        }); };
        this.pinNote = function (req, res, userId) { return __awaiter(_this, void 0, void 0, function () {
            var id, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = req.params.id;
                        return [4 /*yield*/, this.notesService.pinNote(Number(id), userId)];
                    case 1:
                        result = _a.sent();
                        res.status(result.status).send(result.data).json;
                        res.end();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getNotes = function (req, res, userId) { return __awaiter(_this, void 0, void 0, function () {
            var page, pinned, query, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        page = req.body.page;
                        pinned = req.body.pinned;
                        query = req.body.queryString;
                        return [4 /*yield*/, this.notesService.getNotes(userId, Number(page), pinned, query)];
                    case 1:
                        result = _a.sent();
                        res.status(result.status).send(result.data).json;
                        res.end();
                        return [2 /*return*/];
                }
            });
        }); };
        this.notesService = new notes_service_1.NotesService();
        this.usersService = new users_service_1.UsersService();
        this.filesController = new files_controller_1.FilesController();
        this.router = express_1.Router();
        this.routes();
    }
    NotesController.prototype.routes = function () {
        var _this = this;
        this.router.post('/getNotes', function (req, res) {
            _this.userControl(req, res, _this.getNotes);
        });
        this.router.post('/getNote/:id', function (req, res) {
            _this.userControl(req, res, _this.getNote);
        });
        this.router.post('/createNote', function (req, res) {
            _this.userControl(req, res, _this.createNote);
        });
        this.router.post('/editNote', function (req, res) {
            _this.userControl(req, res, _this.editNote);
        });
        this.router.post('/duplicateNote/:id', function (req, res) {
            _this.userControl(req, res, _this.duplicateNote);
        });
        this.router.post('/deleteNote/:id', function (req, res) {
            _this.userControl(req, res, _this.deleteNote);
        });
        this.router.post('/pinNote/:id', function (req, res) {
            _this.userControl(req, res, _this.pinNote);
        });
    };
    return NotesController;
}());
exports.NotesController = NotesController;