import mongoose, { Schema } from "mongoose";
import { IJob } from "./job.interface";

const salarySchema = new Schema(
  {
    min: {
      type: Number,
      default: null,
    },

    max: {
      type: Number,
      default: null,
    },

    currency: {
      type: String,
      default: "USD",
    },
  },
  { _id: false }
);

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    workplace: {
      type: String,
      required: true,
      enum: ["Remote", "Hybrid", "On-site"],
    },

    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },

    level: {
      type: String,
      required: true,
      enum: ["Junior", "Mid", "Senior", "Lead"],
    },

    salary: {
      type: salarySchema,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    requirements: {
      type: String,
      trim: true,
    },

    deadline: {
      type: Date,
      default: null,
    },

    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    postedBy: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model<IJob>("Job", jobSchema);
