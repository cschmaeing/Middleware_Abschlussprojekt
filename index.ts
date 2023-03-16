import express from 'express';
import cors from 'cors';
import request from 'request';

const app = express();

const userName = 'NOPE';
const password = 'NEINNEIN';
const auth = (userName + ":" + password);
let csrfToken: string = "";
let cookies: Array<string> = [];

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json()) // To parse the incoming requests with JSON payloads

const port = 4000;


app.get('/test', (req, res) => {
    console.log('Hello World');
    res.send({ title: 'Ich werde zurückgegeben' })
})

app.get('/authUser', (req, res) => {
    const options = {
        url: 'http://ibssapdos.sap.ibs-banking.com:8000/sap/opu/odata/IBS/DIN_SCHULUNG_SRV/StandardSchulungenSet$format=json',
        headers: {
            'Authorization': 'Basic' + auth,
            'x-csrf-token': 'fetch'
        }
    }

    request.get(options, (err, response, body) => {
        if (response.headers['x-csrf-token']) {
            csrfToken = response.headers['x-csrf-token'] as string;
            cookies = response.headers['set-cookie'] as Array<string>
        }


    }
    )
})

app.listen(port, () => console.log("Listening on Port", port))
