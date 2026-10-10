export const validateRegister = (
  data: any
) => {
  if (!data.name) {
    throw new Error("Name is required");
  }

  if (!data.email) {
    throw new Error("Email is required");
  }

  if (!data.password) {
    throw new Error("Password is required");
  }

  if (data.password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters"
    );
  }
};