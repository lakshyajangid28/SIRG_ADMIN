import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { backend_url } from "../../util/util";

const Teaching = () => {
  const [teachingList, setTeachingList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    subject: "",
    type: "",
    semester: "",
    time: "",
    course_instructor: "",
    credits: "",
    course_code: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTeachingData();
  }, []);

  const fetchTeachingData = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/api/teaching/get-all-teaching`
      );
      setTeachingList(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch teaching data", "error");
    }
  };

  const handleInputChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const openModal = (course = null) => {
    setSelectedCourse(course);
    setNewCourse(
      course || {
        subject: "",
        type: "",
        semester: "",
        time: "",
        course_instructor: "",
        credits: "",
        course_code: "",
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleAddCourse = async () => {
    try {
      await axios.post(`${backend_url}/api/teaching/add-teaching`, newCourse);
      fetchTeachingData();
      closeModal();
      Swal.fire("Success", "Course added successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add course", "error");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      await axios.put(
        `${backend_url}/api/teaching/edit-teaching/${selectedCourse.id}`,
        newCourse
      );
      fetchTeachingData();
      closeModal();
      Swal.fire("Success", "Course updated successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update course", "error");
    }
  };

  const handleDeleteCourse = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${backend_url}/api/teaching/delete-teaching/${id}`
          );
          fetchTeachingData();
          Swal.fire("Deleted!", "The course has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", "Failed to delete course", "error");
        }
      }
    });
  };

  return (
    <div className="box" id="teaching">
      <h2 className="ui top attached inverted header">Teaching</h2>
      <div className="ui padded text segment" id="content-box">
        {teachingList.map((ele) => (
          <div className="ui styled fluid accordion" key={ele.id}>
            <div
              className="title ui medium header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{ele.subject}</span>
              <div>
                <button
                  className="ui button blue"
                  onClick={() => openModal(ele)}
                >
                  Edit
                </button>
                <button
                  className="ui button red"
                  onClick={() => handleDeleteCourse(ele.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="content">
              <ul>
                <li>{ele.type}</li>
                <li>{ele.semester} Semester</li>
                <li>{ele.time}</li>
                <li>Instructor: {ele.course_instructor}</li>
                <li>Credits: {ele.credits}</li>
                <li>Course Code: {ele.course_code}</li>
              </ul>
            </div>
          </div>
        ))}
        <br />
        <div className="actions">
          <button className="ui button blue" onClick={() => openModal()}>
            Add New Course
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="content">
              <h3 className="ui header">
                {selectedCourse ? "Edit Course" : "Add New Course"}
              </h3>
              <div className="field">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={newCourse.subject}
                  onChange={handleInputChange}
                  placeholder="Enter Subject"
                />
              </div>
              <div className="field">
                <label>Type</label>
                <input
                  type="text"
                  name="type"
                  value={newCourse.type}
                  onChange={handleInputChange}
                  placeholder="Enter Type"
                />
              </div>
              <div className="field">
                <label>Semester</label>
                <input
                  type="text"
                  name="semester"
                  value={newCourse.semester}
                  onChange={handleInputChange}
                  placeholder="Enter Semester"
                />
              </div>
              <div className="field">
                <label>Time</label>
                <input
                  type="text"
                  name="time"
                  value={newCourse.time}
                  onChange={handleInputChange}
                  placeholder="Enter Time"
                />
              </div>
              <div className="field">
                <label>Course Instructor</label>
                <input
                  type="text"
                  name="course_instructor"
                  value={newCourse.course_instructor}
                  onChange={handleInputChange}
                  placeholder="Enter Course Instructor"
                />
              </div>
              <div className="field">
                <label>Credits</label>
                <input
                  type="text"
                  name="credits"
                  value={newCourse.credits}
                  onChange={handleInputChange}
                  placeholder="Enter Credits"
                />
              </div>
              <div className="field">
                <label>Course Code</label>
                <input
                  type="text"
                  name="course_code"
                  value={newCourse.course_code}
                  onChange={handleInputChange}
                  placeholder="Enter Course Code"
                />
              </div>
              <div className="actions">
                <button
                  className="ui button blue"
                  onClick={
                    selectedCourse ? handleUpdateCourse : handleAddCourse
                  }
                >
                  {selectedCourse ? "Update Course" : "Add Course"}
                </button>
                <button className="ui button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teaching;
