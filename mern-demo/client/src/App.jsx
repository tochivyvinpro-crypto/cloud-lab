import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const API_URL = '/api/students';

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Không thể tải danh sách sinh viên');
      const data = await res.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadStudents = async () => {
      await fetchStudents();
    };
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let res;
      if (editingId) {
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể lưu sinh viên');
      setEditingId(null);
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi lưu:', error);
      setError(error.message);
    }
  };

  const handleEdit = (std) => {
    setEditingId(std._id);
    setForm({ studentId: std.studentId, name: std.name, email: std.email });
  };

  // Câu 62: Gọi API DELETE để xóa
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Không thể xóa sinh viên');
      }
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      setError(error.message);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '650px', margin: '0 auto' }}>
      <h2>Quản Lý Sinh Viên - Lab Docker Hub</h2>
      {error && <p role="alert" style={{ color: '#b42318' }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="Mã Sinh Viên" 
          value={form.studentId} 
          onChange={e => setForm({...form, studentId: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          placeholder="Họ và Tên" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: editingId ? '#28a745' : '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {editingId ? 'Cập Nhật Sinh Viên' : 'Thêm Sinh Viên'}
        </button>
      </form>

      <h3>Danh Sách Sinh Viên</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {students.map(std => (
          <li key={std._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #ccc' }}>
            <span><strong>{std.studentId}</strong> - {std.name} ({std.email})</span>
            <div>
              <button onClick={() => handleEdit(std)} style={{ backgroundColor: '#ffc107', color: 'black', border: 'none', marginRight: '5px', padding: '5px 10px', cursor: 'pointer' }}>Sửa</button>
              <button onClick={() => handleDelete(std._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;