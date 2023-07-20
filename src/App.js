import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./styles/App.css";
import Homepage from "./components/home";
import LandingPage from "./components/landing";
import Navbar from "./components/navbar";
import Profile from "./components/profile";
import Addtweet from "./components/addtweet";
import UserSearch from "./components/usersearch";

function App() {
  const [user, setUser] = useState(null);
  const [currentComponent, setCurrentComponent] = useState("homepage");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleProfileClick = () => {
    setCurrentComponent("profile");
  };

  const handleHomeClick = () => {
    setCurrentComponent("homepage");
  };

  const handleAddTweetClick = () => {
    setCurrentComponent("addtweet");
  };

  const handleSearchClick = () => {
    setCurrentComponent("search");
  };

  return (
    <div className="App">
      {user ? (
        <>
          {currentComponent === "homepage" && <Homepage />}
          {currentComponent === "profile" && <Profile />}
          {currentComponent === "addtweet" && <Addtweet />}
          {currentComponent === "search" && <UserSearch />}

          <Navbar
            onProfileClick={handleProfileClick}
            onHomeClick={handleHomeClick}
            onAddTweetClick={handleAddTweetClick}
            onSearchClick={handleSearchClick}
          />
        </>
      ) : (
        <LandingPage />
      )}
    </div>
  );
}

export default App;
