const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("express-jwt");
const { gql, ApolloServer } = require("apollo-server-express");
const graphqlResolver = require("./graphql/resolvers");
const User = require("./models/user");
// auth middleware
const auth = jwt({
  secret: "misterj",
  credentialsRequired: false,
  algorithms: ["HS256"],
});

const graphqlSchema = gql(
  fs.readFileSync("./graphql/schema.graphql", {
    encoding: "utf-8",
  })
);

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
// application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.json(), auth);

const context = async ({ req }) => {
  try {
    const user = await User.findOne({ _id: req.user?._id }).lean().exec();
    return {
      user: user ? user : null,
    };
  } catch (error) {
    throw new Error(error);
  }
};
const apollowServer = new ApolloServer({
  typeDefs: graphqlSchema,
  resolvers: graphqlResolver,
  context,
});

apollowServer.applyMiddleware({ app, path: "/graphql" });

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect("mongodb://localhost:27017/GraphQl", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
