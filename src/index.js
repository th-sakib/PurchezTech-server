import "dotenv/config";
import connectDb from "./db/db.js";
import { app } from "./app.js";

const PORT = process.env.PORT;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The server is listening at http://localhost/${PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongodb connection error: ", error);
    process.exit(1); // Exit the process if the connection fails
  });
