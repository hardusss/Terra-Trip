import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../img/icons/logo.png";

const NavigateBar = () => {
    const navigate = useNavigate();
    const api = 'http://127.0.0.1:8000';
    const [avatarSrc, setAvatarSrc] = useState(`${api}/media/images/default.png`);
    const [searchIcon, setSearchIcon] = useState('bi-search');
    const [addPostIcon, setAddPostIcon] = useState('bi-plus-square');
    const [homeIcon, setHomeIcon] = useState('bi-house-door');

    useEffect(() => {
        const user_id = localStorage.getItem("id")
        fetch(`${api}/api/get/${user_id}/`)
        .then((response) => response.json())
        .then((data) => {
            setAvatarSrc(`${api}/media/${data.avatar}`)
        })
    }, [])

    const select = (e) => {

        if (e === "search") {
            navigate("/search");
            setSearchIcon("bi-search-heart-fill");
            setAddPostIcon("bi-plus-square")
            setHomeIcon("bi-house-door")
        } else if (e === "home") {
            navigate("/home");
            setAddPostIcon("bi-plus-square")
            setSearchIcon("bi-search")
            setHomeIcon('bi-house-door-fill')
        } else if (e === "profile"){
            setAddPostIcon("bi-plus-square")
            setHomeIcon("bi-house-door")
            setSearchIcon("bi-search")
            navigate("/profile")
        } else if(e === "add"){
            setAddPostIcon("bi-plus-square-fill")
            setSearchIcon("bi-search")
            setHomeIcon('bi-house-door')
            navigate("/post/create")
        }
    };

    return (
        <div className="nav-cont sticky-md-top ">
            <div className="d-md-flex d-none">
                <img src={Logo} alt="" style={{objectFit: "cover"}}/>
                <h3 className="logo-text" style={{paddingTop: "30px"}}>Terra Trip</h3>
            </div>
            <div className="navigation">
                <div 
                    className={`home nav-item `}
                    onClick={() => select("home")}
                >
                    <i className={`bi ${homeIcon}`} style={{ fontSize: "30px" }}></i>
                    <p className="mt-3 d-none d-md-flex">Home</p>
                </div>
                <div 
                    className={`search-nav nav-item`} 
                    onClick={() => select("search")}
                >
                    <i className={`bi ${searchIcon}`} style={{ fontSize: "30px" }}></i>
                    <p className="mt-2 d-none d-md-flex">Search</p>
                </div>

                <div 
                    className={`add-nav nav-item `} 
                    onClick={() => select("add")}
                >
                    <i class={`bi ${addPostIcon}`} id="add-icon" style={{fontSize: "30px", marginLeft: "2px"}}></i>
                    <p className="mt-3 d-none d-md-flex">Add post</p>
                </div>

                <div 
                    className={`profile-nav nav-item`} 
                    onClick={() => select("profile")}
                >
                    <img src={avatarSrc} alt="" width="40px" height="40px" style={{ borderRadius: "50%", objectFit: "cover" }} />
                    <p className="mt-3 d-none d-md-flex ">Profile</p>
                </div>
            </div>

        </div>
    );
}
export default NavigateBar;