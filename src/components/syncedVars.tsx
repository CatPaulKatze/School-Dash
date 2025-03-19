"use client";

import { createContext, useState, useContext, ReactNode } from 'react';

interface SchoolContextType {
    selectedSchool: string;
    setSelectedSchool: (school: string) => void;
    selectedClass: string;
    setSelectedClass: (className: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider = ({ children }: { children: ReactNode }) => {
    const [selectedSchool, setSelectedSchool] = useState("htl-hl");
    const [selectedClass, setSelectedClass] = useState("1AHITS");

    return (
        <SchoolContext.Provider value={{ selectedSchool, setSelectedSchool, selectedClass, setSelectedClass }}>
            {children}
        </SchoolContext.Provider>
    );
};

export const useSchool = () => {
    const context = useContext(SchoolContext);
    if (!context) {
        throw new Error('useSchool must be used within a SchoolProvider');
    }
    return context;
};