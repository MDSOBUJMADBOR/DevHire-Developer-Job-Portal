import { Link, useLocation } from "react-router-dom";

const Placeholder = () => {
  const { pathname } = useLocation();
  const title = pathname
    .replace("/", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
        Coming soon
      </span>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title || "Home"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-base-content/60">
        This DevHire section is on the way. Browse open roles or head back
        home for now.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          to="/jobs"
          className="btn btn-primary rounded-full px-6 font-bold"
        >
          Browse jobs
        </Link>
        <Link to="/" className="btn btn-ghost rounded-full border border-base-300 px-6 font-bold">
          Home
        </Link>
      </div>
    </div>
  );
};

export default Placeholder;
