import React, { useState } from "react";
import { backend_url, project } from "../../util/util";
import Swal from "sweetalert2";
import axios from "axios";

const Project = () => {
  const [projects, setProjects] = useState(project);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newProject, setNewProject] = useState({
    project_type: "",
    project_details: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Handle Save (Add or Edit)
  const handleSave = async () => {
    if (!newProject.project_type.trim() || !newProject.project_details.trim()) {
      Swal.fire({ title: "All fields are required!", icon: "error" });
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          backend_url + `/api/projects/update-project/${editId}`,
          newProject
        );
        setProjects(
          projects.map((proj) =>
            proj.id === editId ? { ...proj, ...newProject } : proj
          )
        );
        Swal.fire({ title: "Project Updated Successfully!", icon: "success" });
      } else {
        await axios.post(backend_url + "/api/projects/add-project", newProject);
        setProjects([...projects, { id: Date.now(), ...newProject }]);
        Swal.fire({ title: "Project Added Successfully!", icon: "success" });
      }
      setShowAddPopup(false);
      setNewProject({ project_type: "", project_details: "" });
      setIsEditing(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data || "Something went wrong!",
        icon: "error",
      });
    }
  };

  // Handle Delete
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
        await axios.delete(`${backend_url}/api/projects/delete-project/${id}`);
        setProjects(projects.filter((project) => project.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "The project has been removed.",
          icon: "success",
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete project",
          icon: "error",
        });
      }
    }
  };

  // Open popup for add or edit
  const openPopup = (project = null) => {
    setIsEditing(!!project);
    setNewProject(
      project ? { ...project } : { project_type: "", project_details: "" }
    );
    setEditId(project?.id || null);
    setShowAddPopup(true);
  };

  return (
    <div className="box" id="project">
      <h2 className="ui top attached inverted header">Projects</h2>
      <div className="ui padded text segment" id="content-box">
        {projects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          projects.map((ele) => (
            <div key={ele.id} className="project-item">
              <div className="ui large header">{ele.project_type}</div>
              <div className="ui buttons">
                <button
                  className="ui button blue"
                  onClick={() => openPopup(ele)}
                >
                  Edit Project
                </button>
                <button
                  className="ui button red"
                  onClick={() => handleDelete(ele.id)}
                >
                  Delete Project
                </button>
              </div>
              <br /><br />
            </div>
          ))
        )}
        <div className="actions">
          <button className="ui button blue" onClick={() => openPopup()}>
            Add New Project
          </button>
        </div>
      </div>

      {showAddPopup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-content">
              <h3>{isEditing ? "Edit Project" : "Add New Project"}</h3>
              <div className="ui form">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Project Type"
                    value={newProject.project_type}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        project_type: e.target.value,
                      })
                    }
                    className="ui input"
                  />
                </div>
                <div className="field">
                  <textarea
                    placeholder="Project Details"
                    value={newProject.project_details}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        project_details: e.target.value.split("/n").join("#"),
                      })
                    }
                    className="ui textarea"
                    style={{ minHeight: "80px" }}
                  />
                </div>
              </div>
              <br />
              <div className="actions">
                <button
                  className="ui button"
                  onClick={() => setShowAddPopup(false)}
                >
                  Cancel
                </button>
                <button className="ui button blue" onClick={handleSave}>
                  {isEditing ? "Update Project" : "Add Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
