import { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FormsCreationModal from "../compoonents/FormsCreationModal";
import DraggableFormElement from "../compoonents/DraggableFormElement";
import { FormElement, FormErrors } from "../types/form";

const FormBuilder = () => {
  const [formElements, setFormElements] = useState<Array<FormElement>>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const addElementToForm = (element: FormElement) => {
    setFormElements([...formElements, element]);
    setFormValues((prev) => ({
      ...prev,
      [element.name]: "",
    }));
  };

  const handelChange = (value: string, id: string) => {
    setFormValues((val) => ({
      ...val,
      [`${id}`]: value,
    }));
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const removeElementInForm = (id: string) => {
    const filteredElements = formElements.filter(
      (element: FormElement) => element.name !== id
    );
    const updatedFormValues = { ...formValues };
    delete updatedFormValues[id]
    setFormElements(filteredElements);
    setFormValues(updatedFormValues);
  };

  const moveElement = useCallback((dragIndex: number, hoverIndex: number) => {
    setFormElements((prevElements) => {
      const newElements = [...prevElements];
      const draggedElement = newElements[dragIndex];
      newElements.splice(dragIndex, 1);
      newElements.splice(hoverIndex, 0, draggedElement);
      return newElements;
    });
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    formElements.forEach((element) => {
      const value = formValues[element.name];

      if (element.required && (!value || value.trim() === "")) {
        newErrors[element.name] = `${
          element.placeholder || "Field"
        } is required`;
        isValid = false;
      }

      if (element.type === "number" && value && isNaN(Number(value))) {
        newErrors[element.name] = "Please enter a valid number";
        isValid = false;
      }

      if (
        (element.type === "dropdown" || element.type === "radio") &&
        element.required &&
        !value
      ) {
        newErrors[element.name] = `Please select a ${
          element.placeholder || "value"
        }`;
        isValid = false;
      }
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form is valid:", { formValues });
      // Process form submission here
    } else {
      console.log("Form has errors:", formErrors);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-[90%] max-w-[90%] lg:max-w-[800px] lg:w-[800px] mx-auto border-[1px] border-gray-300 p-6 mt-4 rounded-md">
        {!formElements.length && (
          <p className="text-gray-500 text-center py-8">
            Please create a form input
          </p>
        )}
        <form onSubmit={(e) => e.preventDefault()}>
          {formElements.map((element, index) => (
            <DraggableFormElement
              key={element.name}
              element={element}
              index={index}
              moveElement={moveElement}
              onChange={(value: string) => handelChange(value, element.name)}
              onDelete={() => removeElementInForm(element.name)}
              value={formValues[element.name]}
              error={formErrors[element.name]}
            />
          ))}
        </form>

        <div className="w-full flex gap-4 mt-4">
          <button
            className="w-full px-4 py-2 border-[1px] text-sm cursor-pointer border-gray-300 hover:bg-gray-200 rounded-md shadow-sm transition-colors"
            onClick={() => setIsFormModalOpen(true)}
          >
            Add Element
          </button>
          <button
            className="w-full px-4 py-2 border-[1px] text-sm cursor-pointer bg-black text-white hover:bg-blue-600 rounded-md shadow-sm transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        <FormsCreationModal
          isModalOpen={isFormModalOpen}
          setIsModalOpen={setIsFormModalOpen}
          addElementToForm={addElementToForm}
        />
      </div>
    </DndProvider>
  );
};

export default FormBuilder;
