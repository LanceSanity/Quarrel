import React from 'react'
import TopNav from './top_nav'
import Sidebar from './sidebar'
import PrimaryView from './primary_view'
import PacmanLoader from 'react-spinners/PacmanLoader'

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
        App.appearances = App.cable.subscriptions.create({
            channel: 'AppearanceChannel'
        });
        const { error, isLoaded } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                // <PacmanLoader
                //     size={150}
                //     loading={isLoaded}
                // />
                'Loading...'
            )
        } else {
            return (
                <div className="workspace">
                    <div className="client-grids">
                        <div className="workspace-banner"></div>
                        <TopNav
                            currentUser={this.props.currentUser}
                            logoutUser={this.props.logoutUser}
                            activeChannel={this.props.activeChannel}
                            updateChannel={this.props.updateChannel}
                            channels={this.props.channels}
                            users={this.props.users}
                            userId={this.props.userId}
                            memberships={this.props.memberships}
                            createMembership={this.props.createMembership}
                            deleteMembership={this.props.deleteMembership}
                            history={this.props.history}
                        />
                        <Sidebar
                            channels={this.props.channels}
                            users={this.props.users}
                            userId={this.props.userId}
                            createMembership={this.props.createMembership}
                            memberships={this.props.memberships}
                            deleteMembership={this.props.deleteMembership}
                            activeChannel={this.props.activeChannel}
                            createChannel={this.props.createChannel}
                            history={this.props.history}
                            receiveMessage={this.props.receiveMessage}
                        />
                        <PrimaryView
                            channels={this.props.channels}
                            createMembership={this.props.createMembership}
                            users={this.props.users}
                            userId={this.props.userId}
                            activeChannel={this.props.activeChannel}
                            createMessage={this.props.createMessage}
                            deleteMessage={this.props.deleteMessage}
                            updateMessage={this.props.updateMessage}
                            messages={this.props.messages}
                            currentUser={this.props.currentUser}
                            memberships={this.props.memberships}
                        />
                    </div>
                </div>
            )
        }
    }
}

export default Workspace