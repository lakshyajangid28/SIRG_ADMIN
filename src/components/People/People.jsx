import React, { useState, useEffect } from "react";
import Card from "../Card/Card";
import axios from "axios";
import Swal from "sweetalert2";
import { backend_url } from "../../util/util";

const People = () => {
  const [people, setPeople] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [newPerson, setNewPerson] = useState({
    id: "",
    name: "",
    category: "",
    image: null,
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all people on component mount
  useEffect(() => {
    fetchPeople();
  }, []);

  // Fetch people from backend
  const fetchPeople = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/people/get-people`);
      setPeople(response.data);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  // Separate faculty and students whenever people state changes
  useEffect(() => {
    const facultyMembers = people.filter(
      (person) => person.category.toLowerCase() === "faculty"
    );
    const studentMembers = people.filter(
      (person) => person.category.toLowerCase() === "researcher"
    );
    setFaculty(facultyMembers);
    setStudents(studentMembers);
  }, [people]);

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle form submission (Add or Edit)
  const handleSave = async () => {
    const { id, name, category, description } = newPerson;

    // Validate inputs
    if (!name || !category || (!imageFile && !isEditing)) {
      Swal.fire("Error", "Name, Category, and Image are required!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEditing) {
        // Edit Operation
        await axios.put(
          `${backend_url}/api/people/update-person/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire("Success", "Person updated successfully!", "success");
      } else {
        // Add Operation
        await axios.post(`${backend_url}/api/people/add-person`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire("Success", "Person added successfully!", "success");
      }

      // Reset form and state
      closeModal();
      fetchPeople();
    } catch (error) {
      console.error("Error saving person:", error);
      Swal.fire("Error", "Failed to save person", "error");
    }
  };

  // Handle delete operation
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
        await axios.delete(`${backend_url}/api/people/delete-person/${id}`);
        setPeople(people.filter((p) => p.id !== id));
        Swal.fire("Deleted!", "The person has been removed.", "success");
      } catch (error) {
        console.error("Error deleting person:", error);
        Swal.fire("Error", "Failed to delete person", "error");
      }
    }
  };

  // Open modal for adding or editing
  const openModal = (person = null) => {
    setIsEditing(!!person);
    setNewPerson(
      person || {
        id: "",
        name: "",
        category: "",
        image: null,
        description: "",
      }
    );
    setIsModalOpen(true);
  };

  // Close the modal and reset state
  const closeModal = () => {
    setNewPerson({
      id: "",
      name: "",
      category: "",
      image: null,
      description: "",
    });
    setImageFile(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  return (
    <div className="box" id="people">
      <h2 className="ui top attached inverted header">People</h2>
      <div className="ui padded text segment" id="content-box">
        {/* Faculty Section */}
        <div className="ui large header">Faculty</div>
        <hr />
        <br />
        <div className="faculty">
          <div className="ui link cards">
            {faculty.length > 0 ? (
              faculty.map((person) => (
                <Card
                  key={person.id}
                  person={person}
                  onEdit={() => openModal(person)}
                  onDelete={() => handleDelete(person.id)}
                />
              ))
            ) : (
              <p>No faculty members found.</p>
            )}
          </div>
        </div>
        <br />

        {/* Student Section */}
        <div className="ui large header">Researcher</div>
        <hr />
        <br />
        <div className="students">
          <div className="ui link cards">
            {students.length > 0 ? (
              students.map((person) => (
                <Card
                  key={person.id}
                  person={person}
                  onEdit={() => openModal(person)}
                  onDelete={() => handleDelete(person.id)}
                />
              ))
            ) : (
              <p>No researchers found.</p>
            )}
          </div>
        </div>
        <br />
        <div className="actions">
          <button className="ui button blue" onClick={() => openModal()}>
            Add New Person
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>{isEditing ? "Edit Person" : "Add New Person"}</h3>
            <div className="content">
              <div className="ui form">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newPerson.name}
                    onChange={(e) =>
                      setNewPerson({ ...newPerson, name: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <select
                    value={newPerson.category}
                    onChange={(e) =>
                      setNewPerson({ ...newPerson, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    <option value="faculty">Faculty</option>
                    <option value="researcher">Researcher</option>
                  </select>
                </div>
                <div className="field">
                  <input type="file" onChange={handleImageChange} />
                </div>
                <div className="field">
                  <textarea
                    placeholder="Description"
                    value={newPerson.description}
                    onChange={(e) =>
                      setNewPerson({
                        ...newPerson,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <br />
            <div className="actions">
              <button className="ui button blue" onClick={handleSave}>
                {isEditing ? "Edit Person" : "Add New Person"}
              </button>
              <button className="ui button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default People;