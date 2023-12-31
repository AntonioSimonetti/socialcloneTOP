import React, { useEffect, useState } from "react";
import defaultusersvg from "../img/user-circle-svgrepo-com (1).svg";
//import defaultbanner from "../img/bannerdef.jpg";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  fetchUserProfileData,
  fetchUserTweets,
  getBackgroundColor,
  getImageProfile,
} from "../firebaseUtils";
import "../styles/profile.css";
import Profiletweets from "./profiletweets";
import Editprofile from "./editprofile";
import postionsvg from "../img/map-point-wave.svg";
import agesvg from "../img/calendar.svg";
import gendersvg from "../img/gender.svg";

function Profile() {
  const [user, setUser] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState("#ffffff");
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageUpload = (url) => {
    setImageUrl(url);
  };

  const updateHeaderBackgroundColor = (color) => {
    setHeaderBackgroundColor(color);
  };

  const toggleEditProfile = () => {
    setIsEditingProfile((prevState) => !prevState);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfileData = await fetchUserProfileData(user.uid);
        setUser(userProfileData);

        const userTweets = await fetchUserTweets();
        setTweets(userTweets.slice(-2));

        // Fetch the user's background color and update the state
        const userBackgroundColor = await getBackgroundColor(user.uid);
        setHeaderBackgroundColor(userBackgroundColor);

        const userProfileImage = await getImageProfile(user.uid);
        setImageUrl(userProfileImage);
      }
    });

    return () => unsubscribe();
  }, [isEditingProfile]);

  return (
    <div className="profile">
      <div
        className="header"
        style={{ backgroundColor: headerBackgroundColor }}
      ></div>
      <div className="topDiv">
        <div className="avatarDiv">
          <div className="avatarWrapper">
            <img
              src={imageUrl || user?.photoURL || defaultusersvg}
              alt="user avatar"
            />{" "}
          </div>
          <button className="edit-profile" onClick={toggleEditProfile}>
            Edit profile
          </button>
        </div>
      </div>
      {user && (
        <>
          <div className="identificationDiv">
            <h1 className="name">{user.name}</h1>
            <p className="userid">@{user.userId}</p>
          </div>
          <p className="bio">{user.bio}</p>
          <div className="infoDivProfile">
            <div className="positionDiv">
              <img src={postionsvg} alt="position icon" />
              <p>{user.position}</p>
            </div>
            <div className="ageDiv">
              <img src={agesvg} alt="age icon" />
              <p>{user.age}</p>
            </div>
            <div className="genderDiv">
              <img src={gendersvg} alt="gender icon" />
              <p>{user.gender}</p>
            </div>
          </div>
          <div className="followerFollowingDiv">
            <h3>Following:</h3>
            <p>{user.following}</p>
            <h3>Followers:</h3>
            <p>{user.followers}</p>
          </div>
          <Profiletweets user={user} />
        </>
      )}
      {isEditingProfile && (
        <Editprofile
          onClose={toggleEditProfile}
          onUser={user}
          onColorChange={updateHeaderBackgroundColor}
          onImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
}

export default Profile;
