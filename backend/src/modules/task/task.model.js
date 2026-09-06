const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },

    column: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
      default: "Development",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    position: {
      type: Number,
      required: true,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({
  board: 1,
  column: 1,
  position: 1,
});

taskSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.boardId = ret.board.toString();
    ret.columnId = ret.column.toString();

    ret.category = ret.type;

    const categoryColors = {
      Design: "blue",
      Research: "green",
      Content: "orange",
      QA: "red",
      Development: "purple",
      Meeting: "gray",
    };

    ret.categoryColor =
      categoryColors[ret.type] || "purple";

    if (ret.dueDate) {
      ret.dueDate = ret.dueDate
        .toISOString()
        .split("T")[0];
    } else {
      ret.dueDate = "";
    }

    delete ret._id;
    delete ret.__v;

    return ret;
  },
});

module.exports = mongoose.model("Task", taskSchema);