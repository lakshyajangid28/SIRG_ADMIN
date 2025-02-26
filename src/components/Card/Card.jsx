import React from "react";

const Card = ({ person, onEdit, onDelete }) => {
  return (
    <div className="ui card">
      <div className="image">
        {person.image ? (
          <img src={person.image} alt="Person" />
        ) : (
          <img src="src/assets/image.png" alt="Default" />
        )}
      </div>
      <div className="content">
        <div className="ui medium header">{person.name}</div>
        <div className="meta">
          {person.category?.charAt(0).toUpperCase() + person.category?.slice(1)}
          <br />
          {person.description}
        </div>
      </div>
      <div className="extra content">
        <button className="ui button blue" onClick={onEdit}>
          Edit
        </button>
        <button className="ui button red" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
