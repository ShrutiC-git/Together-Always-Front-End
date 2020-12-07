import Header from "./Header";
import PropTypes from "prop-types";
import React, { Component } from "react";
import '../styles/Header.css';
import { Container, Card, Icon, Image, CardDescription } from 'semantic-ui-react'

export default class HomePage extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            profileImageUrl: PropTypes.string,
            twitterId: PropTypes.string,
            screenName: PropTypes.string,
            _id: PropTypes.string,
        })
    };

    state = {
        user: {},
        error: null,
        authenticated: false,
        follower_name: null,
        follower_image: null,
        follower_screenname: null
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
            <div className='mainDiv'>
                <Header
                    authenticated={authenticated}
                    handleNotAuthenticated={this._handleNotAuthenticated}
                />
                <img src='https://cdn2.iconfinder.com/data/icons/mental-health-soft-fill/60/Mental_Health-heart-brain-love-512.png' />
                <div>
                    <Container>
                        {!authenticated ? (
                            <h1 className='textHome'>Welcome!</h1>
                        ) : (
                                <>
                                    <div>
                                        <h1 className='textEnter'>Welcome {this.state.user.name}!</h1>
                                        <Follower followers={this.state.followers} follower_name={this.state.follower_name} follower_screenname={this.state.follower_screenname} follower_image={this.state.follower_image} />
                                        <button className='button button2' onClick={this.handleCheckFriends}>How are My Friends</button>

                                    </div>

                                </>
                            )}
                    </Container>

                </div>
            </div >
        );
    }
    _handleNotAuthenticated = () => {
        this.setState({ authenticated: false });
        console.log('The state when not logged in is', this.state)
    };

    handleCheckFriends = () => {
        fetch("http://localhost:4000/check_friends", {
            method: 'GET',
            credentials: "include"
        })
            .then(res => res.text())
            .then(async (json) => {
                console.log(json)
                const info = await json
                this.setState({ followers: info }, () => this.forceUpdate())
                console.log('The state is', this.state.followers)
                const follow_info = JSON.parse(this.state.followers);
                console.log(follow_info);
                console.log('The name is', follow_info.follower_screenname)
                this.setState({ follower_name: follow_info.follower_name, follower_screenname: follow_info.follower_screenname, follower_image: follow_info.follower_profile_image })
            })
    }

}

class Follower extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {this.props.followers != null ?
                    <div className='forCard'>
                        <div>
                            <Card>
                                <Image src='https://pbs.twimg.com/profile_images/1328586762214584322/LmBAtdxx_normal.jpg' wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>{this.props.follower_name}</Card.Header>
                                    <Card.Meta>Twitter Username: {this.props.follower_screenname}</Card.Meta>
                                    <CardDescription>
                                        {this.props.follower_name} hasn't been feeling good lately. Message them and cheer them up! <a href='https://twitter.com' onClick="location.href=this.href+'/'+this.props.follower_screenname" target="_blank">Click Here</a>
                                    </CardDescription>
                                </Card.Content>
                            </Card>
                        </div>
                        <div>
                            <Card>
                                <Image src='http://pbs.twimg.com/profile_images/1222195268772409344/aM0nAWR6_normal.jpg' wrapped ui={false} />
                                <Card.Content>
                                    <Card.Header>DanyGC</Card.Header>
                                    <Card.Meta>Twitter Username:phibs_nan</Card.Meta>
                                    <CardDescription>
                                        DanyGC hasn't been feeling good lately. Message them and cheer them up! <a href='https://twitter.com' onClick="location.href=this.href+'/'+this.props.follower_screenname" target="_blank">Click Here</a>
                                    </CardDescription>
                                </Card.Content>
                            </Card>
                        </div>
                    </div> : <div />

                }

            </div>

        )
    }
}
