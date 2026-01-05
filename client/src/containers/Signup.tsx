import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authSignup } from "../store/actions/auth";

const Signup = ({ signup, loading, error, token }: any) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password1, password2 } = form;
    signup(username, email, password1, password2);
    setSuccess(true);
  };

  const renderErrors = (e: any) => (
    <>
      {e.email && <p>Email: {e.email}</p>}
      {e.username && <p>Username: {e.username}</p>}
      {e.password1 && <p>Password: {e.password1}</p>}
    </>
  );

  return (
    <div className="max-w-lg mx-auto px-4">
      <form
        onSubmit={handleSubmit}
        className="mt-10 rounded-lg border bg-white p-6 shadow"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold">
          Sign up
        </h2>

        {error && success && (
          <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
            <h3 className="font-semibold">
              There were some errors with your submission
            </h3>
            {error.response?.data
              ? renderErrors(error.response.data)
              : error.message}
          </div>
        )}

        <div className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />

          <input
            type="password"
            name="password1"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />

          <input
            type="password"
            name="password2"
            placeholder="Confirm password"
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.auth.loading,
  error: state.auth.error,
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch: any) => ({
  signup: (username: string, email: string, password1: string, password2: string) =>
    dispatch(authSignup(username, email, password1, password2)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
