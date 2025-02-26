import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { research, backend_url } from "../../util/util";
import Card from "../../components/Card/Card";
import Swal from "sweetalert2";
import axios from "axios";
import "./ResearchPage.css";

const AdminResearchPage = ({ setCurrentPage }) => {
  const { id } = useParams();
  const [currentResearch, setCurrentResearch] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPeople, setCurrentPeople] = useState(null);
  const navigate = useNavigate();

  const [newResearch, setNewResearch] = useState({
    name: "",
    overview: "",
    key_objectives: "",
  });

  const [researchPeople, setResearchPeople] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: "", role: "" });

  useEffect(() => {
    const researchItem = research.find((item) => item.id === parseInt(id));
    if (researchItem) {
      setCurrentResearch(researchItem);
      setNewResearch({
        name: researchItem.name,
        overview: researchItem.overview,
        key_objectives: researchItem.key_objectives,
      });
    }
    fetchResearchPeople();
  }, [id]);

  const fetchResearchPeople = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/research-verticals/research-people/${id}`);
      setResearchPeople(response.data);
    } catch (error) {
      console.error("Error fetching research people", error);
    }
  };

  const handleChange = (e) => {
    setNewResearch({ ...newResearch, [e.target.name]: e.target.value });
  };

  const handlePersonChange = (e) => {
    setNewPerson({ ...newPerson, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${backend_url}/api/research-verticals/research-verticals/${id}`, newResearch);
      Swal.fire("Success", "Research updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data || "Failed to update research", "error");
    }
  };

  const handleDeleteResearch = async () => {
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
        await axios.delete(`${backend_url}/api/research-verticals/research-verticals/${id}`);
        Swal.fire("Deleted!", "The research has been removed.", "success");
        setCurrentPage("home");
        navigate("/");
      } catch (error) {
        Swal.fire("Error", "Failed to delete research", "error");
      }
    }
  };

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Handle save operation
    const handleSave = async () => {
        const formData = new FormData();
        formData.append("name", newPerson.name);
        formData.append("category", newPerson.category);
        formData.append("description", newPerson.description);
        if (imageFile) {
            formData.append("image", imageFile);
        }
        if (!isEditing && (!imageFile || !newPerson.name || !newPerson.category)) {
            Swal.fire("Error", "All fields are required!", "error");
            return;
        }
        if(isEditing) {
            try {
                await axios.put(`${backend_url}/api/research-verticals/research-people/${currentPeople.id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                Swal.fire("Success", "Person updated successfully!", "success");
                fetchResearchPeople();
                closeModal();
                return;
            } catch (error) {
                Swal.fire("Error", error.response?.data || "Failed to update person", "error");
                return;
            }
        }
        try {
            await axios.post(`${backend_url}/api/research-verticals/research-people/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            Swal.fire("Success", "Person added successfully!", "success");
            fetchResearchPeople();
            closeModal();
        } catch(err) {
            Swal.fire("Error", err.response?.data || "Failed to add person", "error");
            return;
        }
    }

  // Handle delete operation
  const handleDelete = async (research_people_id) => {
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
        await axios.delete(`${backend_url}/api/research-verticals/research-people/${research_people_id}`);
        navigate(`/research/:${id}`);
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
    setCurrentPeople(person);
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
    <div className="research-page">
      <div className="box">
        <h2 className="ui center aligned dividing header">
          <input
            type="text"
            name="name"
            value={newResearch.name}
            onChange={handleChange}
            className="ui input fluid"
            placeholder="Research Name"
          />
        </h2>
      </div>

      <div className="box">
        <h2 className="ui top attached inverted header">Overview</h2>
        <textarea
          name="overview"
          value={newResearch.overview}
          onChange={handleChange}
          className="ui textarea fluid"
          rows="4"
          placeholder="Overview of the research"
        />
      </div>

      <div className="box">
        <h2 className="ui top attached inverted header">Key Objectives</h2>
        <textarea
          name="key_objectives"
          value={newResearch.key_objectives}
          onChange={handleChange}
          className="ui textarea fluid"
          rows="4"
          placeholder="Key Objectives of the research"
        />
      </div>

      {/* Research People Management */}
      <div className="box">
        <h2 className="ui top attached inverted header">Research People</h2>
        <div className="ui padded text segment" id="content-box">
          <div className="ui link cards">
            {researchPeople.length > 0 ? (
              researchPeople.map((person) => (
                <Card
                  key={person.id}
                  person={person}
                  onEdit={() => openModal(person)}
                  onDelete={() => handleDelete(person.id)}
                />
              ))
            ) : (
              <p>No research people found.</p>
            )}
          </div>
          <br />
          <div className="actions">
            <button className="ui button blue" onClick={() => openModal()}>
              Add New Person
            </button>
          </div>
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

      <div className="actions">
        <button className="ui button blue" onClick={handleSaveChanges}>Save Changes</button>
        <button className="ui button red" onClick={handleDeleteResearch}>Delete Research</button>
      </div>
    </div>

  );
};

export default AdminResearchPage;
