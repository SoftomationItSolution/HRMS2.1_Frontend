import React, { useState, useEffect } from 'react';
import { Card} from "antd";
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './style.css';
import { useMapEvents } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import axios from 'axios';
import cityDataJson from './cityData.json';

import getSetting from "../../api/getSettings";


delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const OfficePage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [map, setMap] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [createdShapeCoordinates, setCreatedShapeCoordinates] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [customCoordinates, setCustomCoordinates] = useState({ lat: '', lon: '' });
  const [officeNames, setOfficeNames] = useState([]); // State to store office names
  const [officeDetails, setOfficeDetails] = useState(null);
  const [selectedOffice, setSelectedOffice] = useState('');



  // const handleCityChange = (e) => {
  //   const selectedCityKey = e.target.value;
  //   setSelectedCity(selectedCityKey);

  //   const selectedCityData = cityDataJson.cityData.find((city) => city.name === selectedCityKey);

  //   if (selectedCityData) {
  //     const newLocation = [parseFloat(selectedCityData.lat), parseFloat(selectedCityData.lon)];
  //     setUserLocation(newLocation);
  //     if (map) {
  //       map.flyTo(newLocation, 6);
  //     } else {
  //       console.error('Map is null or undefined.');
  //     }
  //   }
  // };

  const handleOfficeChange = async (selectedOffice) => {
    setSelectedOffice(selectedOffice);
 
    try {
      const response = await axios.get(`setting/getOfficeDetails?officeName=${selectedOffice}`);
      const officeData = response.data; // Assuming the API returns the office details in the expected format
  
      if (officeData) {
        setOfficeDetails(officeData);
       
      }
    } catch (error) {
      console.error('Error fetching office details:', error.message);
    }
  };
  

  const handleEnteredCoordinates = () => {
    // Update the map with the custom coordinates entered by the user
    const newLocation = [parseFloat(customCoordinates.lat), parseFloat(customCoordinates.lon)];

    // Update the user location and fly to the new coordinates
    setUserLocation(newLocation);
    if (map) {
      map.flyTo(newLocation, map.getZoom());
    } else {
      console.error('Map is null or undefined.');
    }
  };

  const updateMapWithOffice = () => {
    try {
      const selectedOfficeData = officeDetails;
      if (selectedOfficeData) {
        setUserLocation([parseFloat(selectedOfficeData.lat), parseFloat(selectedOfficeData.lon)]);
        if (map) {
          map.flyTo([parseFloat(selectedOfficeData.lat), parseFloat(selectedOfficeData.lon)], map.getZoom());
        } else {
          console.error('Map is null or undefined.');
        }
      }
    } catch (error) {
      console.error('Error updating map with office:', error.message);
    }
  };

  const updateMapWithCity = () => {
    try {
      const selectedCityData = cityDataJson.cityData.find((city) => city.name === selectedCity);
      if (selectedCityData) {
        setUserLocation([parseFloat(selectedCityData.lat), parseFloat(selectedCityData.lon)]);
        if (map) {
            map.flyTo([parseFloat(selectedCityData.lat), parseFloat(selectedCityData.lon)], map.getZoom());
          } else {
            console.error('Map is null or undefined.');
          }
      }
    } catch (error) {
      console.error('Error updating map with city:', error.message);
    }
  };

  useEffect(() => {
    // Fetch office names when the component mounts
    axios.get('setting')
      .then(response => {
        const officeNamesArray = response.data.map(office => office.company_name);

        setOfficeNames(officeNamesArray);
      })
      .catch(error => {
        console.error('Error fetching office names:', error.message);
      });

      // Fetch user location when the component mounts
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => {
        console.error('Error getting user location:', error.message);
      }
    );
  }, []);

  const LocateControl = () => {
    const mapInstance = useMapEvents({
      click() {
        mapInstance.locate();
      },
      locationfound(e) {
        setUserLocation([e.latlng.lat, e.latlng.lng]);
        mapInstance.flyTo(e.latlng, mapInstance.getZoom());
      },
    });

    // Save the map instance to the state
    setMap(mapInstance);

    return null;
  };


  const _created = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'marker') {
      const coordinates = layer.getLatLng();
      console.log('Marker Coordinates:', coordinates);
    } else if (layerType === 'rectangle' || layerType === 'circle' || layerType === 'polygon') {
      let shapeCoordinates;
      if (layerType === 'polygon') {
        shapeCoordinates = layer.getLatLngs()[0];
        console.log(`${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Coordinates:`, shapeCoordinates);
      } else {
        const bounds = layer.getBounds();
        shapeCoordinates = {
          southwest: bounds.getSouthWest(),
          northeast: bounds.getNorthEast(),
        };
        console.log(`${layerType.charAt(0).toUpperCase() + layerType.slice(1)} Coordinates:`, shapeCoordinates);
      }
      setCreatedShapeCoordinates(shapeCoordinates);
    } else {
      console.log('Unsupported layer type:', layerType);
    }
  };

  const handleAddOffice = async () => {
    const officeData = {
      // officeName: document.getElementById('officeName').value,
      // officeId: 1,
      officeId: selectedOffice,
      lat1: createdShapeCoordinates ? createdShapeCoordinates.northeast.lat : userLocation[0],
      long1: createdShapeCoordinates ? createdShapeCoordinates.northeast.lng : userLocation[1],
      lat2: createdShapeCoordinates ? createdShapeCoordinates.southwest.lat : null,
      long2: createdShapeCoordinates ? createdShapeCoordinates.southwest.lng : null,
      status: true
      // officeAddress: searchAddress,
    };

    try {
      await axios.post('setting/addOfficeLocation', officeData);
      console.log('Office added successfully!');
    } catch (error) {
      console.error('Error adding office:', error.message);
    }
  };

  // const handleAttendance = () => {
  //   if (
  //     createdShapeCoordinates &&
  //     userLocation &&
  //     userLocation[0] >= createdShapeCoordinates.southwest.lat &&
  //     userLocation[0] <= createdShapeCoordinates.northeast.lat &&
  //     userLocation[1] >= createdShapeCoordinates.southwest.lng &&
  //     userLocation[1] <= createdShapeCoordinates.northeast.lng
  //   ) {
  //     setAttendanceStatus('Attendance successful!');
  //     console.log('Attendance successful!');
  //   } else {
  //     setAttendanceStatus('Error: You are not within the designated area for attendance.');
  //     console.error('Error: You are not within the designated area for attendance.');
  //   }
  // };

 
  
  return (
    <div className="office-container">
    <Card>
    {/* <Title level={4} className="m-2 mb-4 text-center"> */}
    Set Office Coordinates
              {/* </Title> */}
              </Card>
      {/* <header>
        <h1>Office Coordinates</h1>
      </header> */}
      <div className="content-container">
        {/* <h4>Add or Update</h4> */}
        <div className="page-content">
          <div className="mb-1">
            <label htmlFor="officeName">Office Name:</label>
            {/* <input type="text" id="officeName" placeholder="Enter office name" /> */}
            <select
              id="officeName"
              value={selectedOffice}
              onChange={(e) => handleOfficeChange(e.target.value)}
            >
              <option value="">Select Office</option>
              {officeNames.map((officeName) => (
                <option key={officeName} value={officeName}>
                  {officeName}
                </option>
              ))}
            </select>
          </div>
          {officeDetails && (
            <div className="mb-6">
              <label htmlFor="Address">Address:</label>
              <div className="address-input">
                <input
                  type="text"
                  id="address"
                  placeholder="Enter Address"
                  value={officeDetails.address}
                  readOnly
                />
              </div>
            </div>
          )}
          {/* <div className="mb-6">
            <label htmlFor="Address">Address:</label>
            <div className="address-input">
              <input
                type="text"
                id="address"
                placeholder="Enter Address"
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
              /> */}
              <div className="flex-container">
                {/* <div className="flex-item">
                  <label htmlFor="state">State:</label>
                  <select id="state"></select>
                </div> */}
                {/* <div className="flex-item">
                  <label htmlFor="city">City:</label>
                  <select id="city" value={selectedCity} onChange={handleCityChange}>
                    <option value="">Select City</option>
                    {cityDataJson.cityData.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div> */}
                {/* <div className="flex-item">
                  <label htmlFor="zipcode">Zipcode:</label>
                  <input type="text" id="zipcode" placeholder="Enter zipcode" />
                </div> */}
                <div className="flex-item">
        <label htmlFor="customLat">Custom Latitude:</label>
        <input
          type="text"
          id="customLat"
          placeholder="Enter latitude"
          value={customCoordinates.lat}
          onChange={(e) => setCustomCoordinates({ ...customCoordinates, lat: e.target.value })}
        />
      </div>
      <div className="flex-item">
        <label htmlFor="customLon">Custom Longitude:</label>
        <input
          type="text"
          id="customLon"
          placeholder="Enter longitude"
          value={customCoordinates.lon}
          onChange={(e) => setCustomCoordinates({ ...customCoordinates, lon: e.target.value })}
        />
      </div>
      <div className="flex-item">
        <button className="locate" onClick={handleEnteredCoordinates}>
          Locate Coordinates
        </button>
      </div>
                {/* <div className="flex-item">
                  <button className="locate" onClick={updateMapWithCity}>
                    Locate City
                  </button>
                </div> */}
                <div className="flex-item">
                  <button className="add-button" onClick={handleAddOffice}>
                    Add
                  </button>
                </div>
                {/* <div className="flex-item">
                  <button className="add-button" onClick={handleAttendance}>
                    Attendance
                  </button>
                </div> */}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="Area">Area:</label>
            <MapContainer
              style={{ width: '100%', height: '500px' }}
              center={userLocation || [51.505, -0.09]}
              zoom={userLocation ? 15 : 13}
            >
              <FeatureGroup>
                <EditControl
                  position='topright'
                  onCreated={_created}
                  draw={{ rectangle: true, circle: true, circlemarker: false, marker: false, polyline: false, polygon: false }}
                ></EditControl>
              </FeatureGroup>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <div>
                      <strong>Your Location</strong>
                      <p>Latitude: {userLocation[0]}</p>
                      <p>Longitude: {userLocation[1]}</p>
                    </div>
                  </Popup>
                </Marker>
              )}
              <LocateControl />
            </MapContainer>
          </div>
          <div className="flex-item">
            {/* Display attendance status */}
            {attendanceStatus && <p>{attendanceStatus}</p>}
          </div>
        </div>
      // </div>
    // </div>
  );
};

export default OfficePage;
