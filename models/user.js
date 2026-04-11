const mongoose = require("mongoose");
const { Schema } = mongoose;

const passportLocalMongooseImport = require("passport-local-mongoose");

// plugin ko safe tarike se function me convert karo
const passportLocalMongoose =
  typeof passportLocalMongooseImport === "function"
    ? passportLocalMongooseImport
    : passportLocalMongooseImport.default;

if (typeof passportLocalMongoose !== "function") {
  throw new Error(
    "passport-local-mongoose plugin load nahi hua. Package reinstall karo."
  );
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);