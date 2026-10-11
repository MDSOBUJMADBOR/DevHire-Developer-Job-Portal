export interface IJobSalary {
  min: number | null;
  max: number | null;
  currency: string;
}

export interface IJob {
  title: string;
  category: string;
  company: string;
  location: string;
  workplace: string;
  type: string;
  level: string;
  salary?: IJobSalary | null;
  skills: string[];
  description: string;
  requirements?: string;
  deadline?: Date | null;
  contactEmail: string;
  postedBy: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
}

export interface ICreateJob {
  title: string;
  category: string;
  company: string;
  location: string;
  workplace: string;
  type: string;
  level: string;
  salary?: IJobSalary | null;
  skills?: string[];
  description: string;
  requirements?: string;
  deadline?: string | null;
  contactEmail: string;
}
