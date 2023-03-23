import express from 'express';
import cors from 'cors';
import request from 'request';
import bodyParser from 'body-parser';

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
        url: `http://ibssapdos.sap.ibs-banking.com:8000/sap/opu/odata/IBS/DIN_SCHULUNG_SRV/StandardSchulungenSet$format=json`,
        headers: {
            'Authorization': 'Basic' + auth,
            'x-csrf-token': 'fetch'
        }
    }

    request.get(options, (err, response, body) => {
        console.log('response -->  ', response)
        if (response.headers['x-csrf-token']) {

            // Dieses Token ist in der Response nicht zu finden
            csrfToken = response.headers['x-csrf-token'] as string;

            // Das hier schon 
            cookies = response.headers['set-cookie'] as Array<string>

            res.send({ token: csrfToken, cookies: cookies })
        }
        if (err) {
            console.error(err)
        }


    }
    )
})

app.listen(port, () => console.log("Listening on Port", port))
