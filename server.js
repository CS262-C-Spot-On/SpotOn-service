// Configure the server and its routes.
const express = require("express");
const pgp = require("pg-promise")();

const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_USER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const app = express();
const port = process.env.PORT || 3000;
// const port = "https://spoton.azurewebsites.net/user";
const router = express.Router();
router.use(express.json());

router.get("/", readHelloMessage);
router.get("/users", readUsers);
router.get("/users/:emailAddress", readUser);
router.put("/users/:email", updateUser);
router.post("/users", createUser);
router.delete('/users/:emailAddress', deleteUser);
router.get("/prompts", readPrompts);
router.get("/prompts/:emailAddress", readUsersPrompts);
router.post("/prompts", createPrompt);
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
  res.send("Hello, Welcome to SpotOn!!!");
}

function readUsers(req, res, next) {
  db.many("SELECT * FROM Users")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readPrompts(req, res, next) {
  db.many("SELECT * FROM Prompts")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readUsersPrompts(req, res, next) {
  db.many("SELECT * FROM Prompts WHERE email = ${emailAddress}",
  req.params,
).then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function readUser(req, res, next) {
  db.oneOrNone(
    "SELECT * FROM Users WHERE emailAddress=${emailAddress}",
    req.params,
  )
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

function updateUser(req, res, next) {
    db.oneOrNone('UPDATE Users SET emailAddress=${body.emailAddress}, users_name=${body.users_name}, password = ${password} WHERE id=${params.id} RETURNING id', req)
        .then(data => {
            returnDataOr404(res, data);
        })
        .catch(err => {
            next(err);
        });
}

function createUser(req, res, next) {
  db.one(
    "INSERT INTO Users(users_name, emailAddress, password) VALUES (${users_name}, ${emailAddress}, ${password}) RETURNING emailAddress",
    req.body,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteUser(req, res, next) {
  // Assuming 'emailAddress' is the primary key in your Users table
  db.oneOrNone('DELETE FROM Users WHERE emailAddress=${emailAddress} RETURNING id', req.params)
      .then(data => {
          returnDataOr404(res, data);
      })
      .catch(err => {
          next(err);
      });
}

function createPrompt(req, res, next) {
  db.one(
    "INSERT INTO Prompts(prompt, email, prompt_date) VALUES (${prompt}, ${email}, ${prompt_date}) RETURNING prompt",
    req.body,
  )
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
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

