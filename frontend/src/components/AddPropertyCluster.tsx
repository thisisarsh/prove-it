import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export function AddPropertyCluster() {
  const [states, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [zip, setZip] = useState([]);
  const [propertyName, setPropertyName] = useState([]);
  const [address, setAddress] = useState([]);
  const [rentAmnt, setRentAmnt] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZip, setSelectedZip] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    setter(e.target.value);
  };


  useEffect(() => {
    // Fetch data from an API
    fetch(import.meta.env.VITE_SERVER + "/state")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response.json);
        return response.json();
      })
      .then(data => setState(data))
      .catch(error => console.error('Error fetching data:', error));
    
  }, []);

  const handleStateSelect = (json) => {
      setSelectedState(json);
      // Send a POST request to the API with the selected option
      fetch(import.meta.env.VITE_SERVER + "/setstate", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              },
              body: JSON.stringify(json),
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
                  }
              console.log(response);
              return response.json();
          })
      .then(data => console.log('Backend response:', data))
      .catch(error => console.error('Error updating data:', error));
    };
  
  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER + "/city")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response.json);
        return response.json();
      })
      .then(data => setCity(data))
      .catch(error => console.error('Error fetching cities:', error));
   }, []);

  const handleCitySelect = (json) => {
    setSelectedCity(json);
    fetch(import.meta.env.VITE_SERVER + "/setcity", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(json),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
              }
          console.log(response);
          return response.json();
      })
    .then(data => console.log('Backend response:', data))
    .catch(error => console.error('Error updating data:', error));
  };

  useEffect(() => {
    fetch(import.meta.env.VITE_SERVER + "/zip")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response.json);
        return response.json();
      })
      .then(data => setZip(data))
      .catch(error => console.error('Error fetching cities:', error));
  
  }, []);

  const handleZipSelect = (json) => {
    setSelectedZip(json);
    fetch(import.meta.env.VITE_SERVER + "/setzip", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(json),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
              }
          console.log(response);
          return response.json();
      })
    .then(data => console.log('Backend response:', data))
    .catch(error => console.error('Error updating data:', error));
  };

  console.log('City:', city);
  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="state-dropdown">
          {selectedState ? selectedState.name : 'Select a State'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {states.map(json => (
            <Dropdown.Item key={json.stateCode} onClick={() => handleStateSelect(json)}>
              {json.name} ({json.stateCode})
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {selectedState && (
        <Dropdown className="mt-2">
          <Dropdown.Toggle variant="success" id="city-dropdown">
            {selectedCity ? selectedCity.name : 'Select a City'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {city.map(json => (
              <Dropdown.Item key={json.name} onClick={() => handleCitySelect(json)}>
                {json.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
      {selectedCity && (
        <Dropdown className="mt-2">
          <Dropdown.Toggle variant="success" id="city-dropdown">
            {selectedZip ? selectedZip.code : 'Enter a ZIP'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {zip.map(json => (
              <Dropdown.Item key={json.code} onClick={() => handleZipSelect(json)}>
                {json.code}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
      <div className="mt-2">
        <Form>
          <Form.Group controlId="propertyName">
            <Form.Label>Property Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter property name"
              value={propertyName}
              onChange={(e) => handleInputChange(e, setPropertyName)}
            />
          </Form.Group>

          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => handleInputChange(e, setAddress)}
            />
          </Form.Group>

          <Form.Group controlId="rentAmnt">
            <Form.Label>Rent Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter rent amount"
              value={rentAmnt}
              onChange={(e) => handleInputChange(e, setRentAmnt)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}