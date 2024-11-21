import React from 'react';
import { useState, useEffect } from 'react';
import Nav from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from '../utils/handleLogout';
import { getUsername } from '../utils/localStorage';
import './Profile.css'

function Profile() {
    const navigate = useNavigate();  
    const [users, setUsers] = useState([]);
    const username = getUsername();

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:80/getuser/${username}`);
            const data = await response.json();
            if(response.ok){
                setUsers(data);
            }
            else{
                console.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [username]);

    document.getElementById("exp").style.opacity = 0;
    return (
        <>
        ${Nav()}
        <div className="profile">
        <h1>Profile</h1>
        <div className='profile_info'>
            <p>Name: {users.fullname}</p>
            <p>Username: {users.username}</p>
            <p>Email: {users.email}</p>
            <button className='logout_profile' onClick={(e) => handleLogout(e, navigate)}>Log Out</button>
        </div>
        </div>
        </>
    );
}

export default Profile;
