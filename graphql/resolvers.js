const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job");
const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const job = require("../models/job");

const Query = {
  company: async (root, args) => {
    const companyData = await Company.findOne({ _id: args.id }).lean().exec();
    return companyData;
  },

  jobs: async (root, { pagination }) => {
    // const jobs = await Job.find().populate("companyId").lean().exec();
    const jobs = await Job.paginate(
      {},
      {
        ...pagination,
        populate: {
          path: "companyId",
        },
        lean: true,
      }
    );
    const updatedJob = jobs.docs.map((job) => {
      return {
        ...job,
        company: job.companyId,
        comapanyId: null,
      };
    });
    delete jobs.docs;
    return {
      item: updatedJob,
      ...jobs,
    };
  },
};

const Mutation = {
  createUser: async function (root, { userInput }, contex) {
    console.log(userInput);
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new UserInputError("User exists already!", {
        data: "an error occured",
      });
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
      companyId: userInput.companyId,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  createCompany: async function (root, { companyInput }, contex) {
    const existingCompany = await Company.findOne({ name: companyInput.name });
    if (existingCompany) {
      throw new UserInputError("Company name already exists");
    }
    const companyData = {
      name: companyInput.name,
      description: companyInput.description,
    };
    console.log(companyData);
    try {
      const createdCompany = await Company.create(companyData);
      console.log(createdCompany);
      return {
        ...createdCompany._doc,
        _id: createdCompany._id.toString(),
      };
    } catch (error) {
      console.log(error);
    }
  },

  login: async (root, { loginInput }) => {
    const { email, password } = loginInput;
    const user = await User.findOne({ email }).lean().exec();
    if (!user) {
      throw new UserInputError("No user with that email");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError("Incorrect password");
    }
    return jwt.sign({ _id: user._id, email: user.email }, "misterj", {
      expiresIn: "1d",
    });
  },

  createJob: async (root, { jobInput }, { user }) => {
    if (!user) {
      throw new AuthenticationError("Unauthorize");
    }
    console.log(jobInput);
    try {
      const jobObject = {
        title: jobInput.title,
        description: jobInput.description,
        companyId: user.companyId,
      };
      const createdJob = await Job.create(jobObject);
      return {
        ...createdJob._doc,
        _id: createdJob._id.toString(),
      };
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = {
  Mutation,
  Query,
};
