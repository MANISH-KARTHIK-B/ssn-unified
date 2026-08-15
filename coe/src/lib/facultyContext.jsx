import React, { createContext, useContext, useState } from "react";

const FacultyContext = createContext(null);

export function FacultyProvider({ children }) {
  const [selectedStudentId, setSelectedStudentId] = useState("");
  return (
    <FacultyContext.Provider value={{ selectedStudentId, setSelectedStudentId }}>
      {children}
    </FacultyContext.Provider>
  );
}

export function useFaculty() {
  return useContext(FacultyContext);
}
