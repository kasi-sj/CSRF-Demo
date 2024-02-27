const express = require("express");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");

const app = express();
const PORT = 3000;

let MONEY = 100000;

// Middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static("public"));

// Define a hardcoded list of users for simplicity
const users = {
  admin: "password123",
};

// Function to verify user for each transaction
const verifyUser = basicAuth({
  users,
  challenge: true,
  unauthorizedResponse: "Unauthorized access. Please log in.",
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Route to handle form submission for transfer, requires user verification
// Transfer money route
app.post("/transfer", verifyUser, (req, res) => {
  const { amount, toAccount } = req.body;
  console.log(`Transferring $${amount} to account ${toAccount}`);
  MONEY -= amount;
  console.log(`Remaining amount $${MONEY}`);

  // Prepare HTML response with styling
  const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Transfer Successful</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 50px auto;
                  background-color: #fff;
                  border-radius: 5px;
                  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                  padding: 20px;
              }
              h1 {
                  color: #333;
                  text-align: center;
              }
              p {
                  color: #666;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Transfer Successful</h1>
              <p>You have transferred $${amount} to account ${toAccount}.</p>
              <p>Remaining amount: $${MONEY}</p>
          </div>
      </body>
      </html>
  `;

  res.send(htmlResponse);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
