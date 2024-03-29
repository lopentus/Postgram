import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React from "react";

function ProtectedProfileRoute({ children }) {
    const { profileId } = useParams();
    const auth = JSON.parse(localStorage.getItem("auth"));
    const loggedInUserId = auth.user.id;

    console.log(profileId, loggedInUserId)

    return loggedInUserId === profileId ? <>{children}</> : <Navigate to="/" />;
}

export default ProtectedProfileRoute;
