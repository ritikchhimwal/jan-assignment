import React, { useState } from "react";
import axios from "axios";
import { Audio } from "react-loader-spinner";

const PincodeLookup = () => {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");

  const fetchPincodeData = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      setData([]);
      setFilteredData([]);
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const result = response.data[0];
      if (result.Status === "Success") {
        setData(result.PostOffice);
        setFilteredData(result.PostOffice);
      } else {
        setError("No data found for the given pincode.");
        setData([]);
        setFilteredData([]);
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    const query = e.target.value.toLowerCase();
    setFilter(query);
    const filtered = data.filter((item) =>
      item.Name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Pincode Lookup</h2>
      Enter Pincode &nbsp;
      <input
        type="text"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="Enter 6-digit Pincode"
        style={{ padding: "10px", marginRight: "10px" }}
      />
      <button onClick={fetchPincodeData} style={{ padding: "10px" }}>
        Lookup
      </button>
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
          <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {data.length > 0 && (
        <div>
          <input
            type="text"
            value={filter}
            onChange={handleFilter}
            placeholder="Filter"
            style={{
              padding: "10px",
              margin: "20px 0",
              display: "block",
              width: "50%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            {filteredData.length > 0 ? (
              filteredData.map((post, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #000",
                    padding: "15px",
                    borderRadius: "5px",
                    textAlign: "left",
                  }}
                >
                  <p>
                    <strong>Name:</strong> {post.Name}
                  </p>
                  <p>
                    <strong>Branch Type:</strong> {post.BranchType}
                  </p>
                  <p>
                    <strong>Delivery Status:</strong> {post.DeliveryStatus}
                  </p>
                  <p>
                    <strong>District:</strong> {post.District}
                  </p>
                  <p>
                    <strong>Division:</strong> {post.Division}
                  </p>
                </div>
              ))
            ) : (
              <p>No matching results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeLookup;
