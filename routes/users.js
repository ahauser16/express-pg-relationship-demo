/** Routes for users of pg-relationships-demo. */

const db = require("../db");
const express = require("express");
const router = express.Router();


/** Get users: [user, user, user] */

router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
          `SELECT id, name, type FROM users`);

    return res.json(results.rows);
  }

  catch (err) {
    return next(err);
  }
});

/** Get user: {name, type, messages: [{msg, msg}]} */
// This `get` route, defined in `routes/users.js`, is designed to fetch and return a specific user's details along with their associated messages from a PostgreSQL database. The route is part of an Express application that interacts with a PostgreSQL database using the `pg` module, as configured in `db.js`.
router.get("/:id", async function (req, res, next) {
  try {
    const userRes = await db.query(
      //Fetching User Details: This SQL query selects the `name` and `type` columns from the `users` table where the `id` column matches the parameter `$1`. The `$1` is a placeholder for parameterized queries in PostgreSQL, which helps prevent SQL injection attacks. The value for `$1` is provided by `req.params.id`, which is the user ID extracted from the URL parameter `:id`.
          `SELECT name, type FROM users WHERE id=$1`,
        [req.params.id]);

    const messagesRes = await db.query(
      //Fetching User Messages: This query selects the `id` and `msg` (message content) columns from the `messages` table where the `user_id` column matches the parameter `$1`, again using `req.params.id` as the value. This fetches all messages associated with the user.
          `SELECT id, msg FROM messages 
             WHERE user_id = $1`,
        [req.params.id]);

    const user = userRes.rows[0];
    user.messages = messagesRes.rows;
    return res.json(user);
  }

  catch (err) {
    return next(err);
  }
});
//I. Additional Notes: Route Path: The route is accessed via a GET request to `/users/:id`, where `:id` is a placeholder for the user ID. For example, accessing `/users/3` would fetch the details and messages for the user with ID 3.
//A. Database Interaction: The route makes two separate queries to the database:
// (i) The first query fetches the user's details based on their ID.
// (ii) The second query fetches all messages associated with that user.
//B. Response Construction: After fetching the data, the user's details (from the first query) are stored in a variable `user`. The messages (from the second query) are then added to this `user` object under the messages key. This enriched `user` object, which now contains both the user's details and their messages, is then returned as a JSON response.
//C. Error Handling: If any error occurs during the database queries or any other part of the route's execution, the error is caught and passed to the next error handling middleware by calling `next(err)`.

module.exports = router;