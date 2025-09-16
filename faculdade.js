const DB_NAME = 'consultorioSimplesDB';
const DB_VERSION = 1;
let db;

function openDB(){
  return new Promise((res,rej)=>{
    const req = indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded = e =>{
      const idb = e.target.result;
      if(!idb.objectStoreNames.contains('pacientes')){
        idb.createObjectStore('pacientes',{keyPath:'id',autoIncrement:true});
      }
      if(!idb.objectStoreNames.contains('consultas')){
        idb.createObjectStore('consultas',{keyPath:'id',autoIncrement:true});
      }
    };
    req.onsuccess = e =>{ db = e.target.result; res(); };
    req.onerror = e => rej(e.target.error);
  });
}

function add(storeName,obj){
  return new Promise((res,rej)=>{
    const tx = db.transaction(storeName,'readwrite');
    const store = tx.objectStore(storeName);
    const rq = store.add(obj);
    rq.onsuccess = ()=>res(rq.result);
    rq.onerror = e=>rej(e.target.error);
  });
}

function getAll(storeName){
  return new Promise((res,rej)=>{
    const tx = db.transaction(storeName,'readonly');
    const store = tx.objectStore(storeName);
    const rq = store.getAll();
    rq.onsuccess = ()=>res(rq.result);
    rq.onerror = e=>rej(e.target.error);
  });
}

document.addEventListener('DOMContentLoaded',async()=>{
  await openDB();
  bindForms();
  refreshLists();
});

function bindForms(){
  document.getElementById('form-paciente').addEventListener('submit',async e=>{
    e.preventDefault();
    const p = {
      nome:document.getElementById('paciente-nome').value,
      telefone:document.getElementById('paciente-telefone').value,
      email:document.getElementById('paciente-email').value
    };
    await add('pacientes',p);
    e.target.reset();
    refreshLists();
  });

  document.getElementById('form-consulta').addEventListener('submit',async e=>{
    e.preventDefault();
    const c = {
      paciente:document.getElementById('consulta-paciente').value,
      data:document.getElementById('consulta-data').value,
      hora:document.getElementById('consulta-hora').value,
      procedimento:document.getElementById('consulta-procedimento').value
    };
    await add('consultas',c);
    e.target.reset();
    refreshLists();
  });
}

async function refreshLists(){
  const pats = await getAll('pacientes');
  const cons = await getAll('consultas');

  const lp = document.getElementById('lista-pacientes');
  lp.innerHTML = pats.length? '' : 'Nenhum paciente cadastrado';
  pats.forEach(p=>{
    const d = document.createElement('div');
    d.className='item';
    d.textContent = `${p.nome} — ${p.telefone||''} ${p.email||''}`;
    lp.appendChild(d);
  });

  const lc = document.getElementById('lista-consultas');
  lc.innerHTML = cons.length? '' : 'Nenhuma consulta agendada';
  cons.forEach(c=>{
    const d = document.createElement('div');
    d.className='item';
    d.textContent = `${c.paciente} — ${c.data} ${c.hora||''} (${c.procedimento})`;
    lc.appendChild(d);
  });
}

