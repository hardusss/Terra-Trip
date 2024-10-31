import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [accountsSearch, setAccountsSearch] = useState([]);
    const navigate = useNavigate();
    const api = 'http://127.0.0.1:8000'
    const clear = () => {
        const search = document.getElementById("search-field");
        search.value = '';
        setAccountsSearch([<div key="no-accounts" className='no-acc'><h3>No accounts</h3></div>])
    }
    const searchAccounts = async () => {
        const start = document.getElementById("search-field").value;
        if (start.trim() !== '') {
            const request = await fetch(`${api}/api/search/${start}/`, {
                method: "GET"
            });
            const response = await request.json();
            try {
            if (response.users.length > 0) {
                const user_id = localStorage.getItem("id")
                const accountsList = response.users
                    .filter((user) => user.id !== Number(user_id)) 
                    .map((user) => (
                        <div key={user.id} className='d-flex account' onClick={() => navigate(`/user/${user.id}`)} style={{marginTop: "10px", borderBottom: "1px solid gray", paddingBottom: "10px"}}>
                            <img src={`${api}/media/${user.avatar}`} alt="" style={{ width: '60px', height: '60px', objectFit: "cover", borderRadius: "50%"}}/>
                            <div style={{display: "flex", flexDirection: "column", marginLeft: "10px", marginTop: "5px"}}>
                                <strong style={{ width: "fit-content", height: "fit-content"}}>{user.username} {user.official === "True" ? <i class="bi bi-check-circle-fill" style={{color: "#13bfae"}}></i> : ""} </strong>    
                                <p style={{ margin: 0 , padding: 0, width: "fit-content", height: "fit-content", color: "gray", fontSize: "12px"}}>I am from {user.country}</p>
                            </div>
                        </div>
                    ));

                setAccountsSearch(accountsList);
            } else {
                setAccountsSearch([<div key="no-accounts" className='no-acc'><h3>No accounts</h3></div>]);
            }
        } catch (e){setAccountsSearch([])}
        } else {
            setAccountsSearch([<div key="no-accounts" className='no-acc'><h3>No accounts</h3></div>]);
        }
    };
    

    return (
        <div className="search container">
            <div className="input-group">
                <div className="input-group-prepend">
                    <span className="input-group-text">
                        <i className="bi bi-search" style={{ color: "black", cursor: "pointer   " }}></i>
                    </span>
                </div>
                <input 
                    type="text" 
                    className="form-control"  
                    placeholder="search" 
                    id="search-field" 
                    onKeyUp={searchAccounts} 
                />
                <i class="bi bi-x" color='black' onClick={clear} style={{"position": "absolute", "right": "10px", "z-index": "9999", "font-size": "25px"}}></i>
            </div>
            <div className='container'>
                {accountsSearch.length > 0 ? accountsSearch : <div className='no-acc'><h3>No accounts</h3></div>}
            </div>
        </div>
    );
};

export default Search;
