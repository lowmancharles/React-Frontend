import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

const initialPlayers = [
    {name: "Josh Allen", position: "QB", points: 24.5, id: 1},
    {name: "Jordan Love", position: "QB", points: 18.3, id: 2},
    {name: "Jamarr Chase", position: "WR", points: 15.2, id: 3},
    {name: "Parker Washington", position: "WR", points: 12.8, id: 4},
    {name: "Brock Bowers", position: "TE", points: 18.1, id: 5},
    {name: "Bayshal Tuten", position: "RB", points: 14.7, id: 6},
    {name: "Emmanual Wilson", position: "RB", points: 13.9, id: 7},
    {name: "Tyler Loop", position: "K", points: 10, id: 8},
];

function App() {
  const [count, setCount] = useState(0)
const [players, setPlayers] = useState(initialPlayers);
const [newPlayerName, setNewPlayerName] = useState("");
const [newPlayerPosition, setNewPlayerPosition] = useState("QB");
const [newPlayerPoints, setNewPlayerPoints] = useState(0);
const loadPlayers = async () => {
  const response = await fetch("http://localhost:8001/players");
  const data = await response.json();
  setPlayers(data);
};
useEffect(() => {
  loadPlayers();
}, []);
const qbs = players
.filter((player) => player.position === "QB")
.sort((a,b) => b.points - a.points)
.slice(0,1);
const rbs = players
.filter((player) => player.position === "RB")
.sort((a,b) => b.points - a.points)
.slice(0,2);
const wrs = players
.filter((player) => player.position === "WR")
.sort((a,b) => b.points - a.points)
.slice(0,2);
const tes = players
.filter((player) => player.position === "TE")
.sort((a,b) => b.points - a.points)
.slice(0,1);
const ks = players
.filter((player) => player.position === "K")
.sort((a,b) => b.points - a.points)
.slice(0,1);
const starters = [...qbs, ...rbs, ...wrs, ...tes, ...ks];
const flex = players
.filter((player) => !starters.includes(player))
.filter((player) => ["RB", "WR", "TE"].includes(player.position))
.sort((a,b) => b.points - a.points)
.slice(0,1);
const bench = players.filter((player) => !starters.includes(player) && !flex.includes(player));
  return (
    <>
      <h2>Quarterbacks</h2>
      <ul>
      {qbs.map((player) => (
        <li key={player.id}>{player.name} - {player.position} - {player.points}</li>
      ))}
      </ul>
      <h2>Running Backs</h2>
      <ul>
      {rbs.map((player) => (
        <li key={player.id}>{player.name} - {player.position} - {player.points}</li>
      ))}
      </ul>
      <h2>Wide Receivers</h2>
      <ul>
      {wrs.map((player) => (
        <li key={player.id}>{player.name} - {player.position} - {player.points}</li>
      ))}
      </ul>
      <h2>Tight Ends</h2>
      <ul>
      {tes.map((player) => (
        <li key={player.id}>{player.name} - {player.position} - {player.points}</li>
      ))}
      </ul>
      <h2>Kickers</h2>
      <ul>
      {ks.map((player) => (
        <li key={player.id}>{player.name} - {player.position} - {player.points}</li>
      ))}
      </ul>
      <h2>Flex</h2>
      <ul>
      {flex.map((player) => (
        <li key={player.id}>{player.name} - {player.position} - {player.points}</li>
      ))}
      </ul>
      <h2>Bench</h2>
      <ul>
      {bench.map((player) => (
        <li key={player.id}>{player.name} - {player.position} - {player.points}</li>
      ))}
      </ul>
      <input type="text" value={newPlayerName} onChange={(e) => setNewPlayerName(e.target.value)} placeholder="Enter player name" />
      <select value={newPlayerPosition} onChange={(e) => setNewPlayerPosition(e.target.value)}>
        <option value="QB">QB</option>
        <option value="RB">RB</option>
        <option value="WR">WR</option>
        <option value="TE">TE</option>
        <option value="K">K</option>
      </select>
      <input type="number" value={newPlayerPoints} onChange={(e) => setNewPlayerPoints(e.target.value)} placeholder="Enter player points" />
      <button onClick={async () => {
        if (newPlayerName === "" || isNaN(parseFloat(newPlayerPoints))) {
          alert("Please enter a valid player name and points.");
          return;
        }
        const response = await fetch("http://localhost:8001/players", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({name: newPlayerName, position: newPlayerPosition, points: parseFloat(newPlayerPoints)}),
        });
        if (!response.ok) {
          alert("Failed to save player.");
          return;
        }
        const newPlayer = await response.json();
        setPlayers([...players, newPlayer]);
      }}>
        Add Player
      </button>
      <button onClick={loadPlayers}>Load Players</button>
    </>
  )
}

export default App

