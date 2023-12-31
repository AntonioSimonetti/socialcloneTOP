import React, { useState } from "react";
import { signUpWithEmail } from "../firebase";
import countries from "countries-list";
import { validate } from "email-validator";
import "../styles/registrationform.css";
import { createUserDocument } from "../firebaseUtils";

function RegistrationForm({ onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("Enter your information to register");

  const isEmailValid = (email) => {
    return validate(email);
  };

  //Client side validation. TO DO SERVER SIDE VALIDATION.
  const handleRegistration = async () => {
    if (
      !username ||
      !email ||
      !age ||
      !password ||
      !confirmPassword ||
      !position
    ) {
      setError("Please fill in all the fields.");
      return;
    }

    //verify email using email-validator
    if (!isEmailValid(email)) {
      setError("Invalid email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
      setError(
        "Password must contain at least one symbol, one number, and one capital letter."
      );
      return;
    }

    try {
      const { user } = await signUpWithEmail(email, password); // Ottenere l'oggetto user dalla chiamata a signUpWithEmail
      // Registrazione avvenuta con successo, chiamata a createUserDocument
      const userData = {
        uid: user.uid,
        name: username,
        email: email,
        position: position,
        age: age,
        photoURL: null,
      };
      await createUserDocument(userData);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else {
        setError("Error during registration.");
      }
    }
  };

  return (
    <div className="registrationForm">
      {error && <p>{error}</p>}
      <div className="labelInput">
        <label htmlFor="username" className="small-input-label">
          Name:
        </label>
        <input
          className="small-input"
          type="text"
          id="username"
          name="username"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="age" className="small-input-label">
          Age:
        </label>
        <input
          className="small-input"
          type="number"
          id="age"
          name="age"
          max="99"
          placeholder="Enter your age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label htmlFor="email" className="small-input-label">
          Email:
        </label>
        <input
          className="small-input"
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password" className="small-input-label">
          Password:
        </label>
        <input
          className="small-input"
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword" className="small-input-label">
          Confirm Password:
        </label>
        <input
          className="small-input"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <label htmlFor="position" className="small-input-label">
          Position:
        </label>
        <select
          className="small-select-label"
          id="position"
          name="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <option value="">Select a position</option>
          {Object.keys(countries.countries).map((code) => (
            <option key={code} value={countries.countries[code].name}>
              {countries.countries[code].name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleRegistration}>Register</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
}

export default RegistrationForm;
