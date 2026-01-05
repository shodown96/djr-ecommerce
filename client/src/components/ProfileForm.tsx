import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { connect } from "react-redux";
import {
    authDeleteAccount,
    authUpdateDetails,
} from "../store/actions/auth";

type User = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
};

type Props = {
  user: User;
  loading: boolean;
  error: any;
  updateProfile: (data: User) => void;
  deleteAccount: () => void;
};

const ProfileForm: React.FC<Props> = ({
  user,
  updateProfile,
  loading,
  error,
  deleteAccount,
}) => {
  const [data, setData] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
  });

  const [success, setSuccess] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (user) {
      setData({ ...user });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateProfile(data);
    setSuccess(true);
  };

  const handleDelete = () => {
    setTimeout(() => {
      setDeleted(true);
      setTimeout(() => deleteAccount(), 1500);
    }, 1000);
  };

  const renderErrors = (e: any) => (
    <>
      {e.email && <p>Email: {e.email}</p>}
      {e.username && <p>Username: {e.username}</p>}
      {e.first_name && <p>First Name: {e.first_name}</p>}
      {e.last_name && <p>Last Name: {e.last_name}</p>}
    </>
  );

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-100 p-4 text-red-800">
          <h4 className="font-semibold">
            There were some errors with your submission
          </h4>
          {error.response?.data ? (
            renderErrors(error.response.data)
          ) : (
            <p>{error.message}</p>
          )}
        </div>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      )}

      {!error && success && (
        <div className="rounded-md bg-green-100 p-4 text-green-800">
          <h4 className="font-semibold">Profile Update !!</h4>
          <p>Your profile has been successfully updated !!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="first_name"
          placeholder="First Name"
          value={data.first_name}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="last_name"
          placeholder="Last Name"
          value={data.last_name}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleChange}
          required
          className="w-full rounded border px-3 py-2"
        />

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Update
        </button>
      </form>

      {deleted && (
        <div className="rounded-md bg-green-100 p-4 text-green-800">
          <p>Your account has been deleted successfully !!</p>
        </div>
      )}

      <div className="rounded-md bg-red-100 p-4 text-red-800">
        <h4 className="font-semibold">Delete Your Account</h4>
        <p className="mb-2">
          Once you do this, there is no going back.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
          Delete my account
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.auth.user,
  loading: state.auth.loading,
  error: state.auth.error,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateProfile: (data: User) => dispatch(authUpdateDetails(data)),
  deleteAccount: () => dispatch(authDeleteAccount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileForm);
