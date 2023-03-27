"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const request_1 = __importDefault(require("request"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const userName = 'No';
const password = 'No';
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
        url: `http://ibssapdos.sap.ibs-banking.com:8000/sap/opu/odata/IBS/DIN_SCHULUNG_SRV/StandardSchulungenSet$format=json`,
        headers: {
            'Authorization': 'Basic' + auth,
            'x-csrf-token': 'fetch'
        }
    };
    request_1.default.get(options, (err, response, body) => {
        console.log('response -->  ', response);
        if (response.headers['x-csrf-token']) {
            // Dieses Token ist in der Response nicht zu finden
            csrfToken = response.headers['x-csrf-token'];
            // Das hier schon 
            cookies = response.headers['set-cookie'];
            res.send({ token: csrfToken, cookies: cookies });
        }
        if (err) {
            console.error(err);
        }
    });
});
app.listen(port, () => console.log("Listening on Port", port));
//# sourceMappingURL=index.js.map