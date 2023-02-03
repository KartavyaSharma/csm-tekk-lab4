import React, { useEffect, useState } from "react";
import { Student as StudentType } from "../utils/types";
import { Attendance} from "../utils/types";
import { useParams } from "react-router";

interface StudentProps {}

export const Student = ({}: StudentProps) => {
  const [student, setStudent] = useState<StudentType>(undefined as never);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const { id } = useParams<string>();

  useEffect(() => {
    fetch(`/api/students/${id}/details`)
      .then((res) => res.json())
      .then((data) => {
        setStudent(data);
      });
    
    fetch(`/api/students/${id}/attendances`)
      .then((res) => res.json())
      .then((data) => {
        data.sort((a: Attendance, b: Attendance) => {
          new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setAttendances(data);
      });
  }, []);

  const selectStatus = (change: React.ChangeEvent<HTMLSelectElement>, date: String, id: number) => {
    const copy = [...attendances];
    copy.find((attendance) => attendance.date == date).presence = change.target.value;
    setAttendances(copy);

    fetch(`/api/students/${id}/attendances/`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        presence: change.target.value,
      }),
    });
  };

  return (
    <div>
      <h1>Student</h1>
      {student && (
        <div>
          <p>
            {student.user.first_name} {student.user.last_name} (id: {id})
          </p>
          <p>
            Course: {student.course.name} (id: {student.course.id})
          </p>
          <p>
            Mentor: {student.section.mentor.user.first_name}{" "}
            {student.section.mentor.user.last_name}
          </p>
          <ul>
            {attendances.map((attendance)=> {
              <li key={attendance.id}>
              {attendance.date}:{" "}
              <select
                defaultValue={attendance.presence}
                onChange={(change) => selectStatus(change, attendance.date, attendance.id)}>
                <option value="PR">Present</option>
                <option value="EX">Excused Absence</option>
                <option value="UN">Unexcused Absence</option>
              </select>
            </li>
            })
            }
          </ul>
        </div>
      )}
    </div>
  );
};
