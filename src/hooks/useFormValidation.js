// Custom hook para manejo de formularios con validación
import { useEffect, useState } from "react";

export function useFormValidation(initialValues, validateFn, editData = null, show = true) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(editData || initialValues);
    setErrors({});
  }, [editData, show]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (ev, onSubmit) => {
    ev.preventDefault();
    const validationErrors = validateFn(form, editData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  };

  const resetForm = () => {
    setForm(initialValues);
    setErrors({});
  };

  return {
    form,
    errors,
    handleChange,
    handleSubmit,
    resetForm
  };
}
