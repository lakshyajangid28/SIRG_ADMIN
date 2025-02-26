import React, { useState, useEffect } from "react";
import { about as initialAbout, backend_url } from "../../util/util";
import Swal from "sweetalert2";
import axios from "axios";

const AdminAbout = () => {
  const [about, setAbout] = useState(initialAbout);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editedAbout, setEditedAbout] = useState(initialAbout);

  useEffect(() => {
    setEditedAbout(about);
  }, [showEditPopup]);

  const handleSave = async () => {
    try {
      const response = await axios.post(
        backend_url + "/api/about/edit-about-body",
        { body: editedAbout }
      );
      setAbout(editedAbout);
      setShowEditPopup(false);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating About section:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Something went wrong!",
      });
    }
  };

  return (
    <div className="box" id="about">
      <h2 className="ui top attached inverted header">About</h2>
      <div className="ui padded text segment" id="content-box">
        <p>{about}</p>
        <div className="actions">
          <button
            className="ui button primary"
            onClick={() => setShowEditPopup(true)}
          >
            Edit About Section
          </button>
        </div>
      </div>

      {showEditPopup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-content">
              <div className="ui header">Edit About Section</div>
              <div className="content">
                <textarea
                  value={editedAbout}
                  onChange={(e) => setEditedAbout(e.target.value)}
                  className="ui textarea"
                  style={{ width: "100%", minHeight: "150px" }}
                />
              </div>
              <br />
              <div className="actions">
                <button
                  className="ui button"
                  onClick={() => setShowEditPopup(false)}
                >
                  Cancel
                </button>
                <button className="ui button blue" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
