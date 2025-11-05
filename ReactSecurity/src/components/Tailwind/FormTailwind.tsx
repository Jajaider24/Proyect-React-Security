import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormTailwindProps<T extends object> {
  mode: 1 | 2;
  data: T;
  handleCreate?: (values: Partial<T>) => Promise<void> | void;
  handleUpdate?: (values: Partial<T>) => Promise<void> | void;
}

const FormTailwind = <T extends object>({
  mode,
  data,
  handleCreate,
  handleUpdate,
}: FormTailwindProps<T>) => {
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
        <Form className="bg-white p-6 rounded-md shadow-md space-y-4">
          {Object.entries(values)
            .filter(([key]) => !omit.includes(key))
            .map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {key.replace(/_/g, " ").toUpperCase()}
                </label>

                {typeof value === "boolean" ? (
                  <Field type="checkbox" name={key} className="form-checkbox" />
                ) : (
                  <Field
                    type={typeof value === "number" ? "number" : "text"}
                    name={key}
                    id={key}
                    className="w-full border rounded p-2"
                  />
                )}

                <ErrorMessage
                  name={key}
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>
            ))}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {mode === 1 ? "Crear" : "Actualizar"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormTailwind;