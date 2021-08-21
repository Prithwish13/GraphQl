const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("express-jwt");
const { gql, ApolloServer } = require("apollo-server-express");
const {makeExecutableSchema} = require("@graphql-tools/schema")
const graphqlResolver = require("./graphql/resolvers");
const User = require("./models/user");
require("dotenv").config()


mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then((result) => {
      console.log(`mongodb connected on ${process.env.MONGO_URI}`)
      
    })
    .catch((err) => console.log(err));
   
async function startServer (){
  
  const auth =  jwt({
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
      console.log(req.user)
      const user = await User.findOne({ _id: req.user? req.user._id: null }).lean().exec();
      return {
        user: user ? user : null,
      };
    } catch (error) {
      throw new Error(error);
    }
  };
  const schema =  makeExecutableSchema({
    typeDefs: graphqlSchema,
    resolvers: graphqlResolver,
  })
  const apolloServer =   new ApolloServer({
    schema,
    context
  });
  await apolloServer.start()
  apolloServer.applyMiddleware({ app });
  app.listen(5000,()=>{
        console.log(`server is running on port 5000`)
      })
  
  // app.use((error, req, res, next) => {
  //   console.log(error);
  //   const status = error.statusCode || 500;
  //   const message = error.message;
  //   const data = error.data;
  //   res.status(status).json({ message: message, data: data });
  // });
  
  
}
 startServer().then(()=>{
   console.log("server is running")
 }).catch(err => console.log(err))
