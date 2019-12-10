import React from "react";
import PrimaryFooter from './primary_footer'
import Moment from 'react-moment'
import validator from 'validator'

class PrimaryView extends React.Component {
    constructor(props) {
        super(props);
        this.msgEndRef = React.createRef();
    };

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.msgEndRef.current.scrollTop = this.msgEndRef.current.scrollHeight;
    }

    render() {
        let channelMsgs = Object.values(this.props.messages).filter(msg => {
            return msg.channel_id === this.props.activeChannel.id;
        })
        return (
            <div className="workspace-primary">
                <div className="primary-contents">
                    <div className="primary-body">
                        <div className="msg-pane" ref={this.msgEndRef}>
                            <div className="msg-forward" style={{top: "0px"}}>
                                <h1 className="forward-channel-name">
                                    <span>{`#${this.props.channels[this.props.activeChannel.id].channel_name}`}</span>
                                </h1>
                                <p className="forward-description">
                                    This is the very beginning of the <strong>#{this.props.channels[this.props.activeChannel.id].channel_name}</strong> channel.
                                    Please stay on topic!
                                </p>
                            </div>
                            {channelMsgs.map((message, i) => {
                                return (
                                    <Message
                                        key={message.id} 
                                        body={message.body} 
                                        user={this.props.users[message.user_id]} 
                                        timestamp={message.created_at}
                                        lastMsg={i === channelMsgs.length - 1}
                                    />
                                )
                            })}
                    </div>
                        </div>
                    <PrimaryFooter
                        currentUser={this.props.currentUser}
                        channelId={this.props.activeChannel.id}
                        activeChannelName={this.props.channels[this.props.activeChannel.id].channel_name} 
                        createMessage={this.props.createMessage}
                    />
                </div>
            </div>
        )
    }
}

const Message = props => {
    const mediaExt = 'jpg png gif'.split(' ');
    let msgBody = props.body;
    let className = "msg-list-item";
    if (props.lastMsg) className = className.concat(' last-msg');
    if (validator.isURL(props.body)) {
        let urlParts = props.body.split('.');
        let ext = urlParts[urlParts.length - 1];
        if (mediaExt.includes(ext)) {
            msgBody = (
                <img src={props.body} style={{maxHeight: "360px", maxWidth: "360px"}}></img>
            );
        }
    }

    return (
        <div className={className}>
            <div className="msg-avatar">
                <button className="msg-avatar-btn">
                    <img className="avatar-img" src="https://ca.slack-edge.com/T03GU501J-UBVJX8CB1-g59c98ec02a0-48" />
                </button>
            </div>
            <div className="msg-contents">
                <div className="sender-header">
                    <span className="msg-sender">{props.user.username}</span>
                    <span> </span>
                    <span className="timestamp"><Moment format="LT">{props.timestamp}</Moment></span>
                </div>
                <span className="msg-body">{msgBody}</span>
            </div>
        </div>
    )
}

export default PrimaryView;