const nameEl = document.querySelector('.brand-name')
const titleEl = document.querySelector('.title')
const taglineEl = document.querySelector('.tagline')
const gridEl = document.querySelector('.cards-grid')
const contactsEl = document.querySelector('.contacts')

async function load(){
  let data = null
  const inline = document.getElementById('content')
  if(inline && inline.textContent){
    try{ data = JSON.parse(inline.textContent) }catch{}
  }
  if(!data){
    try{
      const res = await fetch('./content.json', { cache: 'no-store' })
      data = await res.json()
    }catch{}
  }
  const name = (data.profile && data.profile.name) || '小红'
  nameEl.textContent = name
  titleEl.textContent = name
  if(data.profile && data.profile.tagline) taglineEl.textContent = data.profile.tagline
  gridEl.innerHTML = ''
  if(Array.isArray(data.links)){
    const selected = data.links.slice(2) // 删除前两张卡片，保留第3-5张
    const customTitles = ['马克思练习题','习惯日历','我的需求文档']
    selected.forEach((u, i) => {
      const card = document.createElement('a')
      card.className = 'card reveal'
      card.href = u
      card.target = '_blank'
      card.rel = 'noopener'
      const thumb = document.createElement('div')
      thumb.className = 'thumb'
      const title = document.createElement('h3')
      title.className = 'title'
      title.textContent = customTitles[i] || u.replace(/^https?:\/\//,'').split('/')[0]
      const url = document.createElement('div')
      url.className = 'url'
      url.textContent = u
      card.appendChild(thumb)
      card.appendChild(title)
      card.appendChild(url)
      gridEl.appendChild(card)
    })
  }
  contactsEl.innerHTML = ''
  if(data.contact){
    Object.entries(data.contact).forEach(([k,v]) => {
      if(v){
        const row = document.createElement('div')
        row.className = 'contact-item'
        const label = document.createElement('span')
        label.className = 'label'
        label.textContent = k
        const value = document.createElement('a')
        value.href = k === 'email' ? `mailto:${v}` : v
        value.textContent = v
        row.appendChild(label)
        row.appendChild(value)
        contactsEl.appendChild(row)
      }
    })
  }
}

load()

const heroSection = document.getElementById('intro')
if(heroSection){
  heroSection.classList.add('reveal')
  requestAnimationFrame(()=>heroSection.classList.add('visible'))
}

const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible')
      io.unobserve(e.target)
    }
  })
},{threshold:.2, rootMargin:'0px 0px -10% 0px'})

document.querySelectorAll('.reveal').forEach(el=>io.observe(el))
