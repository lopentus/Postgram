import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Home from "./pages/Home";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import SinglePost from "./pages/SinglePost";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import JoinChat from "./components/chats/JoinChat";
import ProtectedProfileRoute from "./routes/ProtectedProfileRoute";
import Chats from "./pages/Chats";

function App() {
    return (
        <Routes>
            <Route path="/profile/:profileId/edit/"
                   element={
                <ProtectedRoute>
                    <ProtectedProfileRoute>
                        <EditProfile />
                    </ProtectedProfileRoute>
                </ProtectedRoute>
            } />
            <Route path="/profile/:profileId/" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            <Route path="/" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
            <Route path="/chats/" element={
                <ProtectedRoute>
                    <Chats />
                </ProtectedRoute>
            } />
            <Route path="/post/:postId/" element={
                    <ProtectedRoute>
                        <SinglePost />
                    </ProtectedRoute>
                }
            />
            <Route path="/chat/:roomName/" element={
                    <ProtectedRoute>
                        <JoinChat />
                    </ProtectedRoute>
                }
            />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Registration />} />
        </Routes>
    );
}

export default App;
