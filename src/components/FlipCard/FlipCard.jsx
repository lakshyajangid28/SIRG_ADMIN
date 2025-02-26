import React from "react";
import './FlipCard.css';

const FlipCard = ({ achievement }) => {
  return (  
    <div className="flip-card">
      <div className="flip-card-inner">
        {/* Front side of the card */}
        <div className="flip-card-front">
          <img
            src={achievement.image}
            alt="Front"
            className="ui image"
          />
        </div>

        {/* Back side of the card */}
        <div className="flip-card-back">
          {achievement.body}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
