import express from 'express';
import cors from 'cors';
import request from 'request';
import bodyParser from 'body-parser';
import { Seminar } from './Seminar';


const app = express();
const userName = 'CSCHMAEING';
const password = 'Taunusstein';
const auth = btoa(userName + ":" + password);

let csrfToken: string = "";
let cookies: Array<string> = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

const port = 4000;

app.get('/test', (req, res) => {
    console.log('Hello World');
    res.send({ title: 'Ich werde zurückgegeben' })
})

app.get('/authUser', (req, res) => {
    const options = {
        url: 'http://ibssapdos.sap.ibs-banking.com:8000/sap/opu/odata/IBS/DIN_SCHULUNG_SRV/standardSchulungenSet?$format=json',
        headers: {
            'Authorization': 'Basic ' + auth,
            'x-csrf-token': 'fetch'
        }
    }

    request.get(options, (err, response, body) => {
        console.log('response --> ', response)
        if (response.headers['x-csrf-token']) {
            csrfToken = response.headers['x-csrf-token'] as string;
            cookies = response.headers['set-cookie'] as Array<string>
        }
    }
    )

})

app.get('getAllSeminar', (req, res) => {
    const options = {
        url: 'http://ibssapdos.sap.ibs-banking.com:8000/sap/opu/odata/IBS/DIN_SCHULUNG_SRV/standardSchulungenSet?$format=json',
        headers: {
            'x-crsf-token': csrfToken,
            'cookie': cookies
        }
    }

    request.get(options, (err, response) => {
        const body = JSON.parse(response.body)
        const seminars: Seminar[] = [];

        body.d.results.forEach(seminar => {
            seminars.push(new Seminar(seminar.mandant, seminar.ident_nr, seminar.title, seminar.typ, seminar.thema, seminar.beschr, seminar.tage, seminar.adressat, seminar.an_patr, seminar.status))
        });
        res.send(JSON.stringify(seminars))
    })
})



app.listen(port, () => console.log("Listening on Port", port))
