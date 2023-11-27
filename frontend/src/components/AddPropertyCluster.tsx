/**
 * use /state to test state dropdown
 */
import { useState } from "react";
import { useEffect } from "react";
import { Dropdown } from 'react-bootstrap';
//import { useGetState } from "../hooks/useGetStates";

/**
 * Handles signup buttons, input boxes
 * @returns Void
 */
export function AddPropertyCluster() {
    const [state, setState] = useState([]);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
      // Fetch data from an API
      fetch(import.meta.env.VITE_SERVER + "/state")
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setState(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleStateSelect = (option) => {
        setSelectedState(option);
        // Send a POST request to the API with the selected option
        fetch(import.meta.env.VITE_SERVER + "/setstate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(option),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                    }
                return response.json();
            })
        .then(data => console.log('Backend response:', data))
        .catch(error => console.error('Error updating data:', error));
      };
  
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                {selectedState ? selectedState.name : 'Select an Option'}   
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {state.map(option => (
                    <Dropdown.Item key={option.stateCode} onClick={() => handleStateSelect(option)}>
                        {option.name} ({option.stateCode})
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
  }
