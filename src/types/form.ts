export type FormElement = {
  label:string;
  name: string;
  type: "text" | "number" | "dropdown" | "checkbox" | "radio";
  placeholder: string;
  required?: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
};

export interface FormErrors {
  [key: string]: string;
} 