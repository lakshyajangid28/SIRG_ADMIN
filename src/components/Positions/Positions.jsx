import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { backend_url } from "../../util/util";

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [newPosition, setNewPosition] = useState({
    vacancy_name: "",
    title: "",
    contact_person: "",
  });
  const [editing, setEditing] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);

  const fetchPositions = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/api/open-positions/get-all-open-positions`
      );
      setPositions(response.data);
    } catch (error) {
      console.error("Error fetching positions:", error);
      Swal.fire("Error", "Failed to fetch positions", "error");
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleAddPosition = async () => {
    try {
      const { vacancy_name, title, contact_person } = newPosition;

      if (!vacancy_name || !title || !contact_person) {
        return Swal.fire("Error", "All fields are required!", "error");
      }

      await axios.post(
        `${backend_url}/api/open-positions/add-open-position`,
        newPosition
      );
      Swal.fire("Success", "Position added successfully!", "success");
      setNewPosition({ vacancy_name: "", title: "", contact_person: "" });
      setShowAddPopup(false);
      fetchPositions(); // Update the list
    } catch (error) {
      console.error("Error adding position:", error);
      Swal.fire("Error", "Failed to add position", "error");
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
          `${backend_url}/api/open-positions/delete-open-position/${id}`
        );
        setPositions(positions.filter((pos) => pos.id !== id)); // Remove from state
        Swal.fire("Deleted!", "The position has been removed.", "success");
      } catch (error) {
        console.error("Error deleting position:", error);
        Swal.fire("Error", "Failed to delete position", "error");
      }
    }
  };

  const handleUpdatePosition = async () => {
    if (!editing) return;

    try {
      const { vacancy_name, title, contact_person } = newPosition;

      if (!vacancy_name || !title || !contact_person) {
        return Swal.fire("Error", "All fields are required!", "error");
      }

      await axios.put(
        `${backend_url}/api/open-positions/edit-open-position/${editing.id}`,
        newPosition
      );
      Swal.fire("Success", "Position updated successfully!", "success");
      setEditing(null);
      setNewPosition({ vacancy_name: "", title: "", contact_person: "" });
      setShowAddPopup(false);
      fetchPositions(); // Update list
    } catch (error) {
      console.error("Error updating position:", error);
      Swal.fire("Error", "Failed to update position", "error");
    }
  };

  return (
    <div className="box" id="positions">
      <h2 className="ui top attached inverted header">Positions</h2>
      <table className="ui table" id="content-box">
        <thead>
          <tr>
            <th>Vacancy Name</th>
            <th>Title</th>
            <th>Contact Person</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((ele) => (
            <tr key={ele.id}>
              <td data-label="name">{ele.vacancy_name}</td>
              <td data-label="title">{ele.title}</td>
              <td data-label="contact">{ele.contact_person}</td>
              <td>
                <button
                  className="ui button blue"
                  onClick={() => {
                    setEditing(ele);
                    setNewPosition({
                      vacancy_name: ele.vacancy_name,
                      title: ele.title,
                      contact_person: ele.contact_person,
                    });
                    setShowAddPopup(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="ui button red"
                  onClick={() => handleDelete(ele.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <div className="actions">
        <button
          className="ui button blue"
          onClick={() => setShowAddPopup(true)}
        >
          Add New Position
        </button>
      </div>

      {showAddPopup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="ui header">
              {editing ? "Edit Position" : "Add New Position"}
            </div>
            <div className="content">
              <div className="ui form">
                <div className="field">
                  <label>Vacancy Name</label>
                  <input
                    type="text"
                    value={newPosition.vacancy_name}
                    onChange={(e) =>
                      setNewPosition({
                        ...newPosition,
                        vacancy_name: e.target.value,
                      })
                    }
                    placeholder="Vacancy Name"
                  />
                </div>
                <div className="field">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newPosition.title}
                    onChange={(e) =>
                      setNewPosition({ ...newPosition, title: e.target.value })
                    }
                    placeholder="Title"
                  />
                </div>
                <div className="field">
                  <label>Contact Person</label>
                  <input
                    type="text"
                    value={newPosition.contact_person}
                    onChange={(e) =>
                      setNewPosition({
                        ...newPosition,
                        contact_person: e.target.value,
                      })
                    }
                    placeholder="Contact Person"
                  />
                </div>
              </div>
              <br />
              <div className="actions">
                <button
                  className="ui button"
                  onClick={() => {
                    setShowAddPopup(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </button>
                {editing ? (
                  <button
                    className="ui button blue"
                    onClick={handleUpdatePosition}
                  >
                    Update Position
                  </button>
                ) : (
                  <button
                    className="ui button blue"
                    onClick={handleAddPosition}
                  >
                    Add Position
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;
