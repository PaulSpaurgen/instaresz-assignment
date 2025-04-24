import { FC, useRef, useState } from "react";
import Modal from "../Atoms/Modal";
import FormsComponent from "./FormsComponent";

interface FormField {
  label: string;
  type: "text" | "number" | "dropdown" | "checkbox" | "radio";
  placeholder: string;
  required?: boolean;
  options?: { label: string; value: string | number }[];
}

interface FormsCreationModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  addElementToForm: (element: any) => void;
}

const FormsCreationModal: FC<FormsCreationModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  addElementToForm,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formField, setFormField] = useState<FormField>({
    label: "",
    type: "text",
    placeholder: "",
    required: false
  });
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const [newOption, setNewOption] = useState({ label: "", value: "" });

  const handleAddOption = () => {
    if (newOption.label && newOption.value) {
      setOptions([...options, newOption]);
      setNewOption({ label: "", value: "" });
    }
  };

  const onClose = () =>{
    dialogRef.current?.close();
    setFormField({
      label: "",
      type: "text",
      placeholder: "",
      required: false
    })
    setIsModalOpen(false)
  }

  const handleSubmit = () => {

    if (formField.label.trim() === '') {
      return;
    }

    if (formField.placeholder.trim() === '') {
      return;
    }

    if (['dropdown', 'radio', 'checkbox'].includes(formField.type) && options.length === 0) {
      return;
    }
    
    const fieldData = {
      ...formField,
      ...(["dropdown", "checkbox", "radio"].includes(formField.type) &&
        options.length > 0 && {
          options,
        }),
      name: formField.label.toLowerCase().replace(/[^a-z0-9]/g, '_'),
    };
    console.log("Form Field Created:", fieldData);
    addElementToForm(fieldData);
    onClose()
  };

  if (isModalOpen && dialogRef.current && !dialogRef.current.open) {
    dialogRef.current.showModal();
  }

  return (
    <Modal
      dialogRef={dialogRef}
      title="Create Form Field"
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">

        <FormsComponent
          name="fieldLabel"
          type="text"
          placeholder="Enter field label"
          value={formField.label}
          onChange={(value) => setFormField({ ...formField, label: value })}
          required={true}
          error={formField.label.trim() === '' ? 'Label is required' : ''}
        />

        <FormsComponent
          name="fieldPlaceholder"
          type="text"
          placeholder="Enter field placeholder"
          value={formField.placeholder}
          onChange={(value) => setFormField({ ...formField, placeholder: value })}
          required={true}
          error={formField.placeholder.trim() === '' ? 'Placeholder is required' : ''}
        />

        <FormsComponent
          name="fieldType"
          type="dropdown"
          placeholder="Select field type"
          value={formField.type}
          options={[
            { value: "text", label: "Text" },
            { value: "number", label: "Number" },
            { value: "dropdown", label: "Dropdown" },
            { value: "checkbox", label: "Checkbox" },
            { value: "radio", label: "Radio" },
          ]}
          onChange={(value) => setFormField({ ...formField, type: value })}
          required={true}
        />

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="required"
            checked={formField.required}
            onChange={(e) => setFormField({ ...formField, required: e.target.checked })}
          />
          <label htmlFor="required">Make this field required</label>
        </div>

        {["dropdown", "checkbox", "radio"].includes(formField.type) && (
          <div className="border-[1px] border-gray-300 p-4 rounded">
            <h3 className="font-semibold mb-2">Add Options</h3>
            <div className="flex gap-2 mb-4 flex-col">
              <FormsComponent
                name="optionLabel"
                type="text"
                placeholder="Option Label"
                value={newOption.label}
                onChange={(value) => setNewOption({ ...newOption, label: value })}
              />
              <FormsComponent
                name="optionValue" 
                type="text"
                placeholder="Option Value"
                value={newOption.value}
                onChange={(value) => setNewOption({ ...newOption, value: value })}
              />
            </div>
            
            <button
                onClick={handleAddOption}
                className="w-full px-4 py-2 border-[1px] text-sm cursor-pointer border-gray-300 hover:bg-gray-200 rounded-md shadow-sm transition-colors"
              >
                Add
              </button>

              {}

            <div className="flex flex-col gap-2 mt-4">
              {options.map((option, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span>
                    {option.label} - {option.value}
                  </span>
                  <button
                    onClick={() =>
                      setOptions(options.filter((_, i) => i !== index))
                    }
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full px-4 py-2 border-[1px] text-sm cursor-pointer bg-black text-white hover:bg-blue-600 rounded-md shadow-sm transition-colors"
        >
          Create Field
        </button>
      </div>
    </Modal>
  );
};

export default FormsCreationModal;
