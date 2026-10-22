export interface IStageTimeline {
  stage: string;
  date: string;
  completed: boolean;
}

export interface IApplication {
  _id?: string;
  jobId?: string;
  candidateId: string;
  jobTitle: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverNote?: string;
  experience?: string;
  status: "applied" | "reviewing" | "interview" | "offered" | "rejected";
  stageTimeline: IStageTimeline[];
  appliedDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateApplicationInput {
  jobId?: string;
  jobTitle: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  coverNote?: string;
  experience?: string;
}
