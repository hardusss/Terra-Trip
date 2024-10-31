import React, { useEffect, useState , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css'; 
import $ from "jquery"

function Profile() {
  const [userData, setUserData] = useState(null);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [userPosts, setUserPosts] = useState(null);
  
  const navigate = useNavigate(); 
  const formData = new FormData();
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const api = 'http://127.0.0.1:8000'
  const defaultView = (<div className='MyPosts'>
    <i className="bi bi-camera2" style={{ color: 'black' }}></i>
    <h1>Share your travels photos</h1>
    <p>Once shared, the photos will appear on your profile.</p>
    <a onClick={() => navigate("/post/create")} href=''>Share your first photo</a>
  </div>
)
const show = () => {
  document.querySelector(".share").style.opacity = "1";
  document.querySelector(".share").style.zIndex = "9999";
  document.getElementById("layout").style.opacity = "1";
  document.getElementById("layout").style.display = "flex";
  document.body.style.overflow = 'hidden';
}
const hide = () => {
  document.querySelector(".share").style.opacity = "0";
  document.querySelector(".share").style.zIndex = "-9999";
  document.getElementById("layout").style.opacity = "0";
  document.getElementById("layout").style.display = "none";
  document.body.style.overflow = '';
}
const copyToClipboard = () => {
  navigator.clipboard.writeText(`https://terratrip.loca.lt/user/${localStorage.getItem("id")}`)
      .then(() => {
      const msgElement = document.querySelector(".msg");
      msgElement.classList.remove("anim");
      setMessage('Url copied to clipboard');

      requestAnimationFrame(() => {
          requestAnimationFrame(() => {
              msgElement.classList.add("anim");
          });
      });
      })
      .catch(err => {
          setMessage('Error');
          console.error('Помилка:', err);
      });
};
  const [userPostsView, setUserPostsView] = useState([])
  const deleteAccount = async () => {
    const user_id = localStorage.getItem("id");

    const request = await fetch(`${api}/api/delete/${user_id}/`, {
      method: "DELETE"
    })
    if (request.ok) {
      localStorage.clear();
      navigate("/");
    }
  }

  const exit = () => {
    localStorage.clear();
    navigate("/")
  }
  const goEdit = () => {
    navigate("/profile/edit")
  }
  const hideSettings = () => {
    document.getElementById("settings").style.display = "none";
    setPopoverVisible(false);
  };

  const showSettings = () => {
    document.getElementById("settings").style.display = "flex";
    document.getElementById("modal").style.display = "flex";
  };

  const resetAvatar = async () => {
    const user_id = localStorage.getItem("id");
    const request = await fetch(`${api}/api/reset/${user_id}/`, {method: "POST"});
    if (request.ok){}
    hideSettings()
    window.location.reload();
  }
  const handleChildClick = (event) => {
    event.stopPropagation();
  };

  const showPopover = () => {
    setPopoverVisible(true);
  };

  const hidePopover = () => {
    setPopoverVisible(false); 
  };
  const goPost = (id) => {
    navigate(`/post/${id}`)
  }
  const changeFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      document.getElementById("avatar").src = imgUrl;
      formData.append("avatar", file); 
      const user_id = localStorage.getItem("id")
      $.ajax({
        url:`${api}/api/update/${user_id}/`,
        type: 'POST', 
        data: formData,
        processData: false, 
        contentType: false,
        success: function(response) {
          console.log('Profile updated:', response);
        },
        error: function(xhr, status, error) {
          console.error('Error updating profile:', error);
        }
      })
    }
  };
  const openFile = () => {
    fileInputRef.current.click();
  }
  useEffect(() => {
    const user_id = localStorage.getItem("id");
    fetch(`${api}/api/get/${user_id}/`)
      .then((response) => response.json())
      .then((data) => {
        setUserData(data); 
      })
      .catch((error) => console.error('Error fetching user data:', error));
    fetch(`${api}/api/get_posts/${user_id}/`)
    .then((response) => response.json())
      .then((data) => {
        setUserPosts(data); 
        const items = data.posts.map(post => (
          <div className='col-6 col-md-4 col-lg-2 post-item' key={post.id} onClick={() => goPost(post.id)}>
            <div className='photo'>
              <div className="likes"><i class="bi bi-heart-fill"></i> {post.likes}</div>
              <img
                src={`${api}/media/${post.image}`}
                className='img-fluid mt-2'
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                alt=''
              />
          </div>
            </div>
        ));
        setUserPostsView(items);
      }, [])
      .catch((error) => console.error('Error fetching user posts:', error));
    

  }, []);

  const handleRedirect = () => {
    navigate('/profile/edit'); 
  };

  if (!userData) {
    return <div className='container edit-profile loader d-none' style={{"marginTop": "20%"}}></div>
  }
  
  const avatarSrc = `${api}/media/${userData.avatar}`;
  const qrSrc = `${api}/media/${userData.qr}`;
    return (
    <div className='container profile p-md-5 mt-3'>
      <div className='avatar'>
        <img 
          id="avatar"
          src={avatarSrc}
          alt=''
          style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: "cover"}}
        />
        <div className='layout' onClick={openFile}>
          <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={changeFile}
        />
          <i className="bi bi-camera-fill"></i>
        </div>
      </div>
      <div className='d-flex mt-3' style={{"marginLeft": "15px"}}>
        <h3>{userData.username}</h3>
        {userData.official === "True" ? <i class="bi bi-check-circle-fill mt-md-2 mt-1" style={{color: "#13bfae", marginLeft: "10px"}}></i> : ""}
        <div className='d-flex col-9'>
          <button type='button' className='btn btn-dark col-md-2 col-6' onClick={handleRedirect} style={{marginLeft: "5%"}}>Edit profile</button>
          <button className='col-1' style={{ width: 'fit-content', border: 'none' }}  onClick={showSettings}>  
            <i className="bi bi-gear-wide" style={{ color: 'black', fontSize: '25px', marginLeft: "5%" }}></i>
          </button>
          <i class="bi bi-send-arrow-down-fill" style={{ color: 'black', fontSize: '25px', marginLeft: "20px" }} onClick={show}></i>
        </div>
      </div>
      <div style={{ gap: '50px', fontWeight: '600',"marginLeft": "15px" }} className='d-flex mt-3'>
        <p>{userData.post_count} posts</p>
        <p>Readers: {userData.readers}</p>
        <p>Follows: {userData.follows}</p>
      </div>
      <strong className="my-country">I am from {userData.country}</strong>
      <div style={{"width": "250px", marginLeft: "15px"}}>
        <p>{userData.about}</p>
      </div>
      <hr className='mt-4'/>
      <div className='row d-flex post-cont'>
        {userPostsView.length > 0 ? userPostsView : defaultView}
      </div>
      <div id='settings' onClick={hideSettings}>
        <div onClick={handleChildClick} id='modal' style={{"padding": "10px", "borderRadius": "10px", "boxShadow": "0 0 10px black", "display": "flex", "flexDirection": "column"}}>
          <h3>Settings</h3>
          <button type="button" className="btn btn-secondary" onClick={resetAvatar}>Reset avatar</button>
          <button type="button" className="btn btn-secondary" onClick={goEdit}>Edit</button>
          <button type="button" className="btn btn-secondary" onClick={exit}>Exit</button>
          <button type="button" className="btn btn-secondary" style={{"color": "red", "backgroundColor": "black"}} onClick={showPopover}>Delete account</button>
        </div>
        {isPopoverVisible && ( 
          <div className='popover' onClick={handleChildClick}>
            <strong style={{"color": "white"}}>You really want delete your account?</strong>
            <br />
            <br />
            <div className='d-flex'>
              <button type="button" style={{"width": "fit-content"}} className="btn btn-primary" onClick={hidePopover}>No</button>
              <button type="button" style={{"marginLeft": "15px", "width": "fit-content"}} className="btn btn-outline-danger" onClick={deleteAccount}>Yes</button>
            </div>
          </div>
        )}
      </div>
      <div id="layout" onClick={hide}></div>
        <div className="share">
        <h3>Share this profile</h3>  
            <div class="box"><img src={qrSrc} alt="" /></div>
                <button onClick={copyToClipboard} className="btn btn-secondary">Copy url</button>
                {message && <p className="msg">{message}</p>}
        </div>
    </div>
  );
}

export default Profile;
