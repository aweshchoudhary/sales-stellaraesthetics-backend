import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import sessions from "express-session";
import { config } from "dotenv";
import api from "./api";
import authenticate from "./api/middlewares/auth.middleware";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./api/auth/fireabase.login";

// Load environment variables from .env file
config();

// Create Express application
const app: Application = express();

// Set the port number to either the environment variable PORT or default to 5000
const PORT = process.env.PORT || 5000;

// Morgan Setup: Middleware for logging HTTP requests to the console in the development mode
app.use(morgan("dev"));

// Helmet Setup: Middleware to enhance security by setting various HTTP headers
app.use(helmet());

// Body Parser Setup: Middleware to parse request bodies in JSON and URL-encoded formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cookie Parser Setup: Middleware to parse cookies from incoming requests
app.use(cookieParser());

// CORS Setup: Middleware to allow cross-origin resource sharing
app.use(cors());

const session = {
  secret: process.env.SESSION_SECRET_KEY || "defaultSecretKey", // Provide a default secret key if not present in .env
  cookie: {
    secure: false,
  },
  resave: false,
  saveUninitialized: false,
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

app.use(sessions(session));

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  await signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user1 = userCredential.user;
      const token = await userCredential.user.getIdToken();
      // console.log(user1);
      res.json({ data: user1, token });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      res.status(400).json({ error: errorMessage });
    });

  // admin
  //   .auth()
  //   .signInWithEmailAndPassword(email, password)
  //   .then((userCredential) => {
  //     // User is authenticated
  //     const user = userCredential.user;
  //     console.log(`User ${user.email} is authenticated`);
  //   })
  //   .catch((error) => {
  //     // Authentication failed
  //     console.error("Authentication failed:", error);
  //   });
});

// Mount the API routes under /api/v1 path
app.use("/api/v1", authenticate, api);
// app.use("/api/v1", isAuthenticated, api);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
