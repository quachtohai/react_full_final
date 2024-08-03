import React, { useState } from "react";
 
const Tab = ({ label, onClick, isActive, children }) => (
    <div
        className={`tab ${isActive ? "active" : ""}`}
        onClick={onClick}>
        {label} 
        {children}       
    </div>
);
 
export default Tab;