import React, { useEffect, useState } from "react";

function Leaderboard({ socket }) {
  const [users, setUsers] = useState([]);

  const leaderStyle = {
    backgroundColor: "whiteSmoke",
    padding: "1rem",
    color: "black",
    borderRadius: "10px",
    height: "20rem",
    marginBottom:'2rem',
    overflowY:'auto',
  };

  const userStyle = {
    display: "flex",
    justifyContent: "space-between",
    margin: "0 auto",
    overflowY: "auto",
    gap: "1rem",
    minWidth: "10rem",
  };

  useEffect(() => {
    if (!socket) return;

    const handleConnectedUser = (data) => {
      // Sort users by points in descending order
      const sortedUsers = data.userInfo.sort((a, b) => b.point - a.point);
      setUsers(sortedUsers);
    };

    socket.on("connected-user", handleConnectedUser);

    return () => {
      socket.off("connected-user", handleConnectedUser);
    };
  }, [socket]);

  return (
    <div style={leaderStyle}>
      <h3>Leaderboard </h3>
      <div style={userStyle}>
        <div>Rank</div>
        <div>Name</div>
        <div>Score</div>
      </div>
      {users.map((user, index) => (
        <div style={userStyle} key={index}>
          <div>{index + 1}</div>
          <div>{user.name}</div>
          <div>{user.point}</div>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
