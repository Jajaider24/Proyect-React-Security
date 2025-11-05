import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormBootstrapProps<T extends object> {
  mode: 1 | 2;
  data: T;
  handleCreate?: (values: Partial<T>) => Promise<void> | void;
  handleUpdate?: (values: Partial<T>) => Promise<void> | void;
}

const FormBootstrap = <T extends object>({
  mode,
  data,
  handleCreate,
  handleUpdate,
}: FormBootstrapProps<T>) => {
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
      {({ values }) => (
        <Form className="p-4 bg-light rounded shadow-sm">
          {Object.entries(values)
            .filter(([key]) => !omit.includes(key))
            .map(([key, value]) => (
              <div className="mb-3" key={key}>
                <label htmlFor={key} className="form-label fw-semibold">
                  {key.replace(/_/g, " ").toUpperCase()}
                </label>

                {typeof value === "boolean" ? (
                  <div className="form-check">
                    <Field
                      type="checkbox"
                      name={key}
                      id={key}
                      className="form-check-input"
                    />
                  </div>
                ) : (
                  <Field
                    type={typeof value === "number" ? "number" : "text"}
                    name={key}
                    id={key}
                    className="form-control"
                  />
                )}

                <ErrorMessage name={key} component="p" className="text-danger small" />
              </div>
            ))}

          <button type="submit" className="btn btn-primary">
            {mode === 1 ? "Crear" : "Actualizar"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormBootstrap;
