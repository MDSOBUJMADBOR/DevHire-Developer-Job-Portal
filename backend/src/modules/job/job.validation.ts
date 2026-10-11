export const validateCreateJob = (data: any) => {
  if (!data.title) {
    throw new Error("Job title is required");
  }

  if (!data.category) {
    throw new Error("Category is required");
  }

  if (!data.company) {
    throw new Error("Company is required");
  }

  if (!data.location) {
    throw new Error("Location is required");
  }

  if (!data.workplace) {
    throw new Error("Workplace is required");
  }

  if (!data.type) {
    throw new Error("Employment type is required");
  }

  if (!data.level) {
    throw new Error("Experience level is required");
  }

  if (!data.description) {
    throw new Error("Job description is required");
  }

  if (!data.contactEmail) {
    throw new Error("Contact email is required");
  }

  if (
    data.salary?.min != null &&
    data.salary?.max != null &&
    Number(data.salary.min) > Number(data.salary.max)
  ) {
    throw new Error(
      "Minimum salary cannot be greater than maximum salary"
    );
  }
};
