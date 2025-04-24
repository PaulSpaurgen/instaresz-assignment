import { FC } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface FormComponentProps {
  name: string;
  placeholder?: string;
  type: 'text' | 'number' | 'dropdown' | 'checkbox' | 'radio';
  options?: Option[];
  value?: string | number | boolean | (string | number)[];
  onChange?: (value: any) => void;
  error?: string;
  required?: boolean;
}

const FormsComponent: FC<FormComponentProps> = ({
  name,
  placeholder,
  type,
  options = [],
  value,
  onChange,
  error,
  required
}) => {
  const inputClassName = `border rounded text-sm px-3 py-2 ${error ? 'border-red-500' : 'border-gray-300'}`;

  const renderError = () => {
    if (error) {
      return <span className="text-red-500 text-sm mt-1">{error}</span>;
    }
    return null;
  };

  switch (type) {
    case 'text':
    case 'number':
      return (
        <div className="flex flex-col gap-1">
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value as string | number}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputClassName}
            required={required}
          />
          {renderError()}
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex flex-col gap-1">
          <select
            name={name}
            value={value as string | number}
            onChange={(e) => onChange?.(e.target.value)}
            className={inputClassName}
            required={required}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {renderError()}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(option.value);
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index > -1) {
                        newValue.splice(index, 1);
                      }
                    }
                    onChange?.(newValue);
                  }}
                  required={required && Array.isArray(value) && value.length === 0}
                />
                {option.label}
              </label>
            ))}
          </div>
          {renderError()}
        </div>
      );

    case 'radio':
      return (
        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  required={required}
                />
                {option.label}
              </label>
            ))}
          </div>
          {renderError()}
        </div>
      );

    default:
      return null;
  }
};

export default FormsComponent;

