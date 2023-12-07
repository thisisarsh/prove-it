import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/pages/addProperty.css';

export function AddPropertyCluster() {
  //TODO: Abstract the api calls, make this file less cluttered.

  const { state } = useAuthContext();
  const { user } = state;
  console.log(user);

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);

  const [citiesInState, setCitiesInState] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [zipsInCity, setZipsInCity] = useState([]);
  const [selectedZip, setSelectedZip] = useState(null);

  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);

  const [propertyName, setPropertyName] = useState([]);
  const [address, setAddress] = useState([]);
  const [rentAmnt, setRentAmnt] = useState([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();
    setter(e.target.value);
  };

  // ABSCTRACTION OF THE API CALLS (WIP)
  // console.log(states);
  // const fetchData = (method: string, address: string, callback : (data: () => Promise<any>) => void) => {
  //   console.log('Fetching data...')
  //   fetch(address, {
  //     method: method,
  //     headers: {'Content-Type': 'application/json'}
  //   })
  //   .then((response => {
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     return response.json;
  //   }))
  //   .then(data => callback(data))
  //   .catch(error => console.error('Error fetching data:', error));
  // }

  useEffect(() => {
    //Implementation of API call abstraction (WIP)
    //const stateAddress = import.meta.env.VITE_SERVER + '/state';
    // fetchData('GET', stateAddress, data => {
    //   console.log(data);
    //   setStates(data);
    // });
    fetch(import.meta.env.VITE_SERVER + "/state")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response.json);
        return response.json();
      })
      .then(data => {
        setStates(data)
        console.log(data);
      })
      .catch(error => console.error('Error fetching data:', error));
    
  }, []);

  const handleStateSelect = (selectedState) => {
      setSelectedState(selectedState);
      console.log('SELECTED STATE')
      console.log(selectedState);
      
      localStorage.setItem('addPropertySelectedState', JSON.stringify(selectedState));

      //Send a POST request to the API with the selected option
      fetch(import.meta.env.VITE_SERVER + "/city?" + new URLSearchParams({stateId: selectedState.id}), {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              },
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
                  }
              console.log(response);
              return response.json();
          })
      .then((returnedCities) => {
        console.log('Backend response:', returnedCities);
        setCitiesInState(returnedCities);
      })
      .catch(error => console.error('Error updating data:', error));
    };

  const handleCitySelect = (selectedCity) => {
    setSelectedCity(selectedCity);
    localStorage.setItem('addPropertySelectedCity', JSON.stringify(selectedCity))
    fetch(import.meta.env.VITE_SERVER + "/zip?" + new URLSearchParams({cityId: selectedCity.cityId}), {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          },
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          console.log(response);
          return response.json();
      })
    .then((returnedZipObjects) => {
      console.log('Backend response:', returnedZipObjects)
      setZipsInCity(returnedZipObjects);
    })
    .catch(error => console.error('Error updating data:', error));
    };

  const handleZipSelect = (selectedZipObj) => {
    setSelectedZip(selectedZipObj);
    localStorage.setItem('addPropertySelectedZip', JSON.stringify(selectedZipObj));
    fetch(import.meta.env.VITE_SERVER + "/propertytypes", {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.token,
          },
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
              }
          console.log(response);
          return response.json();
      })
    .then(returnedPropertyTypes => {
      console.log('Backend response:', returnedPropertyTypes);
      setPropertyTypes(returnedPropertyTypes);
    })
    .catch(error => console.error('Error updating data:', error));
  };

  const handlePropertyTypeSelect = (selectedPropertyType) => {
    setSelectedPropertyType(selectedPropertyType);
    localStorage.setItem('addPropertySelectedType', JSON.stringify(selectedPropertyType));
  }

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    let createPropertyJSON = {
      countyId: selectedCity?.countyId,
      cityId: selectedCity?.cityId,
      stateId: selectedState.id,
      zipcodeId: selectedZip?.zipId,
      userId: user?.id,
      propertyTypeId: selectedPropertyType.propertyTypeId,
      ownerId: user?.id,

      name: propertyName,
      streetAddress: address,
      rent: rentAmnt,
      isPrimary: true,
      canTenantInitiate: true,
      status: "active",
      registrationFee: 0
    }

    console.log(createPropertyJSON);

    //Post the property object to the server.
    fetch(import.meta.env.VITE_SERVER + "/addproperty", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user?.token,
          },
      body: JSON.stringify(createPropertyJSON),
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
              }
          console.log(response);
          return response.json();
      })
    .then(responseJson => {
      console.log('Backend response:', responseJson);
      if (responseJson.isSuccess) {
        alert('Property successfully added');
      }
    })
    .catch(error => console.error('Error updating data:', error));
  }

  return (
    <div className = " main_addProperty">
      {/* Dropdown to select the US state */}
      <Dropdown className="locationDropdown">
        <Dropdown.Toggle variant="success" id="state-dropdown">
          {selectedState ? selectedState.name : 'Select a State'}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {states.map(americanState => (
            <Dropdown.Item key={americanState.stateCode} onClick={() => handleStateSelect(americanState)}>
              {americanState.name} ({americanState.stateCode})
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/*Dropdown to select city within the selected state*/}
      {selectedState && (
        <Dropdown className="locationDropdown">
          <Dropdown.Toggle variant="success" id="city-dropdown">
            {selectedCity ? selectedCity.name : 'Select a City'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {citiesInState.map(city => (
              <Dropdown.Item key={city.name} onClick={() => handleCitySelect(city)}>
                {city.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/*Dropdown to select the ZIP code*/}
      {selectedCity && (
        <Dropdown className="locationDropdown">
          <Dropdown.Toggle variant="success" id="zip-dropdown">
            {selectedZip ? selectedZip.code : 'Enter a ZIP'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {zipsInCity.map(zipObject => (
              <Dropdown.Item key={zipObject.code} onClick={() => handleZipSelect(zipObject)}>
                {zipObject.code}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}

      {/*Dropdown to select the property type*/}
      {selectedZip && (
        <Dropdown className="locationDropdown">
          <Dropdown.Toggle variant="success" id="property-type-dropdown">
            {selectedPropertyType ? selectedPropertyType.name : 'Select a Property Type'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {propertyTypes.map(propertyType => (
              <Dropdown.Item key={propertyType.propertyTypeId} onClick={() => handlePropertyTypeSelect(propertyType)}>
                {propertyType.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}

      <div className="forms">
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

          <Button variant="primary" type="submit" className="submitButton" onClick={(e: React.MouseEvent) => handleSubmit(e)}>
            Submit
          </Button>
          <Link to="/dashboard" className="goBackLink">
            <Button variant="outline-primary" size="sm" className="goBackButton">
              <span>Go Back</span>
            </Button>
          </Link>
        </Form>
      </div>
    </div>
  );
}