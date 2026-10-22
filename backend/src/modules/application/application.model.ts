import mongoose, { Schema } from "mongoose";
import { IApplication } from "./application.interface";

const stageTimelineSchema = new Schema(
  {
    stage: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: String,
      default: null,
    },
    candidateId: {
      type: String,
      required: true,
      index: true,
    },
    jobTitle: {
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
    salary: {
      type: String,
      default: "Negotiable",
    },
    type: {
      type: String,
      default: "Full-time",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    portfolioUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    coverNote: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["applied", "reviewing", "interview", "offered", "rejected"],
      default: "applied",
    },
    stageTimeline: {
      type: [stageTimelineSchema],
      default: () => [
        {
          stage: "Application Submitted",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          completed: true,
        },
        { stage: "Profile Review", date: "Pending", completed: false },
        { stage: "Technical Interview", date: "Pending", completed: false },
        { stage: "Final Offer", date: "Pending", completed: false },
      ],
    },
    appliedDate: {
      type: String,
      default: () =>
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
    },
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);
