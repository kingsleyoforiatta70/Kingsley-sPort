import {useEffect,useState} from 'react'
import {HashRouter,Routes,Route,Link,useParams,useLocation,Navigate} from 'react-router-dom'
import {projects} from './data.js'

const EMAIL=import.meta.env.VITE_CONTACT_EMAIL||'hello@example.com'
const ENDPOINT=import.meta.env.VITE_FORM_ENDPOINT

function ThemeToggle(){
  const [t,setT]=useState(document.documentElement.dataset.theme||'dark')
  function flip(){
    const n=t==='dark'?'light':'dark'
    document.documentElement.dataset.theme=n
    try{localStorage.setItem('theme',n)}catch{}
    setT(n)
  }
  return <button type="button" className="theme" onClick={flip} aria-label={t==='dark'?'Switch to light mode':'Switch to dark mode'}>{t==='dark'?'☀️':'🌙'}</button>
}

function Nav(){
  const items=[['about','About'],['work','Work'],['skills','Skills'],['contact','Contact']]
  return(<nav><Link className="logo" to="/">KINGSLEY<b>.</b></Link>
    <ul>{items.map(([id,l])=><li key={id}><Link to="/" state={{to:id}}>{l}</Link></li>)}</ul>
    <div className="bar"><ThemeToggle/><Link className="btn pri" to="/" state={{to:'contact'}}>Hire me</Link></div></nav>)
}

const CODE=['SELECT *','FROM users','JOIN orders','WHERE id = $1','CREATE INDEX','{ _id: ObjectId }','BEGIN;','COMMIT;','PRIMARY KEY','db.find({})','GROUP BY','VACUUM','ORDER BY ts','$lookup','FOREIGN KEY','EXPLAIN']
const SHAPES=['dot','sq','ring','tri','dot','ring','sq','dot','tri','ring']

function SideRails(){
  const col=(list,cls)=><div className={'stream '+cls}>{[...list,...list].map((c,i)=><span key={i}>{c}</span>)}</div>
  return(<div className="rails" aria-hidden="true">
    <div className="rail left">{col(CODE,'s1')}{col([...CODE].reverse(),'s2')}</div>
    <div className="rail right">
      <div className="orbit"><i/><i/><i/></div>
      {SHAPES.map((s,i)=><b key={i} className={'shape '+s} style={{'--x':`${(i*37)%90}%`,'--d':`${14+(i%4)*4}s`,'--delay':`${-i*2.3}s`}}/>)}
    </div>
  </div>)
}

function ScrollHandler(){
  const {state,pathname}=useLocation()
  useEffect(()=>{
    if(state?.to){setTimeout(()=>document.getElementById(state.to)?.scrollIntoView({behavior:'smooth'}),50)}
    else window.scrollTo(0,0)
  },[state,pathname])
  return null
}

function ContactForm(){
  const [s,setS]=useState('idle'),[f,setF]=useState({name:'',email:'',message:''})
  const set=k=>e=>setF({...f,[k]:e.target.value})
  async function submit(e){
    e.preventDefault()
    if(!ENDPOINT){window.location.href=`mailto:${EMAIL}?subject=${encodeURIComponent('Project enquiry from '+f.name)}&body=${encodeURIComponent(f.message+'\n\n'+f.name+' ('+f.email+')')}`;return}
    setS('sending')
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(f)})
      if(!r.ok)throw new Error()
      setS('ok');setF({name:'',email:'',message:''})
    }catch{setS('err')}
  }
  return(<form className="form" onSubmit={submit}>
    <label>Your name<input required value={f.name} onChange={set('name')} autoComplete="name"/></label>
    <label>Your email<input required type="email" value={f.email} onChange={set('email')} autoComplete="email"/></label>
    <label>What are you building?<textarea required rows="4" value={f.message} onChange={set('message')}/></label>
    <button className="btn pri" disabled={s==='sending'}>{s==='sending'?'Sending…':'Send message'}</button>
    {s==='ok'&&<p className="note ok" role="status">Message sent. I’ll reply soon.</p>}
    {s==='err'&&<p className="note err" role="alert">Message not sent. Check your connection and try again, or email {EMAIL}.</p>}
  </form>)
}

function Home(){return(<>
  <div className="wrap"><Nav/>
  <header className="hero">
    <div><p className="hi">Hey! I’m Kingsley 👋</p><h1>I design <em>data</em> that works for people.</h1>
    <p className="lead">Database Administrator and UI/UX Developer. I structure reliable databases, then design the interfaces people use to reach them.</p>
    <div className="cta"><Link className="btn pri" to="/" state={{to:'contact'}}>Start a project</Link><a className="btn" href="/resume.pdf">Download resume</a></div></div>
    <div className="av"><img alt="3D cartoon portrait of Kingsley in a red and white shirt" src="./avatar.jpg"/></div>
    <div className="roles">
      <div className="role"><h3>Database Administrator</h3><p>PostgreSQL, MongoDB, schema design</p></div>
      <div className="role"><h3>UI/UX Developer</h3><p>Figma, React, React Native</p></div>
      <div className="role"><h3>AI-assisted builder</h3><p>Full stack delivery with AI models</p></div></div>
  </header>
  <div className="about" id="about"><div><h2>Building ideas into dependable products.</h2></div><div>
    <p>I’m an Information Technology student at the University of Ghana, graduating in 2027, specializing in database administration. I run Richnic, a design and development practice. When a project needs a full stack, I build it with AI models, and I keep the database and the user experience in my own hands.</p>
    <div className="stats">{[['Specialty','Database Admin'],['Studying','BSc IT, Legon'],['Practice','Richnic'],['Based in','Ghana']].map(([a,b])=><div className="stat" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div></div></div></div>
  <section id="work"><div className="wrap"><h2>Selected work</h2><div className="grid">
    {projects.map(p=><Link key={p.slug} to={`/projects/${p.slug}`} className="card"><h3>{p.title}</h3><p>{p.short}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><span className="more">Read the case study</span></Link>)}
  </div></div></section>
  <section id="skills"><div className="wrap"><h2>What I do</h2><div className="skills">
    <div><h3>Database administration</h3><p>Schema design, PostgreSQL and MongoDB, queries, and keeping data organized and reliable.</p></div>
    <div><h3>UI/UX design</h3><p>Research, wireframes and polished interfaces in Figma, built for real users.</p></div>
    <div><h3>Front end and mobile</h3><p>React and React Native, with Node.js back ends when a project needs one.</p></div></div></div></section>
  <section id="contact"><div className="wrap"><div className="contact"><h2>Have a project in mind?</h2><p>Tell me what you’re building and I’ll reply with a plan.</p><ContactForm/></div></div></section>
  <footer>© 2026 Kingsley · Richnic</footer></>)}

function Project(){
  const {slug}=useParams(),p=projects.find(x=>x.slug===slug)
  if(!p)return <Navigate to="/" replace/>
  return(<div className="wrap"><Nav/><Link className="back" to="/" state={{to:'work'}}>← Back to all work</Link>
    <article className="detail"><h1>{p.title}</h1><p className="lead">{p.overview}</p>
    <div className="meta">{[['My role',p.role],['Status',p.status],['Stack',p.stack]].map(([a,b])=><div className="stat" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
    <h2>The problem</h2><p>{p.problem}</p>
    <h2>What I did</h2><ul>{p.did.map(d=><li key={d}>{d}</li>)}</ul>
    <h2>What’s next</h2><p>{p.next}</p>
    <div className="cta" style={{marginTop:32}}><Link className="btn pri" to="/" state={{to:'contact'}}>Start a project</Link></div></article>
    <footer>© 2026 Kingsley · Richnic</footer></div>)
}

export default function App(){return(<HashRouter><ScrollHandler/><SideRails/><Routes><Route path="/" element={<Home/>}/><Route path="/projects/:slug" element={<Project/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></HashRouter>)}
