import React from 'react';

const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl ${className}`}>
            {title && <h3 className="text-lg font-semibold text-gray-100 mb-4">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;