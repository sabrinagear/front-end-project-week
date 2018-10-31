import React, { Component } from "react";
import axios from "axios";
import Modal from "react-responsive-modal";
import PropTypes from "prop-types";

//NoteView is the class that displays a single note. This class deploys the editNote() and deleteNote() functions, which live in the App.js file

class NoteView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      open: false
    };
  }

  //Mounts fetched note from fetch() function to state
  componentDidMount() {
    window.scrollTo(0, 0);
    const id = this.props.match.params.id;
    console.log(id);
    this.fetch(id);
  }

  //Fetches an individual note by id and sets its values to state of this component.
  fetch = id => {
    axios
      .get(`https://fe-notes.herokuapp.com/note/get/${id}`)
      .then(res => {
        console.log("noteview", res);
        this.setState(() => ({
          id: res.data._id,
          title: res.data.title,
          textBody: res.data.textBody
        }));
      })
      .catch(err => {
        console.dir(err);
      });
  };

  /****** Edit Handling Functions *******/

  //Toggles the edit form
  toggleEdit = e => {
    e.preventDefault();
    this.setState({ editing: true });
  };

  //Validates form input and then triggers edit() function
  editSubmitHandler = e => {
    e.preventDefault();
    if (this.state.title.length < 1 || this.state.textBody.length < 1) {
      alert("Field cannot be empty!");
    } else {
      this.props.editNote({
        id: this.state.id,
        title: this.state.title,
        textBody: this.state.textBody
      });
      this.setState({
        editing: false
      });
    }
  };

  //Change Handler
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  /****** Delete Handling Functions *******/

  //Opens delete modal
  openModal = () => {
    this.setState({ open: true });
  };

  //Closes delete modal
  closeModal = () => {
    this.setState({ open: false });
  };

  //Triggers the delete function and renders the main page view
  delete = e => {
    e.preventDefault();
    this.props.deleteNote(this.state.id);
    this.props.history.push("/");
  };

  render() {
    const { open, title, textBody } = this.state;

    if (this.state.editing) {
      return (
        <div className="edit-form">
          <h1>Edit Note:</h1>
          <form onSubmit={this.editSubmitHandler}>
            <input
              name="title"
              type="text"
              placeholder="new title"
              value={title}
              onChange={this.handleChange}
            />
            <input
              name="textBody"
              type="text"
              placeholder="new note"
              value={textBody}
              onChange={this.handleChange}
            />
            <button type="submit">Update</button>
          </form>
        </div>
      );
    }

    return (
      <div className="note-view">
        <div className="note-header">
          <div className="note-buttons">
            <button className="edit-button" onClick={this.toggleEdit}>
              edit
            </button>

            <button className="delete-button" onClick={this.openModal}>
              delete
            </button>
          </div>
          <div className="note-title">{this.state.title}</div>
        </div>
        <div className="note-body">
          <p>{this.state.textBody}</p>
        </div>

        <Modal open={open} onClose={this.closeModal} center>
          <h2>Are you sure you want to delete this?</h2>

          <button className="modal-delete" onClick={this.delete}>
            Delete
          </button>
          <button onClick={this.closeModal} className="modal-no">
            No
          </button>
        </Modal>
      </div>
    );
  }
}

//Type validation for props
NoteView.propTypes = {
  id: PropTypes.string,
  editNote: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired
};

export default NoteView;
