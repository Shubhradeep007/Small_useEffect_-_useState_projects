import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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

// Define the Yup validation schema for the form
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("A valid email is required")
    .required("A valid email is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone must be exactly 10 digits"),
  category: yup.string().required("Category is required"),
  subCategory: yup.string().when("category", {
    is: (category) => category,
    then: (schema) => schema.required("Sub-category is required"),
  }),
  // Use a default empty array to ensure the min() validation works correctly
  programming: yup.array().min(1, "Select at least one programming language"),
  hobby: yup.array().min(1, "Select at least one hobby"),
  term: yup.boolean().oneOf([true], "You must accept terms & conditions"),
});

const ReacthookformValidation = () => {
  // Use useForm with the yupResolver to integrate Yup schema validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      programming: [],
      hobby: [],
    },
  });

  const [submitMessage, setSubmitMessage] = useState("");

  // Watch the 'category' field to conditionally render sub-categories
  const category = watch("category");

  // Function to handle form submission
  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    setSubmitMessage("Form submitted successfully!");
    // You can uncomment the line below to reset the form after successful submission
    // reset();
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
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
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
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          {/* Email Input Field */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* Phone Input Field */}
          <TextField
            fullWidth
            label="Phone"
            type="number"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          {/* Category Radio Buttons */}
          <FormControl component="fieldset" error={!!errors.category}>
            <FormLabel component="legend">Category:</FormLabel>
            <RadioGroup row>
              <FormControlLabel
                value="student"
                control={<Radio {...register("category")} />}
                label="Student"
              />
              <FormControlLabel
                value="professional"
                control={<Radio {...register("category")} />}
                label="Professional"
              />
            </RadioGroup>
            {errors.category && (
              <Typography color="error" variant="caption">
                {errors.category?.message}
              </Typography>
            )}
          </FormControl>

          {/* Sub-category Radio Buttons (Conditionally rendered) */}
          {category === "student" && (
            <FormControl component="fieldset" error={!!errors.subCategory}>
              <FormLabel component="legend">Sub-category (Student):</FormLabel>
              <RadioGroup row>
                <FormControlLabel
                  value="10th"
                  control={<Radio {...register("subCategory")} />}
                  label="10th"
                />
                <FormControlLabel
                  value="12th"
                  control={<Radio {...register("subCategory")} />}
                  label="12th"
                />
                <FormControlLabel
                  value="graduate"
                  control={<Radio {...register("subCategory")} />}
                  label="Graduate"
                />
              </RadioGroup>
              {errors.subCategory && (
                <Typography color="error" variant="caption">
                  {errors.subCategory?.message}
                </Typography>
              )}
            </FormControl>
          )}

          {category === "professional" && (
            <FormControl component="fieldset" error={!!errors.subCategory}>
              <FormLabel component="legend">
                Sub-category (Professional):
              </FormLabel>
              <RadioGroup row>
                <FormControlLabel
                  value="it"
                  control={<Radio {...register("subCategory")} />}
                  label="IT"
                />
                <FormControlLabel
                  value="sales"
                  control={<Radio {...register("subCategory")} />}
                  label="Sales"
                />
              </RadioGroup>
              {errors.subCategory && (
                <Typography color="error" variant="caption">
                  {errors.subCategory?.message}
                </Typography>
              )}
            </FormControl>
          )}

          {/* Programming Languages Checkboxes */}
          <FormControl component="fieldset" error={!!errors.programming}>
            <FormLabel component="legend">
              Select Programming Languages:
            </FormLabel>
            <Controller
              name="programming"
              control={control}
              render={({ field }) => (
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes("c++")}
                        onChange={() => {
                          const newValues = field.value.includes("c++")
                            ? field.value.filter((val) => val !== "c++")
                            : [...field.value, "c++"];
                          field.onChange(newValues);
                        }}
                      />
                    }
                    label="C++"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes("js")}
                        onChange={() => {
                          const newValues = field.value.includes("js")
                            ? field.value.filter((val) => val !== "js")
                            : [...field.value, "js"];
                          field.onChange(newValues);
                        }}
                      />
                    }
                    label="JavaScript"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes("python")}
                        onChange={() => {
                          const newValues = field.value.includes("python")
                            ? field.value.filter((val) => val !== "python")
                            : [...field.value, "python"];
                          field.onChange(newValues);
                        }}
                      />
                    }
                    label="Python"
                  />
                </FormGroup>
              )}
            />
            {errors.programming && (
              <Typography color="error" variant="caption">
                {errors.programming?.message}
              </Typography>
            )}
          </FormControl>

          {/* Hobbies Checkboxes */}
          <FormControl component="fieldset" error={!!errors.hobby}>
            <FormLabel component="legend">Select Hobbies:</FormLabel>
            <Controller
              name="hobby"
              control={control}
              render={({ field }) => (
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes("cricket")}
                        onChange={() => {
                          const newValues = field.value.includes("cricket")
                            ? field.value.filter((val) => val !== "cricket")
                            : [...field.value, "cricket"];
                          field.onChange(newValues);
                        }}
                      />
                    }
                    label="Cricket"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes("music")}
                        onChange={() => {
                          const newValues = field.value.includes("music")
                            ? field.value.filter((val) => val !== "music")
                            : [...field.value, "music"];
                          field.onChange(newValues);
                        }}
                      />
                    }
                    label="Music"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value.includes("reading")}
                        onChange={() => {
                          const newValues = field.value.includes("reading")
                            ? field.value.filter((val) => val !== "reading")
                            : [...field.value, "reading"];
                          field.onChange(newValues);
                        }}
                      />
                    }
                    label="Reading"
                  />
                </FormGroup>
              )}
            />
            {errors.hobby && (
              <Typography color="error" variant="caption">
                {errors.hobby?.message}
              </Typography>
            )}
          </FormControl>

          {/* Terms and Conditions Checkbox */}
          <FormControl component="fieldset" error={!!errors.term}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox {...register("term")} />}
                label="Accept Terms & Conditions"
              />
            </FormGroup>
            {errors.term && (
              <Typography color="error" variant="caption">
                {errors.term?.message}
              </Typography>
            )}
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Submit
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ReacthookformValidation;
