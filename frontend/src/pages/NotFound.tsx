import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-bold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-base-content/60">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        to="/"
        className="btn btn-primary mt-6 rounded-full px-6 font-bold"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
