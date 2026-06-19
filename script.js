
// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:0.12});
revealEls.forEach(el=>io.observe(el));

// Header background on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', ()=>{
  header.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0,0,0,0.06)' : 'none';
});

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

const phoneNumber = '919876543210';
const cart = [];
const favorites = new Set();
const cartCount = document.querySelector('.cart-count');
const wishCount = document.querySelector('.wish-count');

function money(n){ return `₹${Number(n || 0).toLocaleString('en-IN')}`; }

function getCardData(card){
  const product = card?.dataset.product || card?.querySelector('h3')?.textContent?.trim() || 'Palakollu Pickle';
  const selected = card?.querySelector('.weight-options input:checked');
  const weight = selected?.value || '250gm';
  const price = Number(selected?.dataset.price || 0);
  const qty = Number(card?.querySelector('.qty-selector span')?.textContent?.trim() || 1);
  return { product, weight, price, qty };
}

function updateCardPrice(card){
  const {price} = getCardData(card);
  const priceEl = card.querySelector('[data-price-display]');
  if(priceEl){
    const old = priceEl.querySelector('.old');
    const firstText = [...priceEl.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if(firstText) firstText.textContent = money(price);
    else priceEl.prepend(money(price));
    if(old) old.textContent = ' ' + money(Math.round(price * 1.18));
  }
}

document.querySelectorAll('.product-card').forEach(card=>{
  updateCardPrice(card);
  card.querySelectorAll('.weight-options input').forEach(input=>{
    input.addEventListener('change', ()=>updateCardPrice(card));
  });
});

// Quantity selectors
document.querySelectorAll('.qty-selector').forEach(sel=>{
  const span = sel.querySelector('span');
  const [minus, plus] = sel.querySelectorAll('button');
  let qty = Number(span?.textContent || 1);
  minus?.addEventListener('click', ()=>{ qty = Math.max(1, qty-1); span.textContent = qty; });
  plus?.addEventListener('click', ()=>{ qty = Math.min(20, qty+1); span.textContent = qty; });
});

function renderCart(){
  const box = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-total');
  if(!box || !totalEl) return;
  if(cart.length === 0){
    box.textContent = 'Your cart is empty.';
    totalEl.textContent = 'Total: ₹0';
  }else{
    box.innerHTML = cart.map(item => `
      <div class="cart-line">
        <strong>${item.product}</strong>
        ${item.weight} × ${item.qty} — ${money(item.price * item.qty)}
      </div>
    `).join('');
    const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);
    totalEl.textContent = `Total: ${money(total)}`;
  }
  if(cartCount) cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0);
}

function renderFavorites(){
  const box = document.querySelector('.wishlist-items');
  if(!box) return;
  if(favorites.size === 0){
    box.textContent = 'No favorites yet.';
  }else{
    box.innerHTML = [...favorites].map(name => `<div class="wish-line"><strong>${name}</strong>Saved for later</div>`).join('');
  }
  if(wishCount) wishCount.textContent = favorites.size;
}

// Wishlist toggle
document.querySelectorAll('.wishlist-btn').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const card = btn.closest('.product-card');
    const product = getCardData(card).product;
    if(favorites.has(product)){
      favorites.delete(product);
      btn.classList.remove('active');
      btn.style.background = '';
      btn.style.color = '';
    }else{
      favorites.add(product);
      btn.classList.add('active');
      btn.style.background = 'rgb(107, 15, 26)';
      btn.style.color = 'rgb(255, 248, 240)';
    }
    renderFavorites();
  });
});

// Add to cart
document.querySelectorAll('.add-to-cart-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const card = btn.closest('.product-card');
    const item = getCardData(card);
    const existing = cart.find(x=>x.product===item.product && x.weight===item.weight && x.price===item.price);
    if(existing) existing.qty += item.qty;
    else cart.push(item);
    renderCart();
    openPanel('cart');
  });
});

// WhatsApp ordering with product, selected weight, selected price and quantity
document.querySelectorAll('.order-whatsapp').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    e.preventDefault();
    const item = getCardData(btn.closest('.product-card'));
    const total = item.price * item.qty;
    const msg = `Hi Palakollu Pickles, I want to order ${item.product} - ${item.weight}. Price: ${money(item.price)}. Quantity: ${item.qty}. Total: ${money(total)}. Please confirm delivery.`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  });
});

document.querySelector('.cart-whatsapp')?.addEventListener('click', ()=>{
  if(cart.length === 0){ alert('Your cart is empty.'); return; }
  const lines = cart.map(i=>`${i.product} - ${i.weight} × ${i.qty} = ${money(i.price*i.qty)}`);
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const msg = `Hi Palakollu Pickles, I want to order:\n${lines.join('\n')}\nTotal: ${money(total)}\nPlease confirm delivery.`;
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
});

const backdrop = document.getElementById('panelBackdrop');
function openPanel(type){
  closePanels();
  if(type === 'search') document.getElementById('searchPanel')?.classList.add('open');
  if(type === 'wishlist') document.getElementById('wishlistPanel')?.classList.add('open');
  if(type === 'cart') document.getElementById('cartPanel')?.classList.add('open');
  backdrop?.classList.add('open');
}
function closePanels(){
  document.querySelectorAll('.search-panel,.side-panel').forEach(p=>p.classList.remove('open'));
  backdrop?.classList.remove('open');
}
document.querySelector('.search-toggle')?.addEventListener('click', ()=>openPanel('search'));
document.querySelector('.wishlist-toggle')?.addEventListener('click', ()=>{ renderFavorites(); openPanel('wishlist'); });
document.querySelector('.cart-toggle')?.addEventListener('click', ()=>{ renderCart(); openPanel('cart'); });
document.querySelectorAll('.panel-close').forEach(btn=>btn.addEventListener('click', closePanels));
backdrop?.addEventListener('click', closePanels);

// Search products
function runSearch(){
  const q = document.getElementById('siteSearchInput')?.value.trim().toLowerCase();
  const resultBox = document.getElementById('searchResults');
  document.querySelectorAll('.product-card').forEach(c=>c.classList.remove('search-highlight'));
  if(!q){ resultBox.textContent = 'Type a product name to search.'; return; }
  const matches = [...document.querySelectorAll('.product-card')].filter(card => card.textContent.toLowerCase().includes(q));
  if(matches.length === 0){
    resultBox.textContent = 'No matching pickle found. Try mango, lemon, tomato, chicken, prawn, or chilli.';
    return;
  }
  resultBox.innerHTML = matches.map(card => `<div>${card.querySelector('h3')?.textContent || 'Product'} found in Best Sellers.</div>`).join('');
  closePanels();
  matches[0].scrollIntoView({behavior:'smooth', block:'center'});
  matches[0].classList.add('search-highlight');
  setTimeout(()=>matches[0].classList.remove('search-highlight'), 2200);
}
document.getElementById('siteSearchBtn')?.addEventListener('click', runSearch);
document.getElementById('siteSearchInput')?.addEventListener('keydown', e=>{ if(e.key==='Enter') runSearch(); });

renderCart();
renderFavorites();
