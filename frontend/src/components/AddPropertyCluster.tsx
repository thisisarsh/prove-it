import React, {useEffect, useState} from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Link, useNavigate} from "react-router-dom";
import {useAuthContext} from "../hooks/useAuthContext";
import {City, PropertyJSON, PropertyType, State, Zip} from "../types.ts";
import SearchableDropdown from "./DropDownList.tsx";
import "../styles/pages/addProperty.css";

export function AddPropertyCluster() {
    //TODO: Abstract the api calls, make this file less cluttered.

    const {state} = useAuthContext();
    const {user} = state;
    const navigate = useNavigate();
    console.log(user);

    const [states, setStates] = useState<State[]>([]);
    const [selectedState, setSelectedState] = useState<State | null>(null);

    const [citiesInState, setCitiesInState] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);

    const [zipsInCity, setZipsInCity] = useState<Zip[]>([]);
    const [selectedZip, setSelectedZip] = useState<Zip | null>(null);

    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [selectedPropertyType, setSelectedPropertyType] =
        useState<PropertyType | null>(null);

    const [propertyName, setPropertyName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [rentAmount, setRentAmount] = useState<string>("");

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<string>>,
    ) => {
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
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log(response.json);
                return response.json();
            })
            .then((data) => {
                setStates(data);
                console.log(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleStateSelect = (selectedState: State) => {
        setSelectedState(selectedState);
        console.log("SELECTED STATE");
        console.log(selectedState);

        localStorage.setItem(
            "addPropertySelectedState",
            JSON.stringify(selectedState),
        );

        //Send a POST request to the API with the selected option
        fetch(
            import.meta.env.VITE_SERVER +
            "/city?" +
            new URLSearchParams({stateId: selectedState.id}),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log(response);
                return response.json();
            })
            .then((returnedCities) => {
                console.log("Backend response:", returnedCities);
                setCitiesInState(returnedCities);
            })
            .catch((error) => console.error("Error updating data:", error));
    };

    const handleCitySelect = (selectedCity: City) => {
        setSelectedCity(selectedCity);
        localStorage.setItem(
            "addPropertySelectedCity",
            JSON.stringify(selectedCity),
        );
        fetch(
            import.meta.env.VITE_SERVER +
            "/zip?" +
            new URLSearchParams({cityId: selectedCity.cityId}),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            },
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log(response);
                return response.json();
            })
            .then((returnedZipObjects) => {
                console.log("Backend response:", returnedZipObjects);
                setZipsInCity(returnedZipObjects);
            })
            .catch((error) => console.error("Error updating data:", error));
    };

    const handleZipSelect = (selectedZipObj: Zip) => {
        setSelectedZip(selectedZipObj);
        localStorage.setItem(
            "addPropertySelectedZip",
            JSON.stringify(selectedZipObj),
        );
        fetch(import.meta.env.VITE_SERVER + "/propertytypes", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user!.token,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log(response);
                return response.json();
            })
            .then((returnedPropertyTypes) => {
                console.log("Backend response:", returnedPropertyTypes);
                setPropertyTypes(returnedPropertyTypes);
            })
            .catch((error) => console.error("Error updating data:", error));
    };

    const handlePropertyTypeSelect = (selectedPropertyType: PropertyType) => {
        setSelectedPropertyType(selectedPropertyType);
        localStorage.setItem(
            "addPropertySelectedType",
            JSON.stringify(selectedPropertyType),
        );
    };

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        const createPropertyJSON: PropertyJSON = {
            countyId: selectedCity?.countyId,
            cityId: selectedCity?.cityId,
            stateId: selectedState!.id,
            zipcodeId: selectedZip?.zipId,
            userId: user?.id,
            propertyTypeId: selectedPropertyType!.propertyTypeId,
            ownerId: user?.id,
            name: propertyName,
            streetAddress: address,
            rent: rentAmount,
            isPrimary: true,
            canTenantInitiate: true,
            status: "active",
            registrationFee: 0,
        };

        console.log(createPropertyJSON);

        //Post the property object to the server.
        fetch(import.meta.env.VITE_SERVER + "/addproperty", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify(createPropertyJSON),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log(response);
                return response.json();
            })
            .then((responseJson) => {
                console.log("Backend response:", responseJson);
                if (responseJson.isSuccess) {
                    alert("Property successfully added");
                    navigate("/dashboard");
                } else if (!responseJson.isSuccess) {
                    alert(responseJson.message);
                }
            })
            .catch((error) => console.error("Error updating data:", error));
    };

    return (
        <div className=" main_addProperty">
            {/* Dropdown to select the US state */}
            <SearchableDropdown
                items={states}
                onSelect={handleStateSelect}
                placeholder={selectedState ? selectedState.name : "Select a State"}
                labelKey="name"
            />

            {/*Dropdown to select city within the selected state*/}
            {selectedState && (
                <SearchableDropdown
                    items={citiesInState}
                    onSelect={handleCitySelect}
                    placeholder={selectedCity ? selectedCity.name : "Select a City"}
                    labelKey="name"
                />
            )}

            {/*Dropdown to select the ZIP code*/}
            {selectedCity && (
                <SearchableDropdown
                    items={zipsInCity}
                    onSelect={handleZipSelect}
                    placeholder={selectedZip ? selectedZip.code : "Enter a ZIP"}
                    labelKey="code"
                />
            )}

            {/*Dropdown to select the property type*/}
            {selectedZip && (
                <SearchableDropdown
                    items={propertyTypes}
                    onSelect={handlePropertyTypeSelect}
                    placeholder={selectedPropertyType ? selectedPropertyType.name : "Select a Property Type"}
                    labelKey="name"
                />
            )}

            <div className="forms">
                <Form>
                    <Form.Group controlId="propertyName">
                        <Form.Label>Property Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter property name"
                            value={propertyName}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setPropertyName)}
                        />
                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setAddress)}
                        />
                    </Form.Group>

                    <Form.Group controlId="rentAmount">
                        <Form.Label>Rent Amount</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter rent amount"
                            value={rentAmount}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleInputChange(e, setRentAmount)}
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="submitButton"
                        onClick={(e: React.MouseEvent) => handleSubmit(e)}
                    >
                        Submit
                    </Button>
                    <Link to="/dashboard" className="goBackLink">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="goBackButton"
                        >
                            <span>Go Back</span>
                        </Button>
                    </Link>
                </Form>
            </div>
        </div>
    );
}
