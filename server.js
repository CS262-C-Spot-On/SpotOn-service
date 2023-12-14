/**
 * This module configures the SpotOn web service.
 * The service provides CRUD operations for Users and Prompts using a PostgreSQL database.
 *
 * To enhance security, pg-promise's variable escaping is used to prevent SQL injection attacks.
 * The environment variables (DB_SERVER, DB_PORT, DB_USER, DB_PASSWORD) should be set for database connection.
 *
 * @author: Aryan Jha [Implementing REST API endpoints and writing SQL queries]
 * @author: Heyab Robel [Initiating the development of the service repository and setting up the Azure app service.]
 * @date: Fall 2023
 */


// Set up the database connection.
const express = require("express");
const pgp = require("pg-promise")();

const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_USER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Configure the server and its routes.
const app = express();
const port = process.env.PORT || 3000;
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

/**
 * Helper function to send data or return a 404 status.
 * @param {Object} res - Express response object.
 * @param {Object} data - Data to send in the response.
 */
function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

/**
 * Endpoint to get a welcome message.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
function readHelloMessage(req, res) {
  res.send("Hello, Welcome to SpotOn!");
}

/**
 * Endpoint to get all users.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function readUsers(req, res, next) {
  db.many("SELECT * FROM Users")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Endpoint to get all prompts.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function readPrompts(req, res, next) {
  db.many("SELECT * FROM Prompts")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Endpoint to get prompts for a specific user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function readUsersPrompts(req, res, next) {
  db.many("SELECT * FROM Prompts WHERE email = ${emailAddress}", req.params)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Endpoint to get a specific user by email address.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function readUser(req, res, next) {
  db.oneOrNone("SELECT * FROM Users WHERE emailAddress=${emailAddress}", req.params)
    .then((data) => {
      returnDataOr404(res, data);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Endpoint to update a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function updateUser(req, res, next) {
  db.oneOrNone('UPDATE Users SET emailAddress=${body.emailAddress}, users_name=${body.users_name}, password = ${password} WHERE id=${params.id} RETURNING id', req)
    .then(data => {
      returnDataOr404(res, data);
    })
    .catch(err => {
      next(err);
    });
}

/**
 * Endpoint to create a new user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function createUser(req, res, next) {
  db.one("INSERT INTO Users(users_name, emailAddress, password) VALUES (${users_name}, ${emailAddress}, ${password}) RETURNING emailAddress", req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}

/**
 * Endpoint to delete a user by email address.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function deleteUser(req, res, next) {
  db.oneOrNone('DELETE FROM Users WHERE emailAddress=${emailAddress} RETURNING id', req.params)
    .then(data => {
      returnDataOr404(res, data);
    })
    .catch(err => {
      next(err);
    });
}

/**
 * Endpoint to create a new prompt.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function createPrompt(req, res, next) {
  db.one("INSERT INTO Prompts(prompt, email, prompt_date) VALUES (${prompt}, ${email}, ${prompt_date}) RETURNING prompt", req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
}
