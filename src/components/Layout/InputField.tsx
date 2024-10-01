import React from "react";

type InputProps = {
  type: string;
  value: string;
  placeholder?: string;
  onChange: (e: any) => void;
  disabled?: boolean;
};

const InputField: React.FC<InputProps> = ({  type, value, placeholder, onChange }) => {
  return (
    <div className="col">
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default InputField;