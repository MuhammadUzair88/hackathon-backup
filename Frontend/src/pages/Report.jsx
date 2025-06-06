// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import { useAuth } from "../context/UserContext";

// // Fix Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// const LocationPicker = ({ setLocation }) => {
//   useMapEvents({
//     click(e) {
//       setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
//     },
//   });
//   return null;
// };

// const Report = () => {
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user) {
//       console.log("User ID:", user._id || user.id);
//       console.log("Is Anonymous:", user.isAnonymous);
//     }
//   }, [user]);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     category: "waste",
//   });
//   const [photoFile, setPhotoFile] = useState(null);
//   const [location, setLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     setPhotoFile(e.target.files[0]);
//   };

//   const handleLocationSearch = async () => {
//     if (!searchQuery) return;
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//           searchQuery
//         )}`
//       );

//       if (response.data.length === 0) {
//         alert("Location not found.");
//         return;
//       }

//       const { lat, lon } = response.data[0];
//       setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
//       setMapCenter([parseFloat(lat), parseFloat(lon)]);
//     } catch (error) {
//       console.error("Geocoding error:", error);
//       alert("Failed to fetch location.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!location) return alert("Please select a location!");

//     const finalData = new FormData();
//     finalData.append("title", formData.title);
//     finalData.append("description", formData.description);
//     finalData.append("category", formData.category);
//     finalData.append("latitude", location.lat);
//     finalData.append("longitude", location.lng);

//     // Append createdBy only if user exists and is NOT anonymous
//     if (user && !user.isAnonymous) {
//       finalData.append("createdBy", user._id || user.id);
//     }

//     if (photoFile) {
//       finalData.append("photo", photoFile);
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "http://localhost:5000/api/report/incidentupload",
//         finalData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert("Incident reported!");
//       // Optionally reset form or location here
//       setFormData({
//         title: "",
//         description: "",
//         category: "waste",
//       });
//       setPhotoFile(null);
//       setLocation(null);
//     } catch (err) {
//       console.error(err);
//       alert("Error submitting incident.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           name="title"
//           placeholder="Title"
//           value={formData.title}
//           onChange={handleChange}
//           required
//           className="border p-2 rounded w-full"
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={formData.description}
//           onChange={handleChange}
//           required
//           className="border p-2 rounded w-full"
//         />
//         <select
//           name="category"
//           value={formData.category}
//           onChange={handleChange}
//           className="border p-2 rounded w-full"
//         >
//           <option value="waste">Waste</option>
//           <option value="water">Water</option>
//           <option value="air">Air</option>
//           <option value="deforestation">Deforestation</option>
//           <option value="other">Other</option>
//         </select>

//         <input
//           type="file"
//           accept="image/*"
//           onChange={handlePhotoChange}
//           className="border p-2 rounded w-full"
//         />

//         <div className="flex gap-2 mb-4">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search location e.g. Hyderabad Qasimabad"
//             className="border p-2 rounded w-full"
//           />
//           <button
//             type="button"
//             onClick={handleLocationSearch}
//             className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//           >
//             Search
//           </button>
//         </div>

//         <div className="mt-2 font-medium">
//           📍 Click or Search a place to mark location
//         </div>

//         <MapContainer
//           center={mapCenter}
//           zoom={16}
//           maxZoom={18}
//           scrollWheelZoom={true}
//           className="h-[600px] w-full rounded-xl shadow-lg"
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           <LocationPicker setLocation={setLocation} />
//           {location && <Marker position={[location.lat, location.lng]} />}
//         </MapContainer>

//         {location && (
//           <div className="mt-2 text-sm text-gray-700">
//             Selected Location: {location.lat.toFixed(5)},{" "}
//             {location.lng.toFixed(5)}
//           </div>
//         )}

//         <button
//           type="submit"
//           className="mt-4 bg-green-600 text-white p-2 rounded hover:bg-green-700"
//         >
//           Submit Report
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Report;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useAuth } from "../context/UserContext";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

const Report = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User ID:", user._id || user.id);
      console.log("Is Anonymous:", user.isAnonymous);
    }
  }, [user]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "waste",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [location, setLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([30.3753, 69.3451]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const handleLocationSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );

      if (response.data.length === 0) {
        alert("Location not found.");
        return;
      }

      const { lat, lon } = response.data[0];
      setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      setMapCenter([parseFloat(lat), parseFloat(lon)]);
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Failed to fetch location.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) return alert("Please select a location!");

    const finalData = new FormData();
    finalData.append("title", formData.title);
    finalData.append("description", formData.description);
    finalData.append("category", formData.category);
    finalData.append("latitude", location.lat);
    finalData.append("longitude", location.lng);

    if (user && !user.isAnonymous) {
      finalData.append("createdBy", user._id || user.id);
    }

    if (photoFile) {
      finalData.append("photo", photoFile);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/report/incidentupload",
        finalData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Incident reported!");
      setFormData({
        title: "",
        description: "",
        category: "waste",
      });
      setPhotoFile(null);
      setLocation(null);
    } catch (err) {
      console.error(err);
      alert("Error submitting incident.");
    }
  };

  return (
     <div className="w-full px-4 sm:px-8 lg:px-20 py-10 bg-green-50 min-h-screen">
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-2xl rounded-lg mt-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Report an Environmental Incident</h2>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          name="title"
          placeholder="Incident Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <textarea
          name="description"
          placeholder="Describe the incident..."
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-3 rounded-md shadow-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="waste">Waste</option>
          <option value="water">Water</option>
          <option value="air">Air</option>
          <option value="deforestation">Deforestation</option>
          <option value="other">Other</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full border border-gray-300 p-3 rounded-md"
        />

        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location"
            className="flex-1 border border-gray-300 p-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={handleLocationSearch}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900 transition"
          >
            Search
          </button>
        </div>

        <div className="text-sm text-gray-600">
          📍 Click on the map or use search to choose a location
        </div>

        <MapContainer
          center={mapCenter}
          zoom={16}
          maxZoom={18}
          scrollWheelZoom={true}
          className="h-[400px] w-full rounded-md border border-gray-300"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker setLocation={setLocation} />
          {location && <Marker position={[location.lat, location.lng]} />}
        </MapContainer>

        {location && (
          <div className="text-sm text-gray-700 mt-2">
            Selected Location: <strong>{location.lat.toFixed(5)}</strong>,{" "}
            <strong>{location.lng.toFixed(5)}</strong>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-medium"
        >
          Submit Report
        </button>
      </form>
    </div>
    </div>
  );
};

export default Report;
