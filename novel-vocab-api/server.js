const express = require('express');
const cors = require('cors');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());
app.use(cors()); // 公開後は origin を絞るのが安全

const DATA_FILE = process.env.DATA_FILE || path.join(process.cwd(), 'db', 'vocab.json');

async function ensureFile() {
  await fsp.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try { await fsp.access(DATA_FILE, fs.constants.F_OK); }
  catch { await fsp.writeFile(DATA_FILE, '[]', 'utf-8'); }
}
async function loadAll() {
  await ensureFile();
  const raw = await fsp.readFile(DATA_FILE, 'utf-8');
  try { return JSON.parse(raw); } catch { return []; }
}
async function saveAll(rows) {
  const tmp = DATA_FILE + '.tmp';
  await fsp.writeFile(tmp, JSON.stringify(rows, null, 2), 'utf-8');
  await fsp.rename(tmp, DATA_FILE);
}
function validate(p) {
  const e=[]; if(!p.term)e.push('term'); if(!p.yomi)e.push('yomi'); if(!p.meaning)e.push('meaning');
  return e;
}

app.get('/health', (req,res)=>res.json({ok:true}));
app.get('/vocab', async (req,res)=>{ const all=await loadAll(); all.sort((a,b)=>a.term>b.term?1:-1); res.json(all); });
app.post('/vocab', async (req,res)=>{
  const bad = validate(req.body||{}); if(bad.length) return res.status(400).json({error:'Missing '+bad.join(', ')});
  const all = await loadAll();
  const row = { id:nanoid(8), term:String(req.body.term), yomi:String(req.body.yomi), meaning:String(req.body.meaning),
                createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
  all.push(row); await saveAll(all); res.json(row);
});
app.put('/vocab/:id', async (req,res)=>{
  const all = await loadAll(); const i = all.findIndex(r=>r.id===req.params.id);
  if(i<0) return res.status(404).json({error:'not found'});
  const cur = all[i];
  const next = { ...cur,
    term: req.body.term ?? cur.term, yomi: req.body.yomi ?? cur.yomi, meaning: req.body.meaning ?? cur.meaning,
    updatedAt:new Date().toISOString()
  };
  const bad = validate(next); if(bad.length) return res.status(400).json({error:'Missing '+bad.join(', ')});
  all[i]=next; await saveAll(all); res.json(next);
});
app.delete('/vocab/:id', async (req,res)=>{
  const all = await loadAll(); const remain = all.filter(r=>r.id!==req.params.id);
  if(remain.length===all.length) return res.status(404).json({error:'not found'});
  await saveAll(remain); res.json({success:true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('API http://localhost:'+PORT));
