import React from 'react';
import Link from 'next/link';

export const InputField = ({ icon, name, type = "text", placeholder, value, onChange, error }) => (
  <div>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {React.cloneElement(icon, { size: 20, className: "text-gray-400" })}
      </div>
      <input
        id={name}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-3 bg-white/50 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition`}
        placeholder={placeholder}
      />
    </div>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="text-purple-500">{React.cloneElement(icon, { size: 24 })}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export const StatRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 text-gray-600">
      {React.cloneElement(icon, { size: 20 })}
      <span>{label}</span>
    </div>
    <span className="font-bold text-lg text-gray-800">{value}</span>
  </div>
);

export const ActionLink = ({ href, icon, children }) => (
  <Link href={href} passHref>
    <a className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-semibold text-gray-800">
      {React.cloneElement(icon, { size: 20 })}
      {children}
    </a>
  </Link>
);
