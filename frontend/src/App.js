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
import ChooseChat from "./components/chats/ChooseChat";
import Chat from "./components/chats/Chat";

function App() {
    return (
        <Routes>
            <Route path="/profile/:profileId/edit/"
                   element={
                <ProtectedRoute>
                    <EditProfile />
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
            <Route path="/post/:postId/" element={
                    <ProtectedRoute>
                        <SinglePost />
                    </ProtectedRoute>
                }
            />
            <Route path="/chat/" element={
                    <ProtectedRoute>
                        <ChooseChat />
                    </ProtectedRoute>
                }
            />
            <Route path="/chat/:roomName/" element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                }
            />
            <Route path="/login/" element={<Login />} />
            <Route path="/register/" element={<Registration />} />
        </Routes>
    );
}

export default App;
