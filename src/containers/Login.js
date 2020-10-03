import React, { Component } from 'react'
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authLogin } from "../store/actions/auth";
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn, MDBAlert } from 'mdbreact';

class Login extends Component {

  state = {
    username: "",
    password: "",
    success: false
  };

  handleChange = e => {
    this.setState({ ...this.state, [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    this.props.login(username, password);
    this.setState({ ...this.state, success: true })
  };

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
              <p className="h5 text-center mb-4">Login</p>
              {error && success && (
                <MDBAlert color="danger">
                  <h3>There were some errors with your submission</h3>
                  {error.response && error.response.data ? <p>{error.response.data.non_field_errors}</p> :
                    <p>{error.message}</p>}
                </MDBAlert>
              )}
              <div className="grey-text">
                <MDBInput label="Username" name="username" icon="user" group onChange={this.handleChange} required />
                <MDBInput label="Password" name="password" icon="lock" group type="password" onChange={this.handleChange} required />
              </div>
              <div className="text-center">
                <MDBBtn loading={loading.toString()} disabled={loading} color="elegant" type="submit">Login</MDBBtn>
                <p>New to us? <NavLink to="/signup">Sign Up</NavLink></p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    )
  }
}

// export default Login
const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => dispatch(authLogin(username, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
