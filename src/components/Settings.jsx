import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCircleCheck, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const navigate = useNavigate();

  const [isBMACEnabled, setIsBMACEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [password, setPassword] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bmacLink, setBmacLink] = useState('');
  const [isMinLengthValid, setMinLengthValid] = useState(false);
  const [isDigitAndLetterRequiredValid, setDigitAndLetterRequiredValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [eyeClicked, setEyeClicked] = useState(false);
  const [confirmEyeClicked, setConfirmEyeClicked] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [originalJobTitle, setOriginalJobTitle] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUser(decodedToken);
        fetchUserData(decodedToken.id);
      } catch (error) {
        console.error("Invalid token:", error);
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Please log in first!",
        });
        navigate("/login");
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please log in first!",
      });
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")}`
        }
      });
      const data = await res.json();
      setOriginalName(data.name);
      setArtistName(data.name);
      setOriginalJobTitle(data.jobTitle);
      setJobTitle(data.jobTitle);
      setBmacLink(data.bmacLink || '');
      setIsBMACEnabled(!!data.bmacLink);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleBMACChange = () => {
    setIsBMACEnabled(!isBMACEnabled);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const hasMinLength = value.length >= 8;
    const hasDigitAndLetterRequired = (/\d/.test(value) && /[A-Z]/.test(value) && /[a-z]/.test(value));

    setMinLengthValid(hasMinLength);
    setDigitAndLetterRequiredValid(hasDigitAndLetterRequired);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    setEyeClicked(!eyeClicked);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
    setConfirmEyeClicked(!confirmEyeClicked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password different",
        text: "Please confirm your password again!"
      });
      return;
    }

    if (password && (!isMinLengthValid || !isDigitAndLetterRequiredValid)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "Your password is invalid, please try another one!"
      });
      return;
    }

    if ((artistName && artistName != originalName) || (jobTitle && jobTitle != originalJobTitle) || (password && confirmPassword)) {
      try {
        const dataToSend = password ? {
          name: artistName,
          password,
          jobTitle
          // bmacLink: isBMACEnabled ? bmacLink : null
        } : {
          name: artistName,
          jobTitle
        };

        const res = await fetch(`http://localhost:8080/api/users/update/${currentUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          },
          body: JSON.stringify(dataToSend)
        });
  
        if (res.ok) {
          Swal.fire({
            icon: "success",
            title: "Profile Updated",
            text: "Your profile has been updated successfully!"
          });

          setTimeout(() => {
            navigate(`/artist/${jwtDecode(localStorage.getItem("jwt")).id}`)
          }, 2000)
        } else if (res.status === 401) {
          const message = await res.text();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Your token is invalid >:(",
          });
          throw new Error(`HTTP error! status: ${res.status}`);
        } else {
          const message = await res.text();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: message,
          });
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Nothing changed!",
        text: "Your profile has nothing to update :("
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Member Center</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="form-group mb-3">
          <label htmlFor="artistName" className="form-label">Artist Name</label>
          <input
            type="text"
            className="form-control"
            id="artistName"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Enter your name..."
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="jobTitle" className="form-label">Job Title</label>
          <input
            type="text"
            className="form-control"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Brief introduce your job title..."
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="inputPasswordArea">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your new password..."
            />
            <FontAwesomeIcon
              style={{ position: "absolute", zIndex: 1, right: "1rem" }}
              size="lg"
              onClick={togglePasswordVisibility}
              icon={eyeClicked ? faEye : faEyeSlash}
              color={eyeClicked ? "#000000" : "#A0A0A0"}
            />
          </div>
          <div style={{ marginTop: "1rem", fontSize: "12px", textAlign: "start", display: "flex", justifyContent: "space-between" }}>
            {
              isMinLengthValid ?
                (<span style={{ color: "white" }}><FontAwesomeIcon color="mediumaquamarine" icon={faCircleCheck} /> 8 Characters min.</span>) :
                (<span style={{ color: "gray" }}><FontAwesomeIcon icon={faCircleCheck} /> 8 Characters min.</span>)
            }
            {
              isDigitAndLetterRequiredValid ?
                (<span style={{ color: "white" }}><FontAwesomeIcon color="mediumaquamarine" icon={faCircleCheck} /> At least one digit, one lower case and one upper case letter.</span>) :
                (<span style={{ color: "gray" }}><FontAwesomeIcon icon={faCircleCheck} /> At least one digit, one lower case and one upper case letter.</span>)
            }
          </div>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <div className="inputPasswordArea">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Enter your new password again..."
            />
            <FontAwesomeIcon
              style={{ position: "absolute", zIndex: 1, right: "1rem" }}
              size="lg"
              onClick={toggleConfirmPasswordVisibility}
              icon={confirmEyeClicked ? faEye : faEyeSlash}
              color={confirmEyeClicked ? "#000000" : "#A0A0A0"}
            />
          </div>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="enableBMAC"
            checked={isBMACEnabled}
            onChange={handleBMACChange}
          />
          <label className="form-check-label" htmlFor="enableBMAC">Enable Buy Me a Coffee</label>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="bmacLink" className="form-label">Buy Me a Coffee Link</label>
          <input
            type="text"
            className="form-control"
            id="bmacLink"
            value={bmacLink}
            onChange={(e) => setBmacLink(e.target.value)}
            placeholder="Enter your Buy Me a Coffee link"
            disabled={!isBMACEnabled}
          />
        </div>
        <button type="submit" className="btn btn-primary main-button"><FontAwesomeIcon icon={faFloppyDisk}/> Save</button>
        <Link to={`/artist/${jwtDecode(localStorage.getItem("jwt")).id}`}>
          <button type="button" className="btn btn-secondary ms-3 secondary-button">Cancel</button>
        </Link>
      </form>
    </div>
  );
};

export default Settings;
