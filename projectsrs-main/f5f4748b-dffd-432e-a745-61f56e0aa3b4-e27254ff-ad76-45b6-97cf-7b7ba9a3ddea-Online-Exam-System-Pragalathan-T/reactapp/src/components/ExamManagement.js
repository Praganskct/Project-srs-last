import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './ExamManagement.css';

export default function ExamManagement({ username = 'teacher1' }) {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [exams, setExams] = useState([]);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      const res = await api.mgmtGetExamsByTeacher(username, { page, size });
      setExams(res.data || []);
    } catch { setErr('Failed to load'); }
  };
  useEffect(() => { load(); }, [username, page, size]);

  const toggle = async (examId, isActive) => {
    try {
      await api.mgmtUpdateExamStatus(examId, { isActive });
      setMsg('Status updated');
      load();
    } catch { setErr('Update failed'); }
  };

  return (
    <div className="xm">
      <h2>Exam Management</h2>
      {err && <p className="xm__err">{err}</p>}
      {msg && <p className="xm__msg">{msg}</p>}
      <ul className="xm__list">
        {exams.map((e, i) => (
          <li key={i}>
            <div>{e.title}</div>
            <div>{e.description}</div>
            <div>Duration: {e.duration}</div>
            <div>Active: {String(e.isActive)}</div>
            <button onClick={() => toggle(e.examId, !e.isActive)}>{e.isActive ? 'Deactivate' : 'Activate'}</button>
          </li>
        ))}
      </ul>
      <div className="xm__pager">
        <button disabled={page===0} onClick={() => setPage(p=>p-1)}>Prev</button>
        <span>Page {page+1}</span>
        <button onClick={() => setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  );
}