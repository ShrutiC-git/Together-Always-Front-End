import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { TwitterButton } from 'react-social-buttons'
import { Menu } from 'semantic-ui-react'


export default class Header extends Component {
    static propTypes = {
        authenticated: PropTypes.bool.isRequired
    };
    render() {
        const { authenticated } = this.props;
        return (
          <Menu>
                <Menu.Item>
                    <Link to="/">Home</Link>
                </Menu.Item>
                {authenticated ? (
                    <Menu.Item onClick={this._handleLogoutClick}>Logout</Menu.Item>
                ) : (
                        <Menu.Item onClick={this._handleSignInClick}>Login</Menu.Item>
                )}
          </Menu>
        );
    }

    _handleSignInClick = () => {
        // Authenticate using via passport api in the backend
        // Open Twitter login page
        // Upon successful login, a cookie session will be stored in the client
        window.open("http://localhost:4000/auth/twitter", "_self");
    };

    _handleLogoutClick = () => {
        // Logout using Twitter passport api
        // Set authenticated state to false in the HomePage
        window.open("http://localhost:4000/auth/logout", "_self");
        this.props.handleNotAuthenticated();
    };
}
