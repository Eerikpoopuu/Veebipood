import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [kogus, setKogus] = useState(0);
  const [autod, setAutod] = useState([]);
  const [autoomanikud, setAutoomanikud] = useState([]);

  const markRef = useRef();
  const mudelRef = useRef();
  const priceRef = useRef();
  const OnRenditudRef = useRef();
  const aTootjaRef = useRef();
  const omanikRef = useRef();

  useEffect(() => {
    fetchAutoData();
    fetchRentijaData();
  }, []);

  const fetchAutoData = () => {
    fetch("https://localhost:7024/Auto")
      .then(response => response.json())
      .then(json => {
        setKogus(json.length);
        setAutod(json);
      })
      .catch(error => console.error('Error fetching autod:', error));
  }

  const fetchRentijaData = () => {
    fetch("https://localhost:7024/Rentija")
      .then(response => response.json())
      .then(json => {
        setAutoomanikud(json);
      })
      .catch(error => console.error('Error fetching autoomanikud:', error));
  }

  const deleteAuto = (primaarvoti) => {
    fetch(`https://localhost:7024/Auto/${primaarvoti}`, { method: "DELETE" })
      .then(response => response.json())
      .then(json => {
        setKogus(json.length);
        setAutod(json);
      })
      .catch(error => console.error('Error deleting auto:', error));
  }

  const deleteRentija = (primaarvoti) => {
    fetch(`https://localhost:7024/rentija/${primaarvoti}`, { method: "DELETE" })
      .then(response => response.json())
      .then(json => {
        setAutoomanikud(json);
      })
      .catch(error => console.error('Error deleting autoomanik:', error));
  }

  const addAuto = () => {
    if (markRef.current.value.trim() === "") {
      return;
    }
    const auto = {
      "mark": markRef.current.value,
      "mudel": mudelRef.current.value,
      "price": priceRef.current.value,
      "Rendi staatus": OnRenditudRef.current.value
    }
    fetch("https://localhost:7024/Auto", {
      "method": "POST",
      "body": JSON.stringify(auto),
      "headers": { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        setKogus(json.length);
        setAutod(json);
      })
      .catch(error => console.error('Error adding auto:', error));
  }

  const addRentija = () => {
    const lisatavAO = {
      "auto": { "mark": aTootjaRef.current.value },
      "omanik": omanikRef.current.value
    }
    fetch("https://localhost:7024/Rentija", {
      "method": "POST",
      "body": JSON.stringify(lisatavAO),
      "headers": { "Content-Type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        setAutoomanikud(json);
      })
      .catch(error => console.error('Error adding autoomanik:', error));
  }

  document.body.style.backgroundColor = "beige";

      return (
        <div className="App">
        <h2 className="bigHeader">Rendiautode andmebaas</h2>
        <h3 className="mediumHeader">Meil on {kogus} autot rendis</h3>
        <h4 classname="smallHeader">Sisesta auto rentimiseks: </h4>
        <br /><br />

      <label>Automark</label> <br />
      <input ref={markRef} type="text" /> <br />

      <label>Automudel</label> <br />
      <input ref={mudelRef} type="text" /> <br />

      <label>Auto hind</label> <br />
      <input ref={priceRef} type="text" /> <br />

      <label>Auto rendile</label> <br />
      <input ref={OnRenditudRef} type='checkbox' /> <br />

      <button onClick={addAuto}>Sisesta</button> <br />
      <br />

      {autod.map(auto => (
        <div key={auto.id}>
          {auto.mark} ||  <button onClick={() => deleteAuto(auto.id)}>x</button>
        </div>
      ))}

      <hr />

      <label>Rentija (Täpne nimi andmebaasist)</label><br />
      <input ref={aTootjaRef} type='text' /> <br />

      <button onClick={addRentija}>Sisesta</button> <br />
      <br />

      {autoomanikud.map(rentija => (
        <div key={rentija.id}>
          {rentija.id} | {rentija.auto?.tootja} | {rentija.omanik} <button onClick={() => deleteRentija(rentija.id)}>x</button>
        </div>
      ))}

    </div>
  );
}

export default App;
