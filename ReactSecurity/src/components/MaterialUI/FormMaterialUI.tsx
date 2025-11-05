import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";

interface FormMaterialUIProps<T extends object> {
  mode: 1 | 2;
  data: T;
  handleCreate?: (values: Partial<T>) => Promise<void> | void;
  handleUpdate?: (values: Partial<T>) => Promise<void> | void;
}

const FormMaterialUI = <T extends object>({
  mode,
  data,
  handleCreate,
  handleUpdate,
}: FormMaterialUIProps<T>) => {
  const onSubmit = async (values: Partial<T>) => {
    if (mode === 1 && handleCreate) await handleCreate(values);
    if (mode === 2 && handleUpdate) await handleUpdate(values);
  };

  const omit = ["id", "created_at", "updated_at"];
  const validationShape: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string") validationShape[key] = Yup.string().required("Requerido");
    else if (typeof value === "number") validationShape[key] = Yup.number().required("Requerido");
  });

  return (
    <Formik
      initialValues={data}
      validationSchema={Yup.object(validationShape)}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, handleChange }) => (
        <Form style={{ display: "grid", gap: 16, padding: 16 }}>
          {Object.entries(values)
            .filter(([key]) => !omit.includes(key))
            .map(([key, value]) =>
              typeof value === "boolean" ? (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      name={key}
                      checked={value}
                      onChange={handleChange}
                    />
                  }
                  label={key.replace(/_/g, " ").toUpperCase()}
                />
              ) : (
                <Field
                  key={key}
                  as={TextField}
                  name={key}
                  label={key.replace(/_/g, " ").toUpperCase()}
                  type={typeof value === "number" ? "number" : "text"}
                  variant="outlined"
                  fullWidth
                />
              )
            )}

          <Button type="submit" variant="contained" color="primary">
            {mode === 1 ? "Crear" : "Actualizar"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default FormMaterialUI;
