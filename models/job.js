const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const paginate = require("mongoose-paginate");

const jobSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
  },
});

jobSchema.plugin(paginate);

module.exports = mongoose.model("Job", jobSchema);
