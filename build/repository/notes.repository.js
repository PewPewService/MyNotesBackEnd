"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.NotesRepository = void 0;
var typeorm_1 = require("typeorm");
var notes_entity_1 = require("../database/entities/notes.entity");
var NotesRepository = /** @class */ (function (_super) {
    __extends(NotesRepository, _super);
    function NotesRepository() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.NotesOnPage = 10;
        return _this;
    }
    NotesRepository.prototype.CountPages = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var count, pages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, query.getCount()];
                    case 1:
                        count = _a.sent();
                        pages = count / this.NotesOnPage;
                        if (pages % 1)
                            pages = Math.floor(pages) + 1;
                        return [2 /*return*/, pages];
                }
            });
        });
    };
    NotesRepository.prototype.GetNote = function (id, UserId) {
        return __awaiter(this, void 0, void 0, function () {
            var note, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createQueryBuilder("Notes")
                                .select()
                                .where("id = :id and Notes.userId = :userId", { id: id, userId: UserId })
                                .getOne()];
                    case 1:
                        note = _a.sent();
                        if (!note)
                            return [2 /*return*/, { status: 400, data: "Note wasn't found" }];
                        return [2 /*return*/, { status: 200, data: note }];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, { status: 500, data: err_1 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotesRepository.prototype.DuplicateNote = function (id, UserId) {
        return __awaiter(this, void 0, void 0, function () {
            var note;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetNote(id, UserId)];
                    case 1:
                        note = _a.sent();
                        if (!(note.status == 200)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createQueryBuilder("Notes")
                                .insert()
                                .values(note.data)
                                .execute()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { status: 200, data: 'The note has been successfully copied!' }];
                    case 3: return [2 /*return*/, note];
                }
            });
        });
    };
    NotesRepository.prototype.FindNotes = function (UserId, page, pinned, query) {
        return __awaiter(this, void 0, void 0, function () {
            var queryString, i, queryValues, _i, _a, word, SendingQuery, notes;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        queryString = "";
                        i = 0;
                        queryValues = new Object;
                        for (_i = 0, _a = query.split(" "); _i < _a.length; _i++) {
                            word = _a[_i];
                            queryString += " and (name like :name" + i + " or text like :name" + i;
                            queryValues["name" + i] = "%" + word + "%";
                            i += 1;
                            queryString += " or :name" + i + " = ANY(tags))";
                            queryValues["name" + i] = word;
                            i += 1;
                        }
                        SendingQuery = {};
                        if (query) {
                            SendingQuery = { query: "1=1 " + queryString, values: queryValues };
                        }
                        return [4 /*yield*/, this.GetNotes(UserId, page, pinned, SendingQuery)];
                    case 1:
                        notes = _b.sent();
                        return [2 /*return*/, notes];
                }
            });
        });
    };
    NotesRepository.prototype.DeleteNote = function (id, UserId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createQueryBuilder("Notes")
                                .delete()
                                .where("id = :id and userId = :userId", { id: id, userId: UserId })
                                .execute()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { status: 200, data: 'Success!' }];
                    case 2:
                        err_2 = _a.sent();
                        return [2 /*return*/, { status: 500, data: err_2 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotesRepository.prototype.PinNote = function (id, UserId) {
        return __awaiter(this, void 0, void 0, function () {
            var note, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.GetNote(id, UserId)];
                    case 1:
                        note = _a.sent();
                        if (!(note.status == 200)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.createQueryBuilder("Notes")
                                .update()
                                .set({ "pinned": !note.data.pinned })
                                .where("id = :id and userId = :userId", { id: id, userId: UserId })
                                .execute()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { status: 200, data: "Success!" }];
                    case 3: return [2 /*return*/, note];
                    case 4:
                        err_3 = _a.sent();
                        return [2 /*return*/, { status: 500, data: err_3 }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    NotesRepository.prototype.AddNote = function (note, UserId) {
        return __awaiter(this, void 0, void 0, function () {
            var NewNote, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createQueryBuilder("Notes")
                                .insert()
                                .values({
                                name: note.name,
                                text: note.text,
                                images: note.images,
                                tags: note.tags,
                                userId: UserId,
                                pinned: false
                            })
                                .execute()];
                    case 1:
                        NewNote = _a.sent();
                        return [2 /*return*/, { status: 200, data: 'The Note was successfully added!' }];
                    case 2:
                        err_4 = _a.sent();
                        return [2 /*return*/, { status: 500, data: err_4 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotesRepository.prototype.EditNote = function (note, UserId) {
        return __awaiter(this, void 0, void 0, function () {
            var EditedNote, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createQueryBuilder("Notes")
                                .update()
                                .set({
                                name: note.name,
                                text: note.text,
                                images: note.images,
                                tags: note.tags,
                                pinned: note.pinned
                            })
                                .where("id = :id and userId = :userId", { id: note.id, userId: UserId })
                                .execute()];
                    case 1:
                        EditedNote = _a.sent();
                        return [2 /*return*/, { status: 200, data: EditedNote }];
                    case 2:
                        err_5 = _a.sent();
                        return [2 /*return*/, { status: 500, data: err_5 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotesRepository.prototype.GetNotes = function (UserId, page, pinned, where) {
        if (pinned === void 0) { pinned = false; }
        if (where === void 0) { where = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var offset, notes, pagesCount, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        offset = page * this.NotesOnPage;
                        return [4 /*yield*/, this.createQueryBuilder("Notes")
                                .select()
                                .where('Notes.userId = :userId and pinned = :pinned', { userId: UserId, pinned: pinned })];
                    case 1:
                        notes = _a.sent();
                        if (!Object.keys(where).length) return [3 /*break*/, 3];
                        return [4 /*yield*/, notes.andWhere(where.query, where.values)];
                    case 2:
                        notes = _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.CountPages(notes)];
                    case 4:
                        pagesCount = _a.sent();
                        return [4 /*yield*/, notes.orderBy('id', "DESC")
                                .offset(offset)
                                .limit(this.NotesOnPage)
                                .getMany()];
                    case 5:
                        notes = _a.sent();
                        return [2 /*return*/, { status: 200, data: [notes, pagesCount] }];
                    case 6:
                        err_6 = _a.sent();
                        return [2 /*return*/, { status: 500, data: err_6 }];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    NotesRepository = __decorate([
        typeorm_1.EntityRepository(notes_entity_1.NotesEntity)
    ], NotesRepository);
    return NotesRepository;
}(typeorm_1.Repository));
exports.NotesRepository = NotesRepository;
