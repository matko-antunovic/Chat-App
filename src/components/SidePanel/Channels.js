import React from "react";
import { Menu, Icon , Modal, Form, Input, Button} from "semantic-ui-react";
import firebase from "../../firebase"

class Channels extends React.Component {
  state = {
    user:this.props.currentUser,
    channels: [],
    channelName:"",
    channelDetails:"",
    channelsRef:firebase.database().ref("channels"),
    modal:false
  };


  modalHandler=()=>this.setState({modal:!this.state.modal})

  handleChange=event=>{
    this.setState({[event.target.name]:event.target.value})
  }

  addChannel=()=>{
    const{channelsRef,channelName,channelDetails,user}=this.state;

    const key=channelsRef.push().key;

    const newChannel={
      id:key,
      name:channelName,
      details:channelDetails,
      createdBy:{
        name:user.displayName,
        avatar:user.photoURL
      }
    }

    channelsRef.child(key).update(newChannel).then(()=>{
      this.setState({channelName:"",channelDetails:""});
      this.modalHandler();
    })
    .catch(e=>console.log(e))

  }

  handleSubmit=event=>{
    event.preventDefault();
    if(this.isFormValid(this.state)){
     this.addChannel();
    }
  }

  isFormValid=({channelName,channelDetails})=>channelName && channelDetails;

  render() {
    const { channels , modal} = this.state;

    return (
      <React.Fragment>
      <Menu.Menu style={{ paddingBottom: "2em" }}>
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{" "}
          ({channels.length}) <Icon name="add" onClick={this.modalHandler} />
        </Menu.Item>
        {/* Channels */}
      </Menu.Menu>

      <Modal basic open={modal} onClose={this.modalHandler}>
        <Modal.Header>Add a Channel</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Input
              fluid
              label="Name of Channel"
              name="channelName"
              onChange={this.handleChange}
              />
                <Input
              fluid
              label="Details about Channel"
              name="channelDetails"
              onChange={this.handleChange}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.handleSubmit}><Icon name="checkmark"/> Add</Button>
          <Button color="red" inverted onClick={this.modalHandler}><Icon name="remove"/> Cancel</Button>
        </Modal.Actions>
      </Modal>
      </React.Fragment>
    );
  }
}

export default Channels;
