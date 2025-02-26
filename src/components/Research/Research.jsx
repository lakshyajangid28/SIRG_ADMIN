import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backend_url, getResearch, research } from "../../util/util";
import Swal from "sweetalert2";
import axios from "axios";

const Research = ({ setCurrentPage }) => {
  const [researchVerticals, setResearchVerticals] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newResearch, setNewResearch] = useState({
    name: "",
    overview: "",
    key_objectives: "",
  });

  useEffect(() => {
    async function fetchData() {
      setResearchVerticals(await getResearch());
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!newResearch.name.trim()) {
      Swal.fire({
        title: "Name is required!",
        icon: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        backend_url + "/api/research-verticals/research-verticals",
        newResearch
      );
      setResearchVerticals([
        ...researchVerticals,
        { id: Date.now(), ...newResearch },
      ]);
      setShowAddPopup(false);
      setNewResearch({ name: "", overview: "", key_objectives: "" });
      Swal.fire({
        title: "Research Vertical Added Successfully!",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data || "Something went wrong!",
        icon: "error",
      });
    }
  };

  return (
    <div className="box" id="research">
      <h2 className="ui top attached inverted header">Research</h2>
      <div className="ui padded text segment" id="content-box">
        {research.map((item, index) => (
          <Link to={`/research/${item.id}`} key={index}>
            <p>
              <i>
                <li onClick={() => setCurrentPage("research")}>{item.name}</li>
              </i>
            </p>
          </Link>
        ))}
        <br />
        <div className="actions">
          <button
            className="ui center floated button primary"
            onClick={() => setShowAddPopup(true)}
          >
            Add New Research
          </button>
        </div>
      </div>

      {showAddPopup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-content">
              <h3>Add New Research Vertical</h3>
              <div className="ui form">
                <div className="field">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newResearch.name}
                    onChange={(e) =>
                      setNewResearch({ ...newResearch, name: e.target.value })
                    }
                    className="ui input"
                  />
                </div>
                <div className="field">
                  <textarea
                    placeholder="Overview"
                    value={newResearch.overview}
                    onChange={(e) =>
                      setNewResearch({
                        ...newResearch,
                        overview: e.target.value,
                      })
                    }
                    className="ui textarea"
                    style={{ minHeight: "80px" }}
                  />
                </div>
                <div className="field">
                  <textarea
                    placeholder="Key Objectives"
                    value={newResearch.key_objectives}
                    onChange={(e) =>
                      setNewResearch({
                        ...newResearch,
                        key_objectives: e.target.value.split("/n").join("#")
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
                  Add Research
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Research;
