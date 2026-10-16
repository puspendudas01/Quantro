import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api/authApi';
import BrandLogo from '../components/BrandLogo';
import Spinner from '../components/Spinner';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email:'',
    password:'',
    fullName:'',
    role:'STUDENT',
    enrollmentNo:'',
    stream:'',
    section:'',
    studentYear:'',
    classRollNo:'',
    dateOfBirth:''
  });
  const [streamOther, setStreamOther] = useState('');
  const [sectionOther, setSectionOther] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        stream: form.stream === 'Other' ? streamOther : form.stream,
        section: form.section === 'Other' ? sectionOther : form.section,
      };
      const res = await register(payload);
      const user = res.data.data;
      authLogin(user);
      if (user.role === 'TEACHER') {
        setError('Registration successful! Please wait for admin approval before logging in.');
        setLoading(false); return;
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'10px 14px', border:'1.5px solid var(--border-input)', borderRadius:10, fontSize:14, outline:'none' };
  const lbl = { display:'block', fontSize:13, fontWeight:600, color:'var(--text-secondary)', marginBottom:6 };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20,
      backgroundImage:`linear-gradient(135deg, rgba(255,255,255,0.5), rgba(224,242,254,0.28)), url(${process.env.PUBLIC_URL}/landing/background.png)`,
      backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed' }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:14 }}>
            <BrandLogo variant="text" width={290} />
          </div>
          <h1 style={{ fontSize:24, fontWeight:700 }}>Create Account</h1>
          <p style={{ color:'var(--text-muted)', marginTop:4 }}></p>
        </div>
        
        <div style={{ background:'rgba(255,255,255,0.96)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.95)',
          borderRadius:20, boxShadow:'var(--shadow-md)', padding:'34px 30px', position:'relative' }}>
          <div style={{position:'absolute',top:0,left:24,right:24,height:4,borderRadius:'0 0 6px 6px',
            background:'linear-gradient(90deg,var(--brand-navy),var(--brand-teal),var(--brand-navy))'}} />
          <div style={{ marginBottom:22 }}>
              <label style={lbl}>I am a</label>
              <div style={{ display:'flex', gap:10 }}>
                {['STUDENT','TEACHER'].map(role => (
                  <button key={role} type="button" onClick={()=>setForm(f=>({...f,role}))}
                    style={{ flex:1, padding:'10px', border:'2px solid '+(form.role===role?'var(--primary)':'var(--border)'),
                      borderRadius:10, background:form.role===role?'var(--primary-light)':'#fff',
                      color:form.role===role?'var(--primary)':'var(--text-secondary)', fontWeight:600, cursor:'pointer' }}>
                    {role === 'STUDENT' ? ' Student' : ' Teacher'}
                  </button>
                ))}
              </div>
              {form.role === 'TEACHER' && (
                <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:8 }}>
                  Teacher accounts require admin approval before they can log in.
                </p>
              )}
            </div>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Full Name</label>
              <input value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} required placeholder="John Doe" style={inp} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={lbl}>Email address</label>
              <input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required={form.role==='TEACHER'} placeholder={'abc@gmail.com'} style={inp} />
            </div>

            {form.role === 'TEACHER' && (
              <div style={{ marginBottom:16 }}>
                <label style={lbl}>Password</label>
                <input type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required placeholder="Min 8 characters" minLength={8} style={inp} />
              </div>
            )}

            {form.role === 'STUDENT' && (
              <>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Enrollment No</label>
                  <input value={form.enrollmentNo} onChange={e=>setForm(f=>({...f,enrollmentNo:e.target.value}))} required placeholder="12023001234560" style={inp} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                  <div>
                    <label style={lbl}>Stream</label>
                    <select value={form.stream} onChange={e=>setForm(f=>({...f,stream:e.target.value}))} required style={{...inp, height:40}}>
                      <option value="" disabled>Choose stream</option>
                      <option value="CST">CST</option>
                      <option value="CSIT">CSIT</option>
                      <option value="CSE(NW)">CSE(NW)</option>
                      <option value="CSE(CS)">CSE(CS)</option>
                      <option value="Other">Other</option>
                    </select>
                    {form.stream === 'Other' && (
                      <input value={streamOther} onChange={e=>setStreamOther(e.target.value)} placeholder="Enter stream" style={{...inp, marginTop:8}} required />
                    )}
                  </div>
                  <div>
                    <label style={lbl}>Section</label>
                    <select value={form.section} onChange={e=>setForm(f=>({...f,section:e.target.value}))} required style={{...inp, height:40}}>
                      <option value="" disabled>Choose section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="Other">Other</option>
                    </select>
                    {form.section === 'Other' && (
                      <input value={sectionOther} onChange={e=>setSectionOther(e.target.value)} placeholder="Enter section" style={{...inp, marginTop:8}} required />
                    )}
                  </div>
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={lbl}>Admission Year</label>
                  <input value={form.studentYear} onChange={e=>setForm(f=>({...f,studentYear:e.target.value}))} required placeholder="2026" style={inp} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                  <div>
                    <label style={lbl}>Class Roll No</label>
                    <input value={form.classRollNo} onChange={e=>setForm(f=>({...f,classRollNo:e.target.value}))} required placeholder="23" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Date of Birth</label>
                    <input type="date" value={form.dateOfBirth} onChange={e=>setForm(f=>({...f,dateOfBirth:e.target.value}))} required style={inp} />
                  </div>
                </div>
                <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:-8, marginBottom:12 }}>
                  Student login password will be your date of birth in yyyy-MM-dd format.
                </p>
              </>
            )}
            {error && (
              <div style={{ background: error.includes('successful') ? '#f0fdf4' : '#fef2f2',
                border:'1px solid '+(error.includes('successful')?'#bbf7d0':'#fecaca'),
                color: error.includes('successful') ? 'var(--success)' : 'var(--danger)',
                padding:'10px 14px', borderRadius:10, fontSize:13, marginBottom:16 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'11px', background:'var(--primary-gradient)', color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {loading ? <Spinner size={18} color="#fff" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'var(--text-muted)' }}>
            Already have an account? <Link to="/" style={{ color:'var(--primary)', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
