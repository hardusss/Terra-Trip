import { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [classBtn, setClassBtn] = useState("btn btn-primary");
    const [btnText, setBtnText] = useState("Follow");
    const userUrl = `https://terratrip.loca.lt/user/${id}`
    const api = 'http://127.0.0.1:8000';
    const [text, setText] = useState(userUrl);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [userPosts, setUserPosts] = useState(null);


    const defaultView = (<div className="container-fluid d-flex justify-content0center " style={{flexDirection: "column", textAlign: "center"}}><i className="bi bi-camera2" style={{ color: 'black'}}></i> <h1>There are no posts yet</h1></div>
  )


    const [userPostsView, setUserPostsView] = useState([])
    const show = () => {
        document.querySelector(".share").style.opacity = "1";
        document.getElementById("layout").style.opacity = "1";
        document.querySelector(".share").style.zIndex = "9999";
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
        navigator.clipboard.writeText(text)
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
    const subscribe = () => {
        const user_id = localStorage.getItem("id");
        if (btnText === "Follow"){
            fetch(`${api}/api/follow/${user_id}/${id}/`, {method: "POST"})
            setBtnText("Tracked");
            setClassBtn("btn btn-secondary");
        } else{
            fetch(`${api}/api/unfollow/${user_id}/${id}/`, {method: "POST"})
            setBtnText("Follow")
            setClassBtn("btn btn-primary");
        };
        window.location.reload();
    };

    
    const goPost = (id) => {
      navigate(`/post/${id}`)
    }

    const handleNavigation = () => {
      navigate(-1);
  };

    useEffect(() => {
        const user_id = localStorage.getItem("id")
        fetch(`${api}/api/get/${id}/`, {method: "GET"})
        .then((response) => response.json())
        .then((data) => {
        setUserData(data); 
        fetch(`${api}/api/get/${user_id}/`, {method: "GET"})
        .then((response_user) => response_user.json())
        .then((data_user) => {
            if (data_user.follow_for) {
        
                if (data_user.follow_for && data_user.follow_for.includes(+id)) {
                    setBtnText("Tracked");
                    setClassBtn("btn btn-secondary");
                } else {
                   
                }
            } else {
                console.log("follow_for field is missing or null");
            }
        })
        fetch(`${api}/api/get_posts/${id}/`)
        .then((response) => response.json())
        .then((data) => {
            setUserPosts(data);
            if (data.posts) {
                const items = data.posts.map(post => (
                    <div className='col-6 col-md-4 col-lg-2 post-item' key={post.id} onClick={() => goPost(post.id)}>
                        <div className='photo'>
                            <div className="likes"><i className="bi bi-heart-fill"></i> {post.likes}</div>
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
            }
        })
        .catch((error) => console.error('Error fetching user posts:', error));
      });
    }, []);

    if (!userData) {
        return <div className='container edit-profile loader d-md-none' style={{"marginTop": "20%"}} ></div>;
      };
    const avatarSrc = `${api}/media/${userData.avatar}`;  
    const qrSrc = `${api}/media/${userData.qr}`;  
    return (
    <div className='container profile p-md-5 mt-3'>
      <i class="bi bi-arrow-left" style={{marginLeft: "10px", marginTop: "30px", fontSize: "30px", cursor: 'pointer'}} onClick={handleNavigation}></i>
      <div className='avatar'>
        <img 
          id="avatar"
          src={avatarSrc}
          alt=''
          style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: "cover"}}
        />
        
      </div>
      <div className="d-flex">
        <h3 style={{marginLeft: "15px"}}>{userData.username}</h3>
        {userData.official === "True" ? <i class="bi bi-check-circle-fill mt-md-1" style={{color: "#13bfae", marginLeft: "10px"}}></i> : ""}
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
      <div style={{marginLeft: "13px"}}>
        <button className={classBtn} id="sub" onClick={subscribe}>{btnText}</button>
        <button className="btn btn-secondary" style={{marginLeft: "10px"}} onClick={show}>Share profile</button>
      </div>
      <hr className='mt-4'/>
      <div className='MyPosts'>
          <div className='row d-flex post-cont'>
            {userPostsView.length > 0 ? userPostsView : defaultView}
        </div>
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


};

export default UserProfile;