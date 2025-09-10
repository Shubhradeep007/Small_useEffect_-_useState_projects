import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
  Stack,
  Alert,
} from "@mui/material";

const CustomeValidation = () => {
  // State to hold all form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    subCategory: "",
    programming: [],
    hobby: [],
    term: false,
  });

  // State to hold any validation errors
  const [errors, setErrors] = useState({});

  // State to hold a success message after form submission
  const [submitMessage, setSubmitMessage] = useState("");

  // A single handler for all input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkboxes, which need special logic
    if (type === "checkbox") {
      // Logic for multi-select checkboxes (programming, hobby)
      if (name === "programming" || name === "hobby") {
        setFormData((prev) => {
          const newArray = checked
            ? [...prev[name], value]
            : prev[name].filter((item) => item !== value);
          return {
            ...prev,
            [name]: newArray,
          };
        });
      } else {
        // Logic for a single boolean checkbox (term)
        setFormData((prev) => ({
          ...prev,
          [name]: checked,
        }));
      }
    } else {
      // Logic for all other input types (text, radio, number)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear the error for the current field as the user types
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setSubmitMessage(""); // Clear any previous success message
  };

  // Function to validate all fields
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "A valid email is required";
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // Sub-category is only required if a main category is selected
    if (formData.category && !formData.subCategory) {
      newErrors.subCategory = "Sub-category is required";
    }

    if (formData.programming.length === 0) {
      newErrors.programming = "Select at least one programming language";
    }

    if (formData.hobby.length === 0) {
      newErrors.hobby = "Select at least one hobby";
    }

    if (!formData.term) {
      newErrors.term = "You must accept terms & conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form data submitted:", formData);
      setSubmitMessage("Form submitted successfully!");
      // Reset form or perform further actions here
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: "20px",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
          Form
        </Typography>

        {submitMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitMessage}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 2 }}>
          {/* Name Input Field */}
          <TextField
            fullWidth
            label="Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />

          {/* Email Input Field */}
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Phone Input Field */}
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            type="number"
            placeholder="Enter your number"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
          />

          {/* Category Radio Buttons */}
          <FormControl component="fieldset" error={!!errors.category}>
            <FormLabel component="legend">Category:</FormLabel>
            <RadioGroup row name="category" value={formData.category} onChange={handleChange}>
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="professional" control={<Radio />} label="Professional" />
            </RadioGroup>
            {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
          </FormControl>

          {/* Sub-category Radio Buttons (Conditionally rendered) */}
          {formData.category === "student" && (
            <FormControl component="fieldset" error={!!errors.subCategory}>
              <FormLabel component="legend">Sub-category (Student):</FormLabel>
              <RadioGroup row name="subCategory" value={formData.subCategory} onChange={handleChange}>
                <FormControlLabel value="10th" control={<Radio />} label="10th" />
                <FormControlLabel value="12th" control={<Radio />} label="12th" />
                <FormControlLabel value="graduate" control={<Radio />} label="Graduate" />
              </RadioGroup>
              {errors.subCategory && <Typography color="error" variant="caption">{errors.subCategory}</Typography>}
            </FormControl>
          )}

          {formData.category === "professional" && (
            <FormControl component="fieldset" error={!!errors.subCategory}>
              <FormLabel component="legend">Sub-category (Professional):</FormLabel>
              <RadioGroup row name="subCategory" value={formData.subCategory} onChange={handleChange}>
                <FormControlLabel value="it" control={<Radio />} label="IT" />
                <FormControlLabel value="sales" control={<Radio />} label="Sales" />
              </RadioGroup>
              {errors.subCategory && <Typography color="error" variant="caption">{errors.subCategory}</Typography>}
            </FormControl>
          )}

          {/* Programming Languages Checkboxes */}
          <FormControl component="fieldset" error={!!errors.programming}>
            <FormLabel component="legend">Select Programming Languages:</FormLabel>
            <FormGroup row>
              <FormControlLabel control={<Checkbox checked={formData.programming.includes("c++")} onChange={handleChange} name="programming" value="c++" />} label="C++" />
              <FormControlLabel control={<Checkbox checked={formData.programming.includes("js")} onChange={handleChange} name="programming" value="js" />} label="JavaScript" />
              <FormControlLabel control={<Checkbox checked={formData.programming.includes("python")} onChange={handleChange} name="programming" value="python" />} label="Python" />
            </FormGroup>
            {errors.programming && <Typography color="error" variant="caption">{errors.programming}</Typography>}
          </FormControl>

          {/* Hobbies Checkboxes */}
          <FormControl component="fieldset" error={!!errors.hobby}>
            <FormLabel component="legend">Select Hobbies:</FormLabel>
            <FormGroup row>
              <FormControlLabel control={<Checkbox checked={formData.hobby.includes("cricket")} onChange={handleChange} name="hobby" value="cricket" />} label="Cricket" />
              <FormControlLabel control={<Checkbox checked={formData.hobby.includes("music")} onChange={handleChange} name="hobby" value="music" />} label="Music" />
              <FormControlLabel control={<Checkbox checked={formData.hobby.includes("reading")} onChange={handleChange} name="hobby" value="reading" />} label="Reading" />
            </FormGroup>
            {errors.hobby && <Typography color="error" variant="caption">{errors.hobby}</Typography>}
          </FormControl>

          {/* Terms and Conditions Checkbox */}
          <FormControl component="fieldset" error={!!errors.term}>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={formData.term} onChange={handleChange} name="term" />} label="Accept Terms & Conditions" />
            </FormGroup>
            {errors.term && <Typography color="error" variant="caption">{errors.term}</Typography>}
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default CustomeValidation;
