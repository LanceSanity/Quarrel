import React from 'react'
import TopNav from './top_nav'
import Sidebar from './sidebar'
import PrimaryView from './primary_view'

class Workspace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false
        };
    }

    componentDidMount() {
        let channels = this.props.fetchChannels();
        let messages = this.props.fetchMessages();
        let memberships = this.props.fetchAllMemberships();
        let users = this.props.fetchAllUsers();

        if (!this.state.isLoaded) {
            Promise.all([channels, messages, memberships, users])
                .then(
                    (r) => {
                        this.setState({isLoaded: true});
                    },
                    (e) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
        }
    }

    render() {
        const propState = this;
        App.appearances = App.cable.subscriptions.create({
            channel: 'AppearanceChannel'
        }, {
            received: function(data) {
                propState.props.receiveUser(data)
            }
        });
        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return null;
        } else {
            return (
                <div className="workspace">
                    <div className="client-grids">
                        <div className="workspace-banner"></div>
                        <TopNav/>
                        <Sidebar />
                        <PrimaryView
                        />
                    </div>
                </div>
            )
        }
    }
}

export default Workspace