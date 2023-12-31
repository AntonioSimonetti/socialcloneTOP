import React, { useEffect, useState } from "react";
import {
  fetchComments,
  addComment,
  removeComment,
  auth,
} from "../firebaseUtils";
import "../styles/comment.css";

function Comment({ onAllTweet, setSelectedTweetId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const fetchCommentsData = async () => {
      let commenti = await fetchComments(onAllTweet);
      setComments(commenti);
    };

    fetchCommentsData();
  }, []);

  useEffect(() => {
    const userAuth = auth.currentUser.uid;
    setLoggedUser(userAuth);
  }, []);

  const handleInputChange = (event) => {
    setNewComment(event.target.value);
  };

  // Funzione per gestire l'invio del nuovo commento
  const handleSubmit = async () => {
    // Chiamata alla funzione addComment per inviare il nuovo commento al database
    await addComment(onAllTweet, newComment);

    setNewComment("");
  };

  return (
    <div className="comment">
      <div className="mainDiv">
        <div className="topHeader">
          <button className="closeBtn" onClick={() => setSelectedTweetId(null)}>
            X
          </button>
        </div>{" "}
        <div className="content">
          {comments.map((comment, index) => (
            <div className="singleContent" key={index}>
              <div className="topContent">
                <p>{comment.name}</p>
                <p>-</p>
                <p>{comment.date}</p>
                <p>{comment.timestamp}</p>
                {comment.userId === loggedUser && (
                  <button onClick={() => removeComment(comment, onAllTweet)}>
                    X
                  </button>
                )}{" "}
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
        <div className="addComment">
          <input
            type="text"
            value={newComment}
            onChange={handleInputChange}
            placeholder="Scrivi un commento..."
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>{" "}
      </div>
    </div>
  );
}

export default Comment;

//add comments to search component
