import React from "react";
import MessagesHeader from "./MessagesHeader"
import MessageForm from "./MessageForm"
import Message from "./Message"
import {Segment,Comment} from "semantic-ui-react"
import firebase from "../../firebase"

class Messages extends React.Component {

  state={
    messagesRef:firebase.database().ref("messages"),
    channel:this.props.currentChannel,
    user:this.props.currentUser,
    messagesLoading:true,
    messages:[]
  }

  componentDidMount(){
     const {channel,user} =this.state;

     if(channel && user){
       this.addListeners(channel.id)
     }
  }


  addListeners=channelId=>{
    this.addMessageListener(channelId)
  }

  addMessageListener=channelId=>{
    let loadedMessages=[];
    this.state.messagesRef.child(channelId).on("child_added", snap=>{
      loadedMessages.push(snap.val())
     this.setState({
       messages:loadedMessages,
       messagesLoading:false
     })
    })
  }

  displayMessages=messages=>{
    
   return messages.length>0 && messages.map(message=>(
      <Message
      key={message.timestamp}
      message={message}
      user={this.state.user}
      />
    ))
  }

  render() {  
    const {messagesRef,channel,messages}=this.state;

    return (
      <React.Fragment>
        <MessagesHeader/>
        <Segment>
          <Comment.Group className="messages">
            {messages && this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
        messagesRef={messagesRef}
        currentChannel={channel}
        currentUser={this.props.currentUser} 
        /> 
      </React.Fragment>
    );
  }
}

export default Messages;
