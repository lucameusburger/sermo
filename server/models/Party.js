const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    web: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    defaultImg: {
      type: String,
      required: false,
    },
    politicians: [{ type: Schema.Types.ObjectId, ref: 'Politician' }],
  },
  { collection: 'party' }
);

module.exports = mongoose.model('Party', PartySchema);
