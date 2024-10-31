import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from "jquery"

const EditProfile = () => {
  const api = 'http://127.0.0.1:8000';
  const [userData, setData] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const navigate = useNavigate(); 
  const fileInputRef = useRef(null);
  const formData = new FormData();
  const user_id = localStorage.getItem("id");
  function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return pattern.test(email);
  }
  const openFile = () => {
    fileInputRef.current.click();
  }
  const changeFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      document.getElementById("avatar").src = imgUrl;
      formData.append("avatar", file); 
    }
  };
  
  const updateData = async () => {
    const allowedFileds = {
        "avatar": false,
        "username": false,
        "email": false,
        "about": false,
    }
    const avatar = document.getElementById("avatar").src;
    const username = document.getElementById("username-edit").value;
    const about = document.getElementById("about-me").value;
    const email = document.getElementById("email-edit").value;
    if (avatar !== `${api}/media/${userData.avatar}`){
        allowedFileds["avatar"] = true;
    };

    if (username !== userData.username){
        allowedFileds["username"] = true;
        formData.append("username", username)
    };

    if (email !== userData.email && isValidEmail(email)){
        allowedFileds["email"] = true;
        formData.append("email", email)
    };

    if (about.trim() !== ''){
        allowedFileds["about"] = true;
        formData.append("about", about)
    };
    $.ajax({
      url: `${api}/api/update/${user_id}/`,
      type: 'POST', 
      data: formData,
      processData: false, 
      contentType: false,
      success: function(response) {
        navigate("/profile")
        console.log('Profile updated:', response);
      },
      error: function(xhr, status, error) {
        console.error('Error updating profile:', error);
      }
    });
  }
  useEffect(() => {
    const getData = async () => {
      try {
        const request = await fetch(`${api}/api/get/${user_id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseData = await request.json();
        setData(responseData);  
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);  
      }
    };

    getData();  
  }, []); 

  if (loading) {
    return <div className='container edit-profile loader d-md-none' style={{"marginTop": "20%"}}></div>;  
  }
  if (!userData){
    return <div className='container edit-profile loader d-md-none' style={{"marginTop": "20%"}}></div>;  
  }
  const avatarSrc = `${api}/media/${userData.avatar}/`;
  return (
    <div className='container edit-profile mt-3' >
      <div className='col-12'>
        <i className="bi bi-arrow-left" style={{ fontSize: '25px', "cursor": "pointer"}} onClick={() => navigate(-1)}></i>
      </div>
      <h1 className='mt-4'>Edit Profile</h1>
      <div className='d-flex mt-4' style={{ width: "100%", backgroundColor: "#f6eda4", padding: "10px", borderRadius: "10px", justifyContent: "space-between", alignItems: "center" }}>
        <div className='d-flex align-items-center'>
            <img alt="" src={avatarSrc} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: "cover" }} id='avatar' />
            <h3 className='ml-3' style={{ marginLeft: "20px" }}>{userData.username}</h3>
        </div>
        <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={changeFile}
      />
        <button className='btn btn-primary' style={{ width: "fit-content", height: "fit-content" }} onClick={openFile}>Edit photo</button>
      </div>
      <div className='col-12 mt-4'>
        <h3>About Me</h3>
        <textarea name="about-me" id="about-me" maxLength={255} defaultValue={userData.about} className='col-12'  placeholder='About Me' style={{"border-radius": "10px", resize: 'none', "height": "80px", "padding": "10px"}}></textarea>
      </div>
      <div className='mt-3 user' style={{"display": "flex", "flexDirection": "column"}}>
        <h3>Main</h3>
        <label htmlFor="username-edit">Username</label>  
        <input type="text" id='username-edit' className='col-md-3 col-12 mt-2' defaultValue={userData.username}/>
        <label htmlFor="email-edit" className='mt-3'>Email</label>  
        <input type="text" id='email-edit' className='col-md-3 col-12 mt-2' defaultValue={userData.email}/>
      </div>  
      <div className='d-flex col-12 mt-4' style={{"gap": "10px", marginLeft: "-5px", "padding-bottom": "10px"}}>
        <button type="button" className="btn btn-outline-secondary col-6 col-lg-2" onClick={() => navigate(-1)}>Don't save</button>
        <button type="button" className="btn btn-primary col-6 col-lg-2" onClick={updateData}>Save</button>
      </div>
    </div>
  );
}

export default EditProfile;
