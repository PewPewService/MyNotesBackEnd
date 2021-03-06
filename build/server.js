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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-jsdoc */
var express_1 = __importDefault(require("express"));
var notes_controller_1 = require("./controllers/notes.controller");
var typeorm_1 = require("typeorm");
var users_controller_1 = require("./controllers/users.controller");
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
console.log('.env.' + process.env.MODE);
dotenv_1.default.config({ path: '.env.' + process.env.MODE });
var Server = /** @class */ (function () {
    function Server() {
        this.app = express_1.default();
        this.bodyParser = require('body-parser');
        this.configuration();
        this.routes();
    }
    Server.prototype.configuration = function () {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(this.bodyParser.json({ limit: '100mb', extended: true }));
        this.app.use('/images', express_1.default.static(path_1.default.resolve(__dirname, '../images')));
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    };
    Server.prototype.uploadFiles = function (req, res) {
        try {
            console.log(req.body);
            var imagesPaths = [];
            for (var _i = 0, _a = req.files; _i < _a.length; _i++) {
                var image = _a[_i];
                imagesPaths.push(image.path);
            }
            res.status(200).send(imagesPaths).json;
            res.end();
        }
        catch (err) {
            res.status(500).send(err);
            res.end();
        }
    };
    Server.prototype.routes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ConnType, ConnHost, ConnPort, ConnUser, ConnPassword, ConnDB, ConnEntities, ConnSync, ConnName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ConnType = String(process.env.NODE_CONNECTION_TYPE);
                        ConnHost = String(process.env.NODE_CONNECTION_HOST);
                        ConnPort = Number(process.env.NODE_CONNECTION_PORT);
                        ConnUser = String(process.env.NODE_CONNECTION_USER);
                        ConnPassword = String(process.env.NODE_CONNECTION_PASSWORD);
                        ConnDB = String(process.env.NODE_CONNECTION_DB);
                        ConnEntities = String(process.env.NODE_CONNECTION_ENTITIES);
                        ConnSync = Boolean(process.env.NODE_CONNECTION_SYNCHRONIZE);
                        ConnName = String(process.env.NODE_CONNECTION_NAME);
                        return [4 /*yield*/, typeorm_1.createConnection({
                                type: ConnType,
                                host: ConnHost,
                                port: ConnPort,
                                username: ConnUser,
                                password: ConnPassword,
                                database: ConnDB,
                                entities: [ConnEntities],
                                synchronize: ConnSync,
                                name: ConnName,
                                ssl: { rejectUnauthorized: false },
                            })];
                    case 1:
                        _a.sent();
                        this.NotesController = new notes_controller_1.NotesController();
                        this.UsersController = new users_controller_1.UsersConrtoller();
                        this.app.get('/', function (req, res) {
                            res.send('test');
                        });
                        this.app.use('/api/notes/', this.NotesController.router);
                        this.app.use('/api/users/', this.UsersController.router);
                        return [2 /*return*/];
                }
            });
        });
    };
    Server.prototype.start = function () {
        var _this = this;
        this.app.listen(this.app.get('port'), function () {
            console.log("Server is listening on port " + _this.app.get('port'));
        });
    };
    return Server;
}());
var server = new Server();
server.start();
