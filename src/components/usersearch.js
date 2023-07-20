import React, { useState, useEffect } from "react";
import { fetchUserSearch } from "../firebaseUtils";
import "../styles/usersearch.css";
import ProfileSearch from "./profilesearch";

function UserSearch() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUserDocument, setSelectedUserDocument] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileSearch, setShowProfileSearch] = useState(false); // Nuova variabile di stato

  const handleSearchChange = async (e) => {
    const text = e.target.value;
    setSearchText(text);

    if (text.length === 0) {
      setSearchResults([]);
      return;
    }

    // Esegui la ricerca solo se il campo di ricerca contiene almeno una lettera
    const searchResults = await fetchUserSearch(text);

    // Filtra i risultati in base alle corrispondenze con il nome (case-insensitive)
    const filteredResults = searchResults.filter((user) => {
      const formattedName = user.name.toLowerCase();
      const formattedText = text.toLowerCase();
      const regex = new RegExp("^" + formattedText, "i");
      return regex.test(formattedName);
    });

    setSearchResults(filteredResults);
  };

  const handleSearchClick = (user) => {
    setSelectedUserDocument(user.id);
    setSelectedUser(user);
  };

  useEffect(() => {
    setShowProfileSearch(selectedUserDocument !== null); // Impostiamo lo stato in base alla selezione dell'utente
  }, [selectedUserDocument]);

  return (
    <div className="UserSearchContainer">
      {showProfileSearch ? (
        <ProfileSearch documentId={selectedUserDocument} user={selectedUser} />
      ) : (
        <>
          <input
            type="text"
            placeholder="Cerca un utente..."
            value={searchText}
            onChange={handleSearchChange}
            className="input"
          />
          <ul className="searchUl">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="searchElement"
                onClick={() => handleSearchClick(user)}
              >
                {user.name}
              </div>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default UserSearch;
