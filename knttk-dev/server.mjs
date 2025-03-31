import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

import fs from 'fs'
import path from 'path'

import {Server} from 'socket.io'
import {createServer} from 'node:http'
import express from 'express'

import sessionKey from './session.js'

import { fileURLToPath } from 'url';
import bodyParser from 'body-parser'
import {Router} from 'express'

import session from 'express-session'
import 'localstorage-polyfill'

import request from 'request'
import { channel } from 'diagnostics_channel'
import { url } from 'node:inspector'
import { resolveSoa } from 'node:dns'

import * as bcrypt from 'bcrypt';
const saltRounds = 10;

// >> Server
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const dbPromise = open({
    filename: "namespace.db",
    driver: sqlite3.Database
})


const app = express();
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
  secret: sessionKey,
  resave: false,
  saveUninitialized: false
}))

app.set('view engine', 'ejs');

const urlencodedParser = bodyParser.urlencoded({
    extended: false,
});

const server = createServer(app)
const router = Router()
const io = new Server(server)


app.get('/', urlencodedParser, async(req, res) => {

    const db = await dbPromise;

    let ns = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    // Loop to generate characters for the specified length
    for (let i = 0; i < 7; i++) {
        let randomInd = Math.floor(Math.random() * characters.length);
        ns += characters.charAt(randomInd);
    }
    

    let namespaces = await db.all(`SELECT * FROM Namespaces WHERE namespace = '${ns}'` )

    while (namespaces.length != 0) {
        ns = '';
        for (let i = 0; i < 7; i++) {
            let randomInd = Math.floor(Math.random() * characters.length);
            ns += characters.charAt(randomInd);
        }
        namespaces = await db.all(`SELECT * FROM Namespaces WHERE namespace = '${ns}'`)
    }




    res.render('main', {data:{namespace:ns}})


})

app.get('/auth', urlencodedParser, async(req, res) => {
    res.render('auth-login');
})

app.post('/auth', urlencodedParser, async(req, res) => {

    let namespace = req.body.namespace;

    //?
    console.log(`[ OK ] POST : auth > Request for :${req.body.namespace}:.`);

    if (namespace == 'login') {res.render('auth-login')}
    else {res.render('auth-create', {data:{namespace:namespace}})}

})


app.get('/space/:id', urlencodedParser, async(req, res) => {
    res.render('405');
})

app.post('/space/:id', urlencodedParser, async(req, res) => {

    const db = await dbPromise;
    //?
    console.log(`[ OK ] POST : space + > Request for :${req.params.id}:.`);


    if (req.body.name.length != 7) {alert('Invalid namespace or password. Please try again.')}
    else {

        switch (req.body.method) {

            case 'new':


                const hashed = await bcrypt.hash(req.body.pwd, saltRounds);


                await db.run('INSERT INTO Namespaces (namespace, alias, pwd, rank, workspaces) VALUES (?, ?, ?, ?, ?)', req.body.name, `Guest${req.body.name}`, hashed, 0, '0000000;');

                req.session.namespace = req.body.name;
                req.session.status = 'signed';
                res.render('workspace', {data:{name:req.body.name, alias:`Guest${req.body.name}`}});

                break;
            

            case 'login':

                let users = await db.all('SELECT * FROM Namespaces WHERE namespace = (?)', req.body.name);
                if (users.length == 0) {alert('User not found. Please try again.');break;}
                else {
                    bcrypt.compare(req.body.pwd, users[0].pwd, (err, result) => {
                        if (err) {alert('An error occured. Please try again.');}

                        if (result) {
                            req.session.namespace = req.body.name;
                            req.session.status = 'signed';
                            
                            res.render('workspace', {data:{name:req.body.name, alias:users[0].alias}});
                            

                        }
                        else {
                            alert ('Password not matched, please try again.')
                        }


                    })
                    break;
                }


                break; //? Just in case







        }


    }
    

    

})




const setup = async () => {
    const db = await dbPromise;
    await db.migrate();
    server.listen(5173, () => {
        console.log('Listening on port 5173...')
    })

}


setup()