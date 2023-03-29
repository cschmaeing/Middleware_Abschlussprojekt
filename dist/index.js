"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const request_1 = __importDefault(require("request"));
const body_parser_1 = __importDefault(require("body-parser"));
const Seminar_1 = require("./Seminar");
const app = (0, express_1.default)();
const userName = 'Nope';
const password = 'Nope';
const auth = btoa(userName + ":" + password);
let csrfToken = "";
let cookies = [];
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json()); // To parse the incoming requests with JSON payloads
const port = 4000;
app.get('/test', (req, res) => {
    console.log('Hello World');
    res.send({ title: 'Ich werde zurückgegeben' });
});
app.get('/authUser', (req, res) => {
    const options = {
        url: 'http://ibssapdos.sap.ibs-banking.com:8000/sap/opu/odata/IBS/DIN_SCHULUNG_SRV/standardSchulungenSet?$format=json',
        headers: {
            'Authorization': 'Basic ' + auth,
            'x-csrf-token': 'fetch'
        }
    };
    request_1.default.get(options, (err, response, body) => {
        console.log('response --> ', response);
        if (response.headers['x-csrf-token']) {
            csrfToken = response.headers['x-csrf-token'];
            cookies = response.headers['set-cookie'];
        }
    });
});
app.get('/getAllSeminar', (req, res) => {
    const options = {
        url: 'http://ibssapdos.sap.ibs-banking.com:8000/sap/opu/odata/IBS/DIN_SCHULUNG_SRV/standardSchulungenSet?$format=json',
        headers: {
            'x-crsf-token': csrfToken,
            'cookie': cookies
        }
    };
    request_1.default.get(options, (err, response) => {
        const body = JSON.parse(response.body);
        const seminars = [];
        console.log("Hier...");
        body.d.results.forEach(seminar => {
            console.log(seminar);
            seminars.push(new Seminar_1.Seminar(seminar.Mandant, seminar.IdentNr, seminar.Title, seminar.Typ, seminar.Thema, seminar.Beschr, seminar.Tage, seminar.Adressat, seminar.AnPatr, seminar.Status));
        });
        res.send(JSON.stringify(seminars));
    });
});
app.listen(port, () => console.log("Listening on Port", port));
//# sourceMappingURL=index.js.map