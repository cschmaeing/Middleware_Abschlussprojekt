import express from 'express';
import cors from 'cors';
import request from 'request';
import bodyParser from 'body-parser';
import { Seminar } from './Seminar';


const app = express();
const userName = 'Nope';
const password = 'Nope';
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

app.get('/getAllSeminar', (req, res) => {
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
        console.log("Hier...");
        body.d.results.forEach(seminar => {
            console.log(seminar);
            seminars.push(new Seminar(seminar.Mandant, seminar.IdentNr, seminar.Title, seminar.Typ, seminar.Thema, seminar.Beschr, seminar.Tage, seminar.Adressat, seminar.AnPatr, seminar.Status))
        });
        res.send(JSON.stringify(seminars))
    })
})



app.listen(port, () => console.log("Listening on Port", port))
