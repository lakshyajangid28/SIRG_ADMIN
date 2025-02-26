import React, {useEffect} from "react";
import About from "../../components/About/About";
import Research from "../../components/Research/Research";
import People from "../../components/People/People";
import Project from "../../components/Project/Project";
import Achievements from "../../components/Achievements/Achievements";
import Publications from "../../components/Publications/Publications";
import Positions from "../../components/Positions/Positions";
import Teaching from "../../components/Teaching/Teaching";
import Contact from "../../components/Contact/Contact";

const Home = ({ setCurrentPage }) => {

  useEffect(() => {
    setCurrentPage('home');
  }, []);

  return (
    <div className="home">
      <About /><br /><br />
      <Research setCurrentPage={setCurrentPage} /><br /><br />
      <People /><br /><br />
      <Project /><br /><br />
      <Achievements /><br /><br />
      <Publications /><br /><br />
      <Positions /><br /><br />
      <Teaching /><br /><br />
      <Contact /><br />
    </div>
  );
};

export default Home;
