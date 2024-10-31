import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dateFormater  from "../utils/date"


const Post = () => {
    const { id } = useParams();
    const [postItem, setPostItem] = useState(null);
    const [clickCount, setClickCount] = useState(0);
    const [defEditText, setDefEditText] = useState(null);
    const [commentID, setCommentID] = useState(null);
    const [commentId, setCommentId] = useState(null);

    const toggleDropdown = () => {
        const drop = document.getElementById("drop");
        if (drop.style.display == "none"){
            drop.style.display = "block";
        } else {
            drop.style.display = "none";
        }
    };
    const [comments, setComments] = useState(
        <div className="container-fluid d-flex" style={{justifyContent: "center", alignItems: "center", height: "100%"}}>
            <h3> Write first comment! </h3>
        </div>
    )
    const navigate = useNavigate();
    const api = "http://127.0.0.1:8000";

    const writeComment = () => {
        const comment = document.getElementById("comment");
        if (comment.value.trim() !== ""){
            fetch(`${api}/api/create_comment/${commentID}/${localStorage.getItem("id")}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `content=${comment.value}`
            })
            .then(response => response.json())
            .then(data => {
                comment.value = ""
                getComments(commentID)
            })
        } else {
            comment.value = "Incorrect comment"
        }
    }
    const editComment = () => {
        fetch(`${api}/api/edit_comment/${commentId}/`, {
            method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `content=${document.getElementById("tx-edit-com").value}`
        })
        .then(response => response.json())
        .then(data => {
            getComments(commentID);
            document.getElementById(commentId).style.display = "none";
            document.querySelector(".modal-window").style.display = "none";
        })
    }
    const deleteComment = (id) => {
        fetch(`${api}/api/delete_comment/${id}/`, {method: "DELETE"})
        .then(response => response.json())
        .then(data => {
            getComments(commentID);
            document.getElementById(id).style.display = "none";
        })
    }
    const showCommentMove = (id) => {
        const element = document.getElementById(id);
    if (element) {
        element.style.display = "flex";
        const childComment = element.parentNode;
        const c = childComment.parentElement.id;
        const getText = document.querySelector(`#${c} .d-flex .mt-1 p`);
        if (getText) {
            setDefEditText(getText.innerHTML);
            setCommentId(id);
        }
    } else {
        console.warn(`Element with id ${id} not found.`);
    }
    } 
    const hideCommentMove = (id) => {
        document.getElementById(id).style.display = "none";
    } 
    const getComments = (post_id) => {
        fetch(`${api}/api/get_comments/${post_id}`)
        .then(response => response.json())
        .then(data => {
            if (data.comments){
                const items = data.comments.map(item => (
                    <div className="cont-comm container-fluid">
                        <div className="cm d-flex justify-content-between align-items-center" id={`con-${item.id}`}>
                            <div className="d-flex">
                                <img src={`${api}/media/${item.avatar}`} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                                <div className="mt-1" style={{ fontSize: "14px", marginLeft: "7px" }}>
                                <strong className="d-flex" style={{padding: 0}}>{item.username} {item.official === "True" ? <i class="bi bi-check-circle-fill" style={{color: "#13bfae", padding: "0", marginLeft: "5px"}}></i> : ""} <p style={{marginLeft: "15px", fontWeight: 200, padding: 0}}>{dateFormater(item.created_at)}</p></strong>
                                    <p style={{ fontWeight: "300", marginTop: "-15px" }}>{item.content}</p>
                                </div>
                            </div>
                            {+localStorage.getItem("id") === item.user_id ? 
                            <div ><i className="bi bi-three-dots thr-dot" onClick={() => showCommentMove(item.id)} style={{ cursor: "pointer"}}></i> 
                                <div id={item.id} style={{flexDirection: "column", display: "none", fontSize: "14px", backgroundColor: "black", "padding": "3px", gap: "3px", borderRadius: "10px", width: "70px"}}>
                                    <i class="bi bi-x" style={{"cursor": "pointer"}} onClick={() => hideCommentMove(item.id)}></i>
                                    <span style={{textDecoration: "none", color: "white", cursor: "pointer" }} onClick={showModal}>Edit</span>
                                    <span style={{textDecoration: "none", color: "red", cursor: "pointer"}} onClick={() => deleteComment(item.id)}>Delete</span>
                                </div> 
                            </div>
                            : ""}
                        </div>
                    </div>

                ))
                setComments(items)
                setCommentID(post_id);

                
                const comm = document.querySelector(".comments");
                comm.classList.remove("anim-comm-cont-hide");
                comm.style.display = "block";
                document.querySelector(".layout-comm").style.display = "block";
                document.body.style.overflow = 'hidden';
                comm.classList.add("anim-comm-cont");

            } else {
                setComments(<div className="container-fluid d-flex" style={{justifyContent: "center", alignItems: "center", height: "100%"}}>
                    <h3> Write first comment! </h3>
                </div>)
                setCommentID(post_id);
                const comm = document.querySelector(".comments");
                comm.classList.remove("anim-comm-cont-hide");
                comm.style.display = "block";
                document.body.style.overflow = 'hidden';
                document.querySelector(".layout-comm").style.display = "block";
                comm.classList.add("anim-comm-cont");
            }
        })
    }
    const handleDoubleClick = (id) => {
        const postLike = document.querySelector(`#like-${id}`);
        const likeIcon = document.getElementById(id)
        setClickCount(prev => {
            const newCount = prev + 1; 
    
            setTimeout(() => {
                if (newCount === 2) { 
                    if (postLike.classList.contains("like-post-anim")) {
                        postLike.classList.remove("like-post-anim"); 
                    }
                    setTimeout(() => {
                        postLike.classList.add("like-post-anim"); 
                        likeIcon.classList.remove("bi-heart");
                        likeIcon.classList.add("bi-heart-fill");
                        likeIcon.classList.add("liked");
                        const user_id = localStorage.getItem("id");
                        fetch(`${api}/api/like/${user_id}/${id}/`, {method: "POST"})
                        .then(response => response.json())
                        .then(data => getData())
                    }, 50)
                }
                setClickCount(0); 
            }, 300); 
    
            return newCount; 
        });
    };

    const del_post = (id) => {
        fetch(`${api}/api/del_post/${localStorage.getItem("id")}/${id}/`, {method: "DELETE"})
        .then(response => response.json())
        .then(data => {
            if (data.data){
                navigate(-1)
            }
            else {
                alert(data.error)
            }
        })
    }

    const getData = () => {
        fetch(`${api}/api/get_post/${localStorage.getItem("id")}/${id}/`)
        .then(response => response.json())
        .then(post =>  {
            post = post.post;
            setPostItem (
                <div className="post-recomendation" key={post.id}>
                        <div className="creator d-flex" style={{marginBottom: "20px", gap: "10px", position: "relative"}}>
                            <img src={`${api}/media/${post.avatar}`} alt="" style={{ width: "30px", height: "30px" ,objectFit:   "cover", borderRadius: "50%" }} />
                            <strong style={{cursor: "pointer"}} className="d-flex" onClick={() => navigate(`/user/${post.user_id}`)}>{post.username} {post.official === "True" ? <i class="bi bi-check-circle-fill" style={{color: "#13bfae", marginLeft: "5px"}}></i> : ""}</strong>
                            {localStorage.getItem("id") == post.user_id ? <i class="bi bi-three-dots" style={{position: "absolute", "right": 0, cursor: "pointer"}} onClick={toggleDropdown}></i> : ""}
                            <div id="drop" style={{
                                position: "absolute",
                                top: "100%",
                                right: "0",
                                display: "none",
                                backgroundColor: "white",
                                border: "1px solid #ddd",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                borderRadius: "5px",
                                zIndex: 1
                            }}>
                                <p style={{ padding: "10px", cursor: "pointer", margin: 0, color: "red" }} onClick={() => del_post(post.id)}>Delete</p>
                                
                            </div>
                            {post.geolocation && (<p style={{"border": "1px solid gray", gap: "10px", borderRadius: "10px", padding: "0", display: "flex", alignItems: "center",width: "fit-content", paddingRight: "10px", position: "absolute", right: "20px"}} className="container"><i class="bi bi-geo-alt-fill" style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px",  color: "white",fontSize: "20px",  paddingLeft: '5px', paddingRight: '5px',backgroundColor: "#114702"}}></i>{post.geolocation}</p>)}
                        </div>
                        <div className="content">
                            <div className="like-on-post"  id="post"  onClick={() => handleDoubleClick(post.id)} >
                                <i className="bi bi-heart-fill like-click" id={`like-${post.id}`} onClick={() => handleDoubleClick(post.id)} ></i>
                            </div>
                            <img id="post"  src={`${api}/media/${post.image}`} alt="" style={{height: "300px", objectFit: "cover" }} />
                        </div>
                        <div className="interaction d-flex mt-2" style={{gap: "20px", cursor: "pointer", fontSize: '20px'}}>
                        {post.liked === "True" ? <i class="bi bi-heart-fill liked" id={post.id} onClick={dislike}></i>: <i class="bi bi-heart" id={post.id} onClick={like}></i>}
                        <i className="bi bi-chat" onClick={() => getComments(post.id)}></i>
                        
                        </div>
                        <div className="count-likes">
                            <p>Likes: {post.likes}</p>
                        </div>
                        <div className="post-about">
                            {post.content ? <div className="d-flex" style={{gap: "10px"}}><strong>{post.username}</strong> <p>{post.content}</p></div> : <div></div>}
                        </div>
                        <p>{dateFormater(post.created_at)}</p>
                        <hr></hr>
                    </div>
            )
        })
    }
    function like (event) {
        event.currentTarget.classList.remove("bi-heart");
        event.currentTarget.classList.add("bi-heart-fill");
        event.currentTarget.classList.add("liked");
        const user_id = localStorage.getItem("id");
        const postID = event.currentTarget.id;
        fetch(`${api}/api/like/${user_id}/${postID}/`, {method: "POST"})
        .then(response => response.json())
        .then(data => getData())
        
    };
    function dislike(event){
        event.currentTarget.classList.remove("bi-heart-fill");
        event.currentTarget.classList.add("bi-heart");
        event.currentTarget.classList.remove("liked");
        const user_id = localStorage.getItem("id");
        const postID = event.currentTarget.id;
        fetch(`${api}/api/dislike/${user_id}/${postID}/`, {method: "POST"})
        .then(response => response.json())
        .then(data => getData());
    }
    const showModal = () => {
        document.querySelector(".modal-window").style.display = "flex";
    }
    const hideModal = () => {
        document.querySelector(".modal-window").style.display = "none";
    }
    const hide = () => {
        document.querySelector(".layout-comm").style.display = "none";
        const comm = document.querySelector(".comments");
        comm.classList.remove("anim-comm-cont")
        comm.classList.add("anim-comm-cont-hide")
        document.body.style.overflow = '';
      }
    useEffect(() => {
        getData()
    }, [])
    if (!postItem) {
        return (
            <div className="container d-flex justify-content-center mt-5" style={{height: "100vh"}}>
                Loading....
            </div>
        );
    }
    const handleNavigation = () => {
        navigate(-1);
    };
    return(
        <div className="container-fluid" >
            <i class="bi bi-arrow-left" style={{marginLeft: "10px", marginTop: "30px", fontSize: "30px", cursor: 'pointer'}} onClick={handleNavigation}></i>
            <div className="container d-flex justify-content-center mt-md-5 mt-2">
            <div>
                {postItem}
            </div>
            <div  className="layout-comm" onClick={hide}></div>
            <div className="comments container-fluid">
                <div className="con-line container-fluid">
                    <div className="line mt-2"></div>
                </div>
                <div className="text-con container-fluid mt-1">
                    <p style={{color: "white", paddingBottom: "0"}}>Comments</p>
                </div>
                <div className="main container-fluid">
                    <h3 style={{color: "white", display: "flex", justifyContent: "center", flexDirection: "column", gap: "5px"}}>              <div className="container-fluid" style={{height: "50vh", overflowY: "auto", overflowX: "hidden"}}>{comments}</div>           </h3>
                </div>
                <div className="d-flex comment container-fluid" style={{gap: "10px"}}>
                    <textarea type="text" id="comment" placeholder={`Add comment`}/>
                    <button className="btn btn-primary" ><i class="bi bi-arrow-up-short" onClick={writeComment} style={{fontSize: "20px"}}></i></button>
                </div>
                <div className="cotainer-fluid modal-window">
                            <div className="model-cont">
                                <strong style={{"color": "white"}}>Edit comment</strong>
                                <br />
                                <textarea placeholder="Edit" defaultValue={defEditText} id="tx-edit-com"></textarea>
                                <br />
                                <div className="d-flex" style={{"gap": "10px"}}>
                                    <button className="btn btn-secondary" onClick={hideModal}>Close</button>
                                    <button className="btn btn-success" onClick={editComment}>Edit</button>
                                </div>
                            </div>
                        </div>
            </div>
        </div>
        </div>
        
        
    )

};


export default Post;