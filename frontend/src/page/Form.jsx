import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, FormHelperText, CircularProgress, Grid, Typography } from "@mui/material";

const App = () => {
  const [inputData, setInputData] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setLoading(true); // Start loading state

    // Validate if inputData is a valid JSON
    try {
      const jsonData = JSON.parse(inputData);
      if (!jsonData.data) {
        setError("Invalid data format: 'data' field is required.");
        setLoading(false);
        return;
      }

      // Call the backend API with the valid JSON
      const result = await axios.post("https://bajaj-finservapi.vercel.app/bfhl", jsonData);
      setResponse(result.data);
    } catch (err) {
      setError("Invalid JSON input. Please correct the format.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Handle dropdown selection change
  const handleSelectChange = (e) => {
    setSelectedOptions(e.target.value);
  };

  // Function to render the selected data with commas after each value
  const renderSelectedData = () => {
    if (!response) return null;

    const selectedData = {};

    // Add selected options to selectedData
    selectedOptions.forEach((option) => {
      switch (option) {
        case "alphabets":
          selectedData["Alphabets"] = response.alphabets.length > 0
            ? response.alphabets.join(", ") // Join with commas
            : "No Alphabets found";
          break;
        case "numbers":
          selectedData["Numbers"] = response.numbers.length > 0
            ? response.numbers.join(", ") // Join with commas
            : "No Numbers found";
          break;
        case "highest_alphabet":
          selectedData["Highest Alphabet"] = response.highest_alphabet.length > 0
            ? response.highest_alphabet.join(", ") // Join with commas
            : "No Highest Alphabet found";
          break;
        default:
          break;
      }
    });

    return Object.keys(selectedData).map((key) => (
      <div key={key}>
        <Typography variant="h6" color="primary">{key}</Typography>
        <Typography>{selectedData[key]}</Typography>
      </div>
    ));
  };

  // Options for the multi-select dropdown
  const options = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    { value: "highest_alphabet", label: "Highest Alphabet" },
  ];

  return (
    <div className="container" style={{ padding: '20px' }}>
      <Typography variant="h4" color="primary" gutterBottom>Bajaj Finserv</Typography>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <TextField
          label="Enter JSON here"
          placeholder='e.g., {"data":["A","C","z"]}'
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          variant="outlined"
          multiline
          rows={6}
          fullWidth
          error={!!error}
          helperText={error}
          margin="dense"
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit"}
        </Button>
      </form>

      {/* Error message */}
      {error && (
        <Typography variant="body2" color="error">{error}</Typography>
      )}

      {/* Multi-select dropdown appears after valid JSON submission */}
      {response && (
        <>
          <Typography variant="h6" color="primary">Select fields to display:</Typography>
          <FormControl fullWidth margin="dense">
            <Select
              multiple
              value={selectedOptions}
              onChange={handleSelectChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the fields you want to display</FormHelperText>
          </FormControl>

          <div className="response" style={{ marginTop: '20px' }}>
            <Typography variant="h6" color="primary">Response:</Typography>
            {renderSelectedData()}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
