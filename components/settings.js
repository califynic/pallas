import React, { useState, useEffect } from 'react'
import { fetchP } from './login'

import EmailSettings from './settings/email'

export default function Settings(props) {
    const [currentUser, setCurrentUser] = useState({username: "", email: ""});

    useEffect(() => {
		fetch("/api/priv/user-info?" + new URLSearchParams({
			"secret_token": localStorage.getItem("token")
		})).then(res => {
            if (res.ok) {
                res.json().then(res => { setCurrentUser(res.user); });
            } else {
                throw new Error(res.status)
            };
        });
    });

    return (
        <div id="settings">
            <h1>Settings</h1>

            <h2>User</h2>

            <h4>Username</h4>
            <p className="settings-field">{currentUser.username}</p>
            <p><i>To change your username, please contact the webmaster.</i></p>

            <h4>Email</h4>
            <EmailSettings email={currentUser.email} />

            <h4>Password</h4>
            <button>Change password</button>
        </div>
    );
}
