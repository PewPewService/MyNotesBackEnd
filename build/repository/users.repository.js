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
exports.UsersRepository = void 0;
/* eslint-disable max-len */
/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
var typeorm_1 = require("typeorm");
var users_entity_1 = require("../database/entities/users.entity");
var UsersRepository = /** @class */ (function (_super) {
    __extends(UsersRepository, _super);
    function UsersRepository() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bcrypt = require('bcryptjs');
        _this.jwt = require('jsonwebtoken');
        return _this;
    }
    UsersRepository.prototype.checkExistence = function (username, email) {
        return __awaiter(this, void 0, void 0, function () {
            var CheckEmail, CheckUsername, response, status_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.createQueryBuilder('Users')
                                .select()
                                .where('Users.email like :email', { email: email })
                                .getCount()];
                    case 1:
                        CheckEmail = _a.sent();
                        return [4 /*yield*/, this.createQueryBuilder('Users')
                                .select()
                                .where('Users.username like :username', { username: username })
                                .getCount()];
                    case 2:
                        CheckUsername = _a.sent();
                        response = '';
                        status_1 = 200;
                        response += CheckEmail ? 'email' : '';
                        response += (CheckEmail + CheckUsername == 2) ? ' and ' : '';
                        response += CheckUsername ? 'username' : '';
                        response += (CheckEmail + CheckUsername) ? ' is already in use!' : '';
                        if (response)
                            status_1 = 250;
                        return [2 /*return*/, { status: status_1, data: response }];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, { status: 250, data: err_1 }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UsersRepository.prototype.register = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hasPassword, existence, LoggedUser, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bcrypt.genSalt(10)];
                    case 1:
                        salt = _a.sent();
                        return [4 /*yield*/, this.bcrypt.hash(user.password, salt)];
                    case 2:
                        hasPassword = _a.sent();
                        return [4 /*yield*/, this.checkExistence(user.username, user.email)];
                    case 3:
                        existence = _a.sent();
                        if (existence.status != 200) {
                            return [2 /*return*/, existence];
                        }
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        return [4 /*yield*/, this.createQueryBuilder('Users')
                                .insert()
                                .values({
                                email: user.email,
                                username: user.username,
                                password: hasPassword,
                            })
                                .execute()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.login(user)];
                    case 6:
                        LoggedUser = _a.sent();
                        return [2 /*return*/, { status: 200, data: LoggedUser }];
                    case 7:
                        err_2 = _a.sent();
                        return [2 /*return*/, { status: 250, data: err_2 }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UsersRepository.prototype.login = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, validPass, token, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.createQueryBuilder('Users')
                                .select()
                                .where('LOWER(Users.username) like :data or LOWER(Users.email) like :data', { data: data.username.toLowerCase() })
                                .getOne()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, { status: 240, data: 'This user does not exist!' }];
                        return [4 /*yield*/, this.bcrypt.compare(data.password, user === null || user === void 0 ? void 0 : user.password)];
                    case 2:
                        validPass = _a.sent();
                        if (!validPass)
                            return [2 /*return*/, { status: 240, data: 'invalid pair!' }];
                        return [4 /*yield*/, this.jwt.sign({ id: user === null || user === void 0 ? void 0 : user.id }, 'secret', { expiresIn: '24h' })];
                    case 3:
                        token = _a.sent();
                        return [2 /*return*/, { status: 200, data: { jwt: token, user: user === null || user === void 0 ? void 0 : user.username } }];
                    case 4:
                        err_3 = _a.sent();
                        return [2 /*return*/, { status: 250, data: err_3 }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UsersRepository.prototype.auth = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.jwt.verify(data, 'secret', function (err, decoded) {
                            if (!err) {
                                return { status: 200, data: decoded.id };
                            }
                            else
                                return { status: 250, data: err };
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, { status: result.status, data: result.data }];
                }
            });
        });
    };
    UsersRepository = __decorate([
        typeorm_1.EntityRepository(users_entity_1.UsersEntity)
    ], UsersRepository);
    return UsersRepository;
}(typeorm_1.Repository));
exports.UsersRepository = UsersRepository;