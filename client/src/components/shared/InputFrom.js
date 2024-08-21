import React from "react";

const InputFrom = ({ htmlFor, labelText, type, name, value, handleChange }) => {  //destructure
    return (
        <>
            <div className="mb-3">
                <label htmlFor={htmlFor} className="form-label">
                    {labelText}
                </label>
                <input
                    type={type}
                    className="form-control"
                    name={name}   //dynamic 
                    value={value}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

export default InputFrom;
