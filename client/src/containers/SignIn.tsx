import React, { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { authSignIn } from "../store/actions/auth";

type Props = {
  loading: boolean;
  error: any;
  token: string | null;
  login: (username: string, password: string) => void;
};

const SignIn: React.FC<Props> = ({
  loading,
  error,
  token,
  login,
}) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(form.username, form.password);
    setSuccess(true);
  };

 useEffect(() => {
    if (token) {
      navigate("/products");
    }
  }, [token]);
  return (
    <div className="max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-center text-xl font-semibold">Signin</h3>

        {error && success && (
          <div className="rounded bg-red-100 p-4 text-red-800">
            <h3 className="font-semibold">
              There were some errors with your submission
            </h3>
            {error.response?.data ? (
              <p>{error.response.data.non_field_errors}</p>
            ) : (
              <p>{error.message}</p>
            )}
          </div>
        )}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />

        <div className="text-center space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-gray-900 px-6 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Signin"}
          </button>

          <p className="text-sm">
            New to us?{" "}
            <NavLink
              to="/sign-up"
              className="text-blue-600 underline"
            >
              Sign Up
            </NavLink>
          </p>
        </div>
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
  login: (username: string, password: string) =>
    dispatch(authSignIn(username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
