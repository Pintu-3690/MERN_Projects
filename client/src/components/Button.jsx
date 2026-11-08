import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
    const baseStyles = "w-full py-2.5 rounded-lg font-medium transition duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
        secondary: "bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-gray-200",
        danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;