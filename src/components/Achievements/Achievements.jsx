import React, { useState, useEffect } from "react";
import FlipCard from "../FlipCard/FlipCard";
import axios from "axios";
import Swal from "sweetalert2";
import { backend_url } from "../../util/util";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ body: "", image: null });
  const [imageFile, setImageFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/api/achievements/get-achievements`);
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      Swal.fire("Error", "Failed to fetch achievements", "error");
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!newAchievement.body.trim() || (!imageFile && !isEditing)) {
      Swal.fire("Error", "Body and Image are required!", "error");
      return;
    }

    const formData = new FormData();
    formData.append("body", newAchievement.body.trim());
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEditing) {
        await axios.put(`${backend_url}/api/achievements/edit-achievement/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Achievement updated successfully!", "success");
      } else {
        await axios.post(`${backend_url}/api/achievements/add-achievement`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Success", "Achievement added successfully!", "success");
      }

      fetchAchievements();
      closeModal();
    } catch (error) {
      console.error("Error saving achievement:", error);
      Swal.fire("Error", "Failed to save achievement", "error");
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
        await axios.delete(`${backend_url}/api/achievements/delete-achievement/${id}`);
        setAchievements(achievements.filter((ach) => ach.id !== id));
        Swal.fire("Deleted!", "Achievement has been removed.", "success");
      } catch (error) {
        console.error("Error deleting achievement:", error);
        Swal.fire("Error", "Failed to delete achievement", "error");
      }
    }
  };

  const openModal = (achievement = null) => {
    setIsEditing(!!achievement);
    setEditId(achievement ? achievement.id : null);
    setNewAchievement(achievement || { body: "", image: null });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setNewAchievement({ body: "", image: null });
    setImageFile(null);
    setIsEditing(false);
    setIsModalOpen(false);
  };

  return (
    <div className="box" id="achievements">
      <h2 className="ui top attached inverted header">Achievements</h2>
      <div className="ui padded text segment" id="content-box">
        <div className="ui cards flip-cards">
          {achievements.map((ele) => (
            <div key={ele.id} className="achievement-admin-card">
              <FlipCard achievement={ele} />
              <div className="extra content">
                <button className="ui button blue" onClick={() => openModal(ele)}>Edit</button>
                <button className="ui button red" onClick={() => handleDelete(ele.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <br />
        <div className="actions">
          <button className="ui button blue" onClick={() => openModal()}>Add Achievement</button>
        </div>
      </div>
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>{isEditing ? "Edit Achievement" : "Add New Achievement"}</h3>
            <div className="content">
              <div className="ui form">
                <div className="field">
                  <textarea
                    placeholder="Enter achievement details"
                    value={newAchievement.body}
                    onChange={(e) => setNewAchievement({ ...newAchievement, body: e.target.value })}
                  />
                </div>
                <div className="field">
                  <input type="file" onChange={handleImageChange} />
                </div>
              </div>
            </div>
            <br />
            <div className="actions">
              <button className="ui button blue" onClick={handleSave}>
                {isEditing ? "Edit Achievement" : "Add Achievement"}
              </button>
              <button className="ui button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;
