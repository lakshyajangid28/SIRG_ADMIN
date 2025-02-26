import React, { useState } from "react";
import {
  backend_url,
  publications as initialPublications,
} from "../../util/util";
import axios from "axios";
import Swal from "sweetalert2";

const Publications = () => {
  const [publications, setPublications] = useState(initialPublications);
  const [newPublication, setNewPublication] = useState({
    id: "",
    type: "",
    body: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddPublication = async () => {
    try {
      const { type, body } = newPublication;
      if (!type || !body) {
        return Swal.fire("Error", "All fields are required!", "error");
      }

      const response = await axios.post(
        `${backend_url}/api/publications/add-publication`,
        newPublication
      );
      setPublications([
        ...publications,
        { id: response.data.id, ...newPublication },
      ]);
      Swal.fire("Success", "Publication added successfully!", "success");
      setNewPublication({ type: "", body: "" });
      setShowPopup(false);
    } catch (error) {
      console.error("Error adding publication:", error);
      Swal.fire("Error", "Failed to add publication", "error");
    }
  };

  const handleUpdatePublication = async () => {
    try {
      const { type, body, id } = newPublication;
      if (!type || !body) {
        return Swal.fire("Error", "All fields are required!", "error");
      }

      await axios.put(
        `${backend_url}/api/publications/edit-publication/${id}`,
        newPublication
      );
      setPublications(
        publications.map((publication) =>
          publication.id === id ? { id, ...newPublication } : publication
        )
      );
      Swal.fire("Success", "Publication updated successfully!", "success");
      setIsEditing(false);
      setNewPublication({ type: "", body: "" });
      setShowPopup(false);
    } catch (error) {
      console.error("Error updating publication:", error);
      Swal.fire("Error", "Failed to update publication", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(
          `${backend_url}/api/publications/delete-publication/${id}`
        );
        setPublications(
          publications.filter((publication) => publication.id !== id)
        );
        Swal.fire("Deleted!", "The publication has been removed.", "success");
      } catch (error) {
        console.error("Error deleting publication:", error);
        Swal.fire("Error", "Failed to delete publication", "error");
      }
    }
  };

  const openPopupForEdit = (publication) => {
    setIsEditing(true);
    setNewPublication({
      id: publication.id,
      type: publication.type,
      body: publication.body,
    });
    setShowPopup(true);
  };

  const openPopupForAdd = () => {
    setIsEditing(false);
    setNewPublication({ id: "", type: "", body: "" });
    setShowPopup(true);
  };

  return (
    <div className="box" id="publications">
      <h2 className="ui top attached inverted header">Publications</h2>
      <div className="ui padded text segment" id="content-box">
        {publications.length === 0 ? (
          <p>No publications available.</p>
        ) : (
          publications.map((ele) => (
            <div key={ele.id} className="publication-item">
              <div className="ui large header">{ele.type}</div>
              <div className="ui buttons">
                <button
                  className="ui button blue"
                  onClick={() => openPopupForEdit(ele)}
                >
                  Edit Publication
                </button>
                <button
                  className="ui button red"
                  onClick={() => handleDelete(ele.id)}
                >
                  Delete Publication
                </button>
              </div>
              <br /><br /><br />
            </div>
          ))
        )}
        <div className="actions">
          <button className="ui button blue" onClick={openPopupForAdd}>
            Add New Publication
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h3>{isEditing ? "Edit Publication" : "Add New Publication"}</h3>
            </div>
            <br />
            <div className="custom-modal-content">
              <div className="ui form">
                <div className="field">
                  <label>Publication Type</label>
                  <input
                    type="text"
                    value={newPublication.type}
                    onChange={(e) =>
                      setNewPublication({
                        ...newPublication,
                        type: e.target.value,
                      })
                    }
                    placeholder="Publication Type"
                  />
                </div>
                <div className="field">
                  <label>Publication Body</label>
                  <textarea
                    value={newPublication.body}
                    onChange={(e) =>
                      setNewPublication({
                        ...newPublication,
                        body: e.target.value,
                      })
                    }
                    placeholder="Publication Body"
                  />
                </div>
              </div>
            </div>
            <br />
            <div className="actions">
              <button className="ui button" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
              <button
                className="ui button blue"
                onClick={
                  isEditing ? handleUpdatePublication : handleAddPublication
                }
              >
                {isEditing ? "Update Publication" : "Add Publication"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publications;
