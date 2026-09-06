const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      default: "todo",
      trim: true,
    },

    position: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

columnSchema.index({ board: 1, position: 1 });

columnSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.boardId = ret.board.toString();

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

module.exports = mongoose.model("Column", columnSchema);