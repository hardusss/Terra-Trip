import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";

const CreatePost = () => {
    const [imgSRC, setImgSRC] = useState(null);
    const api = 'http://127.0.0.1:8000';
    const fileInputRef = useRef(null);
    const aboutRef = useRef(null);
    const geoRef = useRef(null);
    const navigate = useNavigate();
    const formPostRef = useRef(new FormData());  

    const openFile = () => {
        fileInputRef.current?.click();
    };

    const changeFile = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            setImgSRC(imgUrl);
            formPostRef.current.append("post", file);
        }
    };

    const sendData = () => {
        const about = aboutRef.current.value.trim();
        const geo = geoRef.current.value.trim();

        if (about.length > 0) {
            formPostRef.current.append("about", about);
        }
        if (geo.length > 0) {
            formPostRef.current.append("geo", geo);
        }

        for (let pair of formPostRef.current.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const user_id = localStorage.getItem("id");

        $.ajax({
            url: `${api}/api/create_post/${user_id}/`, 
            method: 'POST',
            data: formPostRef.current,
            processData: false, 
            contentType: false,
            success: function (response) {
                alert('Post created successfully');
                navigate("/profile");
            },
            error: function (err) {
                alert('Failed to create post. Please try again.');
                console.error('Failed to create post:', err);
            }
        });
    };

    return (
        <div className="container create-post">
            <div className="load-post mt-4" style={{ textAlign: "center" }}>
                <h3>Create the post</h3>
                {imgSRC ? (
                    <img src={imgSRC} alt="Post preview" id="post" style={{ width: "300px", height: "300px", objectFit: "cover" }} />
                ) : (
                    <p className="mt-3">You have not selected a photo yet</p>
                )}
                <input
                    type="file"
                    className="d-none"
                    ref={fileInputRef}
                    onChange={changeFile}
                />
                <br />
                <button className="btn btn-primary mt-3" onClick={openFile}>
                    Select photo
                </button>
                <br />
                <div className="d-flex mt-3" style={{ gap: "10px" }}>
                    <i className="bi bi-chat-square-text-fill mt-4"></i>
                    <textarea
                        ref={aboutRef}
                        className="form-control mt-3"
                        placeholder="Write about post"
                        maxLength={200}
                        style={{
                            borderRadius: "10px",
                            resize: "none",
                            height: "130px",
                            padding: "10px",
                        }}
                    />
                </div>
                <div className="d-flex mt-3" style={{ gap: "10px" }}>
                    <i className="bi bi-geo-alt-fill mt-1"></i>
                    <input ref={geoRef} className="form-control" placeholder="Add location" />
                </div>
                <button className="btn btn-outline-dark mt-4" onClick={sendData}>
                    Create post
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
