import React from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { createNewChannel } from '../actions/channel_actions'
import { receiveMessage } from '../actions/message_actions'
import {createNewMembership, deleteMembership} from '../actions/membership_actions'
import ReactModal from 'react-modal';
import Channel from './channel';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import Moment from 'react-moment';

class ConnectedChannelsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showChannels: false,
            value: ''
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleOpenChannels = this.handleOpenChannels.bind(this);
        this.handleCloseChannels = this.handleCloseChannels.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        ReactModal.setAppElement(document.getElementById('root'));
    }

    handleOpenModal() {
        this.setState({ showChannels: false });
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    handleOpenChannels() {
        this.setState({ showChannels: true });
    }

    handleCloseChannels() {
        this.setState({ showChannels: false });
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    myChannels() {
        let res = [];
        let active = false;
        for (let membership of this.props.memberships) {
            if (membership.user_id === this.props.userId) {
                if (membership.channel_id === this.props.activeChannel.id) active = true;
                res.push(this.props.channels[membership.channel_id]);
            }
        }
        if (!active) res.push(this.props.channels[this.props.activeChannel.id]);
        return res;
    }

    getChannels() {
        return Object.values(this.props.channels).filter(x => x.channel_name.toLowerCase().search(this.state.value.toLowerCase()) != -1);
    }

    render() {
        if (!this.props.channels[this.props.activeChannel.id]) return null;
        const searchChannels = this.getChannels();
        return (
            <div className="channels-list">
                <div style={{height: '12px'}}></div>
                <div className="sidebar-section-heading">
                    <button className="channel-section-heading" onClick={this.handleOpenChannels}>Channels</button>
                    <div className="section-heading-right">
                        <button className="add-channel-btn all-icons" onClick={this.handleOpenModal}></button>
                    </div>
                </div>
                { this.myChannels().map((channel, i) => {
                    return ( channel &&
                        <Channel
                            key={channel.id}
                            channel={channel}
                            active={channel.id === this.props.activeChannel.id}
                            deleteMembership={this.props.deleteMembership}
                            memberships={this.props.memberships}
                            userId={this.props.userId}
                            history={this.props.history}
                            receiveMessage={this.props.receiveMessage}
                        />
                    )
                })}
                {/* Modal for adding channels */}
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Add Channel"
                    onRequestClose={this.handleCloseModal}
                    shouldCloseOnOverlayClick={true}
                    className="add-channel-modal"
                    overlayClassName="add-channel-popover"
                >
                    <div className="add-channel-header">
                        <div className="format-channel-header">
                            <h1>Create a channel</h1>
                        </div>
                    </div>
                    <div className="add-channel-content">
                        <div className="add-channel-description">
                            Channels are the battlegrounds for discussions and arguments.
                            They're best when organized around a topic — #ramen, for example.
                        </div>
                        <br></br>
                        <div className="content-section" style={{width: '100%'}}>
                            <AddChannelForm 
                                createChannel={this.props.createChannel}
                                createMembership={this.props.createMembership}
                                userId={this.props.userId}
                                history={this.props.history}
                                handleCloseModal={this.handleCloseModal}
                                channels={Object.values(this.props.channels).map(x => x.channel_name.toLowerCase())}
                            /> 
                        </div>
                    </div>
                </ReactModal>

                {/* Modal for viewing all channels */}
                <ReactModal
                    isOpen={this.state.showChannels}
                    contentLabel="Browse channels"
                    onRequestClose={this.handleCloseChannel}
                    shouldCloseOnOverlayClick={true}
                    className="all-channels-content"
                    overlayClassName="all-channels-overlay"
                >
                    <button className="all-channels-close-btn" onClick={this.handleCloseChannels}>
                        <i className="close-modal-icon"></i>
                        <span style={{marginTop: "-4px", fontSize: "13px", fontFamily: 'Lato-norm'}}>esc</span>
                    </button>
                    <div className="channel-browser-body">
                        <div className="channel-browser-content">
                            <div className="channel-browser-header">
                                <h1>Browse Channels</h1>
                                <button className="medium_btn preview-btn c-button" style={{marginLeft: 'auto', fontFamily: 'Lato'}} onClick={this.handleOpenModal}>
                                    Create Channel
                                </button>
                            </div>
                            <div style={{marginBottom: '8px'}}>
                                <div className="filter-input" style={{marginBottom: '8px'}}>
                                    <i className="all-icons search-icon" style={{top: '1px', position: 'relative'}}></i>
                                    <input className="channel-search-input" type="text" placeholder="Search channels" onChange={this.handleChange} value={this.state.value}></input>
                                    {this.state.value && <div className="reset-input-icon">
                                        <i className="all-icons reset-btn" onClick={() => this.setState({value: ''})}></i>
                                    </div>}
                                </div>
                            </div>
                            <div className="channel-browser-list-container">
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <List
                                            height={height}
                                            width={width}
                                            itemCount={searchChannels.length+1}
                                            itemSize={index => index > 0 ? 68 : 22}
                                            itemData={{ 
                                                channels: searchChannels.sort((a,b) => (a.channel_name.toLowerCase() < b.channel_name.toLowerCase()) ? -1 : 1),
                                                history: this.props.history,
                                                handleClose: this.handleCloseChannels,
                                                memberships: this.props.memberships,
                                                users: this.props.users
                                            }}
                                        >
                                            {Row}
                                        </List>
                                    )}
                                </AutoSizer>
                            </div>
                        </div>
                    </div>
                </ReactModal>
            </div>
        )
    }
}

// helpers
const Row = ({ index, style, data }) => {
    const channel = data.channels[index - 1];
    const creator = channel && channel.user_id ? data.users[channel.user_id].username : 'admin';

    function handleClick() {
        data.handleClose();
        data.history.push(`${data.channels[index-1].id}`);
    }

    function countMembers(channelId) {
        let res = 0;
        for (let membership of data.memberships) {
            if (membership.channel_id === channelId) {
                res += 1;
            }
        }
        return res;
    }

    return (
        <div key={index} style={style} onClick={handleClick}>
            {index === 0 &&
                <div className="channel-browser-section-header">List of all channels</div>
            }
            {index > 0 && 
            <div className="channel-browser-list-item">
                <div className="list-base-entity">
                    <div className="list-primary-content" style={{justifyContent: 'center'}}>
                        <span className="entity-name">
                            {`# ${channel.channel_name}`}
                        </span>
                        <span className="channel_metadata">
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <span className="list_item_info">
                                    created by <strong>{creator}</strong> on <Moment format="MMMM Do, YYYY">{channel.created_at}</Moment>
                                </span>
                            </div>
                        </span>
                    </div>
                    <div className="list-secondary">
                        <button className="preview-channel common-btn">
                            <i className="inline-icon all-icons enter-icon"></i>
                        </button>
                        <div className="list-member-count">
                            <i className="all-icons user-icon browse-user-icon"></i>
                                <span style={{marginLeft: "4px"}}>{countMembers(data.channels[index-1].id)}</span>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}
//---------

class AddChannelForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        $.when(this.props.createChannel({channel_name: this.state.value, user_id: this.props.userId})).then(r => {
            this.props.createMembership({user_id: this.props.userId, channel_id: r.channel.id})
                .then(res => {
                    this.props.handleCloseModal()
                    this.props.history.push(`${res.membership.channel_id}`)
                }), e => {
                    console.log(e);
                };
        }), err => {
            console.log(err)
        };
    }

    validChannelName(name) {
        return /^[0-9A-Za-z]+[0-9A-Za-z-_]*$/g.test(name);
    }

    channelExists(name) {
        return this.props.channels.includes(name.toLowerCase());
    }

    render() {
        const channelExists = this.channelExists(this.state.value);
        let btnClass = this.state.value.length === 0 || (!this.validChannelName(this.state.value) || channelExists) ? "btn-disabled" : "btn-enabled";
        return (
            <form>
                <label>
                    <span style={{marginRight: '8px'}}><strong>Name</strong></span>
                    {
                        this.state.value && !this.validChannelName(this.state.value) &&
                        <span style={{ fontWeight: '700', color: '#e8912d', display: 'inline-block'}}>
                            Channel names can’t contain spaces, periods, or most punctuation. Try again?
                        </span>
                    }
                    {
                        this.state.value && channelExists &&
                        <span style={{ fontWeight: '700', color: '#e8912d', display: 'inline-block'}}>
                            Channel #{this.state.value} already exists. Try again?
                        </span>
                    }
                </label>
                <div className="channel-name-input">
                    <div className="add-channel">
                        <input type="text" className="add-channel-input" minLength="3" maxLength="42" placeholder="# e.g. Kpop" onChange={this.handleChange} />
                        <div className="count-chars-remaining">{42 - this.state.value.length}</div>
                    </div>
                </div>
                <div className="create-channel-footer">
                    <button className={btnClass} onClick={this.handleSubmit}>Create</button>
                </div>
            </form> 
        )
    }
}

// Connect component to Redux store
const mapStateToProps = (state, ownProps) => ({
        activeChannel: {id: parseInt(ownProps.match.params.channelId)},
        channels: state.entities.channels,
        users: state.entities.users,
        userId: state.session.id,
        memberships: Object.values(state.entities.memberships),
});

const mapDispatchToProps = dispatch => ({
    createChannel: channel => dispatch(createNewChannel(channel)),
    createMembership: membership => dispatch(createNewMembership(membership)),
    deleteMembership: membership => dispatch(deleteMembership(membership)),
    receiveMessage: message => dispatch(receiveMessage(message)),
});

const ChannelsList = withRouter(connect(mapStateToProps, mapDispatchToProps)(ConnectedChannelsList));
export default ChannelsList;