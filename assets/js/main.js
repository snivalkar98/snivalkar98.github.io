const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

async function loadContent(){
  const res = await fetch('data/content.json', {cache:'no-store'});
  const data = await res.json();

  document.title = `${data.profile.name} — ${data.meta.title}`;
  $('meta[name="description"]').setAttribute('content', data.meta.description);

  // Accent color
  document.documentElement.style.setProperty('--accent', data.meta.accent || '#7c3aed');

  // Hero
  $('#name').textContent = data.profile.name;
  $('#headline').textContent = data.profile.headline;
  $('#summary').textContent = data.profile.summary;

  $('#pill-company').textContent = `Now @ ${data.profile.company}`;
  $('#pill-exp').textContent = `${data.profile.experience_years}+ yrs`;

  $('#stat-company').textContent = `${data.profile.current_company_experience_years}+ yrs`;
  $('#stat-company-sub').textContent = `at ${data.profile.company}`;

  // Links
  const linksWrap = $('#links');
  linksWrap.innerHTML = '';
  data.links.forEach(l => {
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = l.href;
    a.target = l.href.startsWith('http') ? '_blank' : '_self';
    a.rel = 'noopener';
    a.textContent = l.label;
    linksWrap.appendChild(a);
  });

  // Skills
  const skillsWrap = $('#skills');
  skillsWrap.innerHTML = '';
  data.skills.forEach(s => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = s;
    skillsWrap.appendChild(span);
  });

  // Experience
  const expWrap = $('#experience');
  expWrap.innerHTML = '';
  data.experience.forEach(x => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <div class="top">
        <h3>${escapeHtml(x.role)} <span class="line">• ${escapeHtml(x.company)}</span></h3>
        <div class="period">${escapeHtml(x.period)}</div>
      </div>
      <ul class="bullets">
        ${(x.highlights || []).map(h => `<li>${escapeHtml(h)}</li>`).join('')}
      </ul>
    `;
    expWrap.appendChild(div);
  });

  // Projects
  const prWrap = $('#projects');
  prWrap.innerHTML = '';
  data.projects.forEach(p => {
    const div = document.createElement('div');
    div.className = 'tile';
    div.innerHTML = `
      <div class="project">
        <div class="thumb">
          ${p.image ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.title)}">` : ''}
        </div>
        <div class="meta">
          <h3>${escapeHtml(p.title)}</h3>
          <div class="line">${escapeHtml(p.tag || '')}</div>
          <p>${escapeHtml(p.description || '')}</p>
          <div class="actions">
            ${p.link ? `<a class="btn primary" href="${escapeAttr(p.link)}" target="_blank" rel="noopener">View</a>` : ''}
          </div>
        </div>
      </div>
    `;
    prWrap.appendChild(div);
  });

  // Footer year
  $('#year').textContent = new Date().getFullYear();
}

function escapeHtml(str=''){
  return String(str).replace(/[&<>"']/g, s => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[s]));
}
function escapeAttr(str=''){ return escapeHtml(str); }

function themeInit(){
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const theme = saved || (prefersLight ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', theme);
  $('#themeLabel').textContent = theme === 'light' ? 'Light' : 'Dark';
}

function themeToggle(){
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  $('#themeLabel').textContent = next === 'light' ? 'Light' : 'Dark';
}

function activeNav(){
  const sections = ['about','skillsSec','projectsSec','experienceSec','contactSec'].map(id => document.getElementById(id));
  const links = $$('.navlinks a');
  const y = window.scrollY + 140;
  let current = 'about';
  for (const s of sections){
    if (!s) continue;
    if (y >= s.offsetTop) current = s.id;
  }
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', activeNav);
window.addEventListener('DOMContentLoaded', async () => {
  themeInit();
  $('#themeBtn').addEventListener('click', themeToggle);
  await loadContent();
  activeNav();
});
