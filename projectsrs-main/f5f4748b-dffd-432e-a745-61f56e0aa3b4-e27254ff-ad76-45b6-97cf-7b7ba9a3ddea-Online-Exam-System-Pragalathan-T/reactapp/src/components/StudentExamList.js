import React, { useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

export default function StudentExamList() {
    const [exams, setExams] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // UI controls (all optional; defaults preserve current behavior)
    const [q, setQ] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [status, setStatus] = useState(''); // active, upcoming, expired
    const [sortBy, setSortBy] = useState('title');
    const [sortDir, setSortDir] = useState('asc');
    const [page, setPage] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        setLoading(true);
        api.getAvailableExams()
            .then(res => {
                setExams(res.data);
            })
            .catch(() => {
                setError('Failed to load exams.');
            })
            .finally(() => setLoading(false));
    }, []);

    const processed = useMemo(() => {
        let list = exams || [];
        if (q) {
            const l = q.toLowerCase();
            list = list.filter(e => (e.title||'').toLowerCase().includes(l) || (e.description||'').toLowerCase().includes(l) || (e.topic||'').toLowerCase().includes(l));
        }
        if (difficulty) list = list.filter(e => (e.difficulty||'').toLowerCase() === difficulty.toLowerCase());
        if (status) {
            const now = new Date();
            list = list.filter(e => {
                const exp = e.expiryDate ? new Date(e.expiryDate) : null;
                if (status === 'active') return e.isActive === true;
                if (status === 'upcoming') return e.isActive === true && exp && exp > now;
                if (status === 'expired') return exp && exp < now;
                return true;
            });
        }
        list = [...list].sort((a,b) => {
            const dir = sortDir === 'desc' ? -1 : 1;
            if (sortBy === 'title') return ((a.title||'').localeCompare(b.title||'')) * dir;
            if (sortBy === 'duration') return ((a.duration||0) - (b.duration||0)) * dir;
            if (sortBy === 'difficulty') return ((a.difficulty||'').localeCompare(b.difficulty||'')) * dir;
            return 0;
        });
        return list;
    }, [exams, q, difficulty, status, sortBy, sortDir]);

    const paged = useMemo(() => {
        const start = page * pageSize;
        return processed.slice(start, start + pageSize);
    }, [processed, page]);

    if (loading) return <div>Loading...</div>;
    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Available Exams</h1>

            <div style={{ display:'flex', gap:12, marginBottom:12, flexWrap:'wrap' }}>
                <input placeholder="Search exams" value={q} onChange={(e)=>{ setPage(0); setQ(e.target.value); }} />
                <select value={difficulty} onChange={(e)=>{ setPage(0); setDifficulty(e.target.value); }}>
                    <option value="">All difficulties</option>
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                </select>
                <select value={status} onChange={(e)=>{ setPage(0); setStatus(e.target.value); }}>
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="expired">Expired</option>
                </select>
                <select value={sortBy} onChange={(e)=>{ setPage(0); setSortBy(e.target.value); }}>
                    <option value="title">Sort: Title</option>
                    <option value="duration">Sort: Duration</option>
                    <option value="difficulty">Sort: Difficulty</option>
                </select>
                <button onClick={()=> setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>Dir: {sortDir.toUpperCase()}</button>
            </div>

            <ul>
                {paged.map((exam) => (
                    <li key={exam.examId}>
                        <h2>{exam.title}</h2>
                        <p>{exam.description}</p>
                        <p>Duration: {exam.duration} minutes</p>
                    </li>
                ))}
            </ul>

            <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:12 }}>
                <button disabled={page===0} onClick={()=> setPage(p=>p-1)}>Prev</button>
                <span>Page {page+1}</span>
                <button disabled={(page+1)*pageSize >= processed.length} onClick={()=> setPage(p=>p+1)}>Next</button>
            </div>
        </div>
    );
}
