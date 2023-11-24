const mongoose = require("mongoose");

const Contact_Schema = new mongoose.Schema(
  {
    company: String,
    contactPerson: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    whatsapp: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: {
      line1: String,
      line2: String,
      country: Object,
      city: Object,
      state: Object,
      postalCode: Number,
    },
  },
  { timestamps: true }
);

Contact_Schema.index({
  company: "text",
  contactPerson: "text",
  mobile: "text",
  whatsapp: "text",
  email: "text",
});

const Contact_Model = mongoose.model("Contact", Contact_Schema);

module.exports = Contact_Model;
