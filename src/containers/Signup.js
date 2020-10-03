import React, { Component } from 'react'
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authSignup } from "../store/actions/auth";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBAlert } from 'mdbreact';

class Signup extends Component {

  state = {
    username: "",
    email: "",
    password1: "",
    password2: "",
    success: false
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, email, password1, password2 } = this.state;
    this.props.signup(username, email, password1, password2);
    this.setState({ ...this.state, success: true })
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleErrors = (e) => <>
    {e.email && <p className="mb-0">Email: {e.email}</p>}
    {e.username && <p className="mb-0">Username: {e.username}</p>}
    {e.password1 && <p className="mb-0">Password: {e.password1}</p>}
  </>

  render() {
    const { error, loading, token } = this.props;
    const { success } = this.state;

    if (token) {
      return <Redirect to="/" />;
    }


    return (
      <MDBContainer>
        <MDBRow around>
          <MDBCol md="8">
            <form onSubmit={this.handleSubmit}>
              <p className="h5 text-center mb-4">Signup</p>
              {error && success && (
                <MDBAlert color="danger">
                  <h3>There were some errors with your submission</h3>
                  {error.response && error.response.data ? <p>{this.handleErrors(error.response.data)}</p> :
                    <p>{error.message}</p>}
                </MDBAlert>
              )}
              <div className="grey-text">
                <MDBInput label="Username" name="username" icon="user" group onChange={this.handleChange} required />
                <MDBInput label="Email" name="email" icon="envelope" group type="email" onChange={this.handleChange} required />
                <MDBInput label="Password" name="password1" icon="lock" group type="password" onChange={this.handleChange} required />
                <MDBInput label="Confirm password" name="password2" icon="lock" group type="password" onChange={this.handleChange} required />
              </div>
              <div className="text-center">
                <MDBBtn loading={loading.toString()} disabled={loading} color="elegant" type="submit">Signup</MDBBtn>
                <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    )
  }
}

// export default Signup
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signup: (username, email, password1, password2) =>
      dispatch(authSignup(username, email, password1, password2))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
