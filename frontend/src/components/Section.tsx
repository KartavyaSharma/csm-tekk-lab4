import React, { useState, useEffect } from "react";
import { Section as SectionType, Student } from "../utils/types";
import { Link, useParams } from "react-router-dom";

export const Section = () => {
  const [section, setSection] = useState<SectionType>(undefined as never);
  const [students, setStudents] = useState<Student[]>([]);
  const { id } = useParams<string>();

  useEffect(() => {
    fetch(`/api/sections/${id}/details/`)
      .then((res) => res.json())
      .then((data) => {
        setSection(data);
      });
    fetch(`/api/sections/${id}/students/`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
      });
  }, []);

  const drop = (id:number) => {
    const copy = [...students];
    const index = copy.map(e => e.id).indexOf(id, 0);
    if (index > -1) {
      copy.splice(index, 1);
    }

    fetch(`/api/students/${student_id}/drop/`, {
      method: "PATCH",
    });

  };

  return (
    <div>
      <h1>Section</h1>
      {section && (
        <div>
          <p>
            {section.mentor.course.name} (id: {id})
          </p>
          <p>
            Mentor: {section.mentor.user.first_name}{" "}
            {section.mentor.user.last_name}
          </p>
        </div>
      )}
      <p>Students:</p>
      <ul>
        {students.map((student) => (
          <li key={student.id}>
            <button onClick={() => drop(student.id)}>Drop</button>{" "}
            <Link to={`/students/${student.id}`}>
              {student.user.first_name} {student.user.last_name} (id:{" "}
              {student.id})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
