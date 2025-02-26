import React, { useState, useEffect } from "react";
import { backend_url } from "../../util/util";
import axios from "axios";
import Swal from "sweetalert2";

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newContact, setNewContact] = useState({ type: "", value: "" });

  // Fetch contacts from the backend
  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${backend_url}/api/contacts/get-all-contacts`);
      setContacts(res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setNewContact({ type: contact.type, value: contact.value });
  };

  const handleUpdateContact = async () => {
    if (!newContact.type || !newContact.value) {
      return Swal.fire("Error", "All fields are required!", "error");
    }
    try {
      await axios.put(`${backend_url}/api/contacts/edit-contact/${selectedContact.id}`, newContact);
      Swal.fire("Success", "Contact updated successfully!", "success");
      fetchContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
      Swal.fire("Error", "Failed to update contact", "error");
    }
  };

  const handleDeleteContact = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${backend_url}/api/contacts/delete-contact/${id}`);
          Swal.fire("Deleted!", "Contact has been deleted.", "success");
          fetchContacts();
        } catch (error) {
          console.error("Error deleting contact:", error);
          Swal.fire("Error", "Failed to delete contact", "error");
        }
      }
    });
  };

  const handleAddContact = async () => {
    if (!newContact.type || !newContact.value) {
      return Swal.fire("Error", "All fields are required!", "error");
    }
    try {
      await axios.post(`${backend_url}/api/contacts/add-contact`, newContact);
      Swal.fire("Success", "Contact added successfully!", "success");
      fetchContacts();
      setNewContact({ type: "", value: "" });
    } catch (error) {
      console.error("Error adding contact:", error);
      Swal.fire("Error", "Failed to add contact", "error");
    }
  };

  return (
    <div className="box" id="contact">
      <h2 className="ui top attached inverted header">Contact</h2>
      <div className="ui padded text segment" id="content-box">
        {contacts.size == 0 ? "No contacts found." : contacts.map((item, index) => {
          if (item.type.toLowerCase() === "mail") {
            return (
              <div key={index} className="flex-container">
                <p>
                  <li>Email: <a href={`mailto:${item.value}`}>{item.value}</a></li>
                </p>
                <div>
                  <button className="ui button blue" onClick={() => handleEditContact(item)}>Edit</button>
                  <button className="ui button red" onClick={() => handleDeleteContact(item.id)}>Delete</button>
                </div>
              </div>
            );
          }
          if (item.type.toLowerCase() === "website") {
            return (
              <div key={index} className="flex-container">
                <p>
                  <li>Website: <a
                    href={item.value.startsWith('http') ? item.value : `https://${item.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.value}
                  </a>
                  </li>
                </p>
                <div>
                  <button className="ui button blue" onClick={() => handleEditContact(item)}>Edit</button>
                  <button className="ui button red" onClick={() => handleDeleteContact(item.id)}>Delete</button>
                </div>
              </div>
            );
          }
          return (
            <div key={index} className="flex-container">
              <p>
                <li>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}: {item.value}</li>
              </p>
              <div>
                <button className="ui button blue" onClick={() => handleEditContact(item)}>Edit</button>
                <button className="ui button red" onClick={() => handleDeleteContact(item.id)}>Delete</button>
              </div>
            </div>
          );
        })}
        {/* <div className="actions">
          <button className="ui button blue" onClick={() => handleEditContact(item)}>Edit</button>
          <button className="ui button red" onClick={() => handleDeleteContact(item.id)}>Delete</button>
        </div> */}
        <div className="actions">
          <button className="ui button blue" onClick={() => setSelectedContact({ type: "", value: "" })}>
            Add Contact
          </button>
        </div>
      </div>


      {selectedContact && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="ui header">{selectedContact.id ? "Edit Contact" : "Add Contact"}</div>
            <div className="content">
              <div className="ui form">
                <div className="field">
                  <label>Type</label>
                  <input
                    type="text"
                    value={newContact.type}
                    onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                    placeholder="Type"
                  />
                </div>
                <div className="field">
                  <label>Value</label>
                  <input
                    type="text"
                    value={newContact.value}
                    onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                    placeholder="Value"
                  />
                </div>
              </div>
            </div>
            <br />
            <div className="actions">
              <button className="ui button" onClick={() => setSelectedContact(null)}>Cancel</button>
              {selectedContact.id ? (
                <button className="ui button blue" onClick={handleUpdateContact}>Update Contact</button>
              ) : (
                <button className="ui button blue" onClick={handleAddContact}>Add Contact</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
