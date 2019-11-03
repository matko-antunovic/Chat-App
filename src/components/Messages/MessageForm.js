import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import uuidv4 from "uuid/v4";
import firebase from "../../firebase";
import FileModal from "./FileModal";

class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    modal: false,
    uploadState: "",
    uploadTask: null,
    storageRef: firebase.storage().ref(),
    percentUploaded: 0
  };

  handleModal = () => this.setState({ modal: !this.state.modal });

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, loading, channel, errors } = this.state;
    if (message) {
      this.setState({ loading: !loading });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: !loading, message: "", errors: [] });
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: !loading,
            errors: errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: errors.concat({ message: "Add a message" })
      });
    }
  };

  createMessage = (fileUrl=null) => {
   
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    if(fileUrl !== null){
        message["image"]=fileUrl;
    }else{
        message["content"]=this.state.message
    }
    return message;
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;
    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
      },
      () => {    
    
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          err => {
            console.log(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then(downloadUrl => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch(err => {
                console.log(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage=(fileUrl,ref,pathToUpload)=>{
      ref.child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(()=>{
          this.setState({uploadState:"done"})
      })
      .catch(err=>{
          console.log(err)
          this.setState({
              errors:this.state.errors.concat(err)
          })
      })
  }

  render() {
    return (
      <Segment className="message__form">
        <Input
          fluid
          value={this.state.message}
          name="message"
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
          className={
            this.state.errors.some(err => err.includes("message"))
              ? "error"
              : null
          }
        />
        <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            onClick={this.handleModal}
          />
          <FileModal
            modal={this.state.modal}
            closeModal={this.handleModal}
            uploadFile={this.uploadFile}
          />
        </Button.Group>
      </Segment>
    );
  }
}
export default MessageForm;
