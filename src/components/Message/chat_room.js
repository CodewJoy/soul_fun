import React, { Component } from 'react';

class ChatRoom extends Component {
    render() {
        return (
            <div className="talks">
                {this.props.chat.map((item, index) => {
                    if (item.sender === "admin") {
                        return (
                            <div className="adm-dialog" key={index}>
                                <p>{item.content}</p>
                                <div>{Date(item.timestamp).substring(0, 24)}</div>
                            </div>
                        )
                    } else if (item.sender === this.props.currentRoom.friendID) {
                        return (
                            <div className="fri-dialog" key={index}>
                                <div>{item.content}</div>
                            </div>
                        )
                    } else {
                        return (
                            <div className="my-dialog" key={index}>
                                <div>{item.content}</div>
                            </div>
                        )
                    }
                }
                )}
            </div>
        )
    }
}

export default ChatRoom;