const pgp = require('pg-promise')();
const db = pgp({
    host: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    database: process.env.DB_USER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Configure the server and its routes.

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// const port = "https://spoton.azurewebsites.net/user";
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/users", readUsers);
router.get("/users/:emailAddress", readUser);
// router.put("/users/:email", updateUser);
router.post('/users', createUser);
// router.delete('/players/:id', deleteUser);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

// Implement the CRUD operations.

function returnDataOr404(res, data) {
    if (data == null) {
        res.sendStatus(404);
    } else {
        res.send(data);
    }
}

function readHelloMessage(req, res) {
    res.send('Hello, Welcome to SpotOn!!!');
}

 function readUsers(req, res, next) {
    db.many("SELECT * FROM Users")
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        })
}

function readUser(req, res, next) {
    db.oneOrNone('SELECT * FROM Users WHERE emailAddress=${emailAddress}', req.params)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

// function updateUser(req, res, next) {
//     db.oneOrNone('UPDATE Player SET email=${body.email}, name=${body.name} WHERE id=${params.id} RETURNING id', req)
//         .then(data => {
//             returnDataOr404(res, data);
//         })
//         .catch(err => {
//             next(err);
//         });
// }

function createUser(req, res, next) {
    db.one('INSERT INTO Users(user_name, emailAddress, password) VALUES (${user_name}, ${emailaddress}, ${password}) RETURNING emailAddress', req.body)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            next(err);
        });
}
// async function insertUser(email, password) {
//   try {
//     const query = `
//       INSERT INTO Users (email, password)
//       VALUES ($1, $2)
//       RETURNING email;`;

//     const result = await db.one(query, [email, password]);
//     console.log(`User inserted with email: ${result.email}`);
//   } catch (error) {
//     console.error('Error inserting user:', error);
//   }
// }

// function deleteUser(req, res, next) {
//     db.oneOrNone('DELETE FROM Player WHERE id=${id} RETURNING id', req.params)
//         .then(data => {
//             returnDataOr404(res, data);
//         })
//         .catch(err => {
//             next(err);
//         });
// }
