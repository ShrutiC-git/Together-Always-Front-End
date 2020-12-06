import Header from "./Header";
import PropTypes from "prop-types";
import React, { Component } from "react";
import '../styles/Header.css';
import { Container } from 'semantic-ui-react'

export default class HomePage extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            profileImageUrl: PropTypes.string,
            twitterId: PropTypes.string,
            screenName: PropTypes.string,
            _id: PropTypes.string
        })
    };

    state = {
        user: {},
        error: null,
        authenticated: false
    };

    componentDidMount() {
        // Fetch does not send cookies. So you should add credentials: 'include'
        fetch("http://localhost:4000/auth/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            }
        })
            .then(response => {
                console.log(response)
                if (response.status === 200) return response.json();
                throw new Error("failed to authenticate user");
            })
            .then(responseJson => {
                this.setState({
                    authenticated: true,
                    user: responseJson.user
                });
            })
            .catch(error => {
                this.setState({
                    authenticated: false,
                    error: "Failed to authenticate user"
                });
            });
    }
    render() {
        const { authenticated } = this.state;
        console.log('All the user info we are getting is ', this.state.user)
        return (
            <div>
                    <Header
                        authenticated={authenticated}
                        handleNotAuthenticated={this._handleNotAuthenticated}
                    />
                    <div>
                          <Container>
                        {!authenticated ? (          
                            <h1>Welcome!</h1>
                        ) : (
                                <div>
                                    <h1>You have logged-in succcessfully!</h1>
                                    <h2>Welcome {this.state.user.name}!</h2>
                                    <button className='button button2' onClick={this.handleCheckFriends}>Check on My Friends</button>
                                </div>
                            )}
                            </Container>
                    </div>
            </div>
        );
    }

    _handleNotAuthenticated = () => {
        this.setState({ authenticated: false });
        console.log('The state when not logged in is', this.state)
    };

    handleCheckFriends = () =>{
        fetch("http://localhost:4000/check_friends", {
            method:'GET',
            credentials: "include"
        })
    }
}
