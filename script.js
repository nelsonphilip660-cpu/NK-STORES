// Branded NK-Stores page loader. It waits for the page to load, then fades away.
(() => {
  const loader = document.getElementById("siteLoader");
  if (!loader) return;

  let hidden = false;
  const hideLoader = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 750);
  };

  // Keep the entrance brief while allowing images and page assets to settle.
  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 650);
  } else {
    window.addEventListener("load", () => window.setTimeout(hideLoader, 450), { once: true });
    // Fallback for slow connections so the store remains usable.
    window.setTimeout(hideLoader, 3500);
  }
})();

const WHATSAPP_NUMBER = "2347045575203"; 
const money = value => "₦" + Number(value).toLocaleString("en-NG");
const hero = document.querySelector(".hero");
const dots = [...document.querySelectorAll("#sliderDots button")];
const slideImages = [
  "chain.jpeg",
  "wristwatch.jpeg",
  "wwristwatch1.jpeg",
  "bag.jpeg",
  "chain1.jpeg",
  "bag1.jpeg"
];
let slide = 0;
function setSlide(index){
  slide=(index+slideImages.length)%slideImages.length;
  hero.style.setProperty("--hero-image", `url("${slideImages[slide]}")`);
  hero.classList.add("slider-changing");
  setTimeout(()=>hero.classList.remove("slider-changing"),350);
  dots.forEach((d,i)=>d.classList.toggle("active",i===slide));
  const number=document.querySelector("#slideNumber");
  if(number)number.textContent=`${String(slide+1).padStart(2,"0")} — 06`;
}
document.querySelector("#prevSlide")?.addEventListener("click",()=>setSlide(slide-1));
document.querySelector("#nextSlide")?.addEventListener("click",()=>setSlide(slide+1));
dots.forEach((d,i)=>d.addEventListener("click",()=>setSlide(i)));
let autoSlide=setInterval(()=>setSlide(slide+1),5500);
const menuToggle=document.querySelector(".menu-toggle"), nav=document.querySelector(".nav-links");
menuToggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.textContent=open?"×":"☰";});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuToggle?.setAttribute("aria-expanded","false");if(menuToggle)menuToggle.textContent="☰";}));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));
document.querySelector("#year").textContent=new Date().getFullYear();
let cart=[];
const drawer=document.querySelector("#cartDrawer"), backdrop=document.querySelector("#cartBackdrop"), cartItems=document.querySelector("#cartItems"), cartCount=document.querySelector("#cartCount"), drawerCount=document.querySelector("#drawerCount"), cartTotal=document.querySelector("#cartTotal");
const toast=document.querySelector("#toast");let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
function openCart(){drawer.classList.add("open");backdrop.classList.add("open");drawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){drawer.classList.remove("open");backdrop.classList.remove("open");drawer.setAttribute("aria-hidden","true");document.body.style.overflow="";}
document.querySelector("#cartOpen").addEventListener("click",openCart);document.querySelector("#cartClose").addEventListener("click",closeCart);backdrop.addEventListener("click",closeCart);document.querySelector("#continueShopping").addEventListener("click",closeCart);
function addProduct(card){const item={id:card.dataset.id,name:card.dataset.name,price:Number(card.dataset.price),image:card.dataset.image,qty:1};const found=cart.find(p=>p.id===item.id);if(found)found.qty++;else cart.push(item);renderCart();showToast(`${item.name} added to your bag`);}
document.querySelectorAll(".product-card").forEach(card=>card.querySelector(".quick-add").addEventListener("click",()=>openProductDetails(card)));
const productModal=document.querySelector("#productModal"), productModalBackdrop=document.querySelector("#productModalBackdrop");
let activeProductCard=null, activeGalleryIndex=0;
function openProductDetails(card){
  activeProductCard=card;activeGalleryIndex=0;
  const gallery=(card.dataset.gallery||card.dataset.image).split("|");
  document.querySelector("#modalProductName").textContent=card.dataset.name;
  document.querySelector("#modalProductPrice").textContent=money(card.dataset.price);
  document.querySelector("#modalProductDescription").textContent=`A versatile NK-Stores piece selected for everyday styling. Ask our seller to confirm available sizes, colours and current stock before ordering.`;
  document.querySelector("#modalMainImage").src=gallery[0];
  document.querySelector("#modalMainImage").alt=card.dataset.name;
  document.querySelector("#modalThumbs").innerHTML=gallery.slice(0,3).map((src,i)=>`<button class="modal-thumb ${i===0?'active':''}" data-index="${i}" aria-label="View product image ${i+1}"><img src="${src}" alt="${card.dataset.name} view ${i+1}"></button>`).join("");
  document.querySelectorAll(".modal-thumb").forEach(btn=>btn.addEventListener("click",()=>{activeGalleryIndex=Number(btn.dataset.index);document.querySelector("#modalMainImage").src=gallery[activeGalleryIndex];document.querySelectorAll(".modal-thumb").forEach((b,i)=>b.classList.toggle("active",i===activeGalleryIndex));}));
  productModal.classList.add("open");productModalBackdrop.classList.add("open");productModal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeProductDetails(){productModal.classList.remove("open");productModalBackdrop.classList.remove("open");productModal.setAttribute("aria-hidden","true");document.body.style.overflow="";}
document.querySelector("#productModalClose").addEventListener("click",closeProductDetails);
productModalBackdrop.addEventListener("click",closeProductDetails);
document.querySelector("#modalAddToCart").addEventListener("click",()=>{if(activeProductCard)addProduct(activeProductCard);closeProductDetails();openCart();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProductDetails();closeCart();}});

function renderCart(){const count=cart.reduce((sum,p)=>sum+p.qty,0),total=cart.reduce((sum,p)=>sum+p.price*p.qty,0);cartCount.textContent=count;drawerCount.textContent=`(${count})`;cartTotal.textContent=money(total);if(!cart.length){cartItems.innerHTML='<div class="empty-cart"><span>♡</span><p>Your bag is waiting for something good.</p><button class="text-link" id="continueShopping">Continue shopping ↗</button></div>';document.querySelector("#continueShopping").addEventListener("click",closeCart);return;}cartItems.innerHTML=cart.map(p=>`<div class="cart-item"><img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="qty-controls"><button data-action="minus" data-id="${p.id}" aria-label="Decrease quantity">−</button><span>${p.qty}</span><button data-action="plus" data-id="${p.id}" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-action="remove" data-id="${p.id}" aria-label="Remove ${p.name}">×</button></div>`).join("");cartItems.querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>{const item=cart.find(p=>p.id===btn.dataset.id);if(!item)return;if(btn.dataset.action==="plus")item.qty++;if(btn.dataset.action==="minus")item.qty--;if(btn.dataset.action==="remove")item.qty=0;cart=cart.filter(p=>p.qty>0);renderCart();}));}
document.querySelector("#checkoutButton").addEventListener("click",()=>{if(!cart.length){showToast("Add a product to your bag first");return;}if(WHATSAPP_NUMBER==="234800000"){showToast("Set your WhatsApp number in script.js first");return;}const total=cart.reduce((sum,p)=>sum+p.price*p.qty,0);const lines=cart.map(p=>`• ${p.name} x${p.qty} — ${money(p.price*p.qty)}`);const message=`Hello NK-Stores! I'd like to order:\n\n${lines.join("\n")}\n\nEstimated total: ${money(total)}\nPlease confirm availability, sizes/colours and delivery fee.`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");});
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));button.classList.add("active");document.querySelectorAll(".product-card").forEach(card=>{card.style.display=button.dataset.filter==="all"||card.dataset.category===button.dataset.filter?"":"none";});}));
const track=document.querySelector("#testimonialTrack"), reviews=[...track.children];let reviewIndex=0;
function visibleReviews(){return window.innerWidth<=520?1:window.innerWidth<=850?2:3;}
function updateReviews(){const count=visibleReviews(),max=Math.max(0,reviews.length-count);reviewIndex=Math.min(reviewIndex,max);const gap=16;const width=reviews[0].getBoundingClientRect().width;track.style.transform=`translateX(-${reviewIndex*(width+gap)}px)`;document.querySelector("#reviewProgress").style.width=`${((reviewIndex+count)/reviews.length)*100}%`;}
document.querySelector("#reviewPrev").addEventListener("click",()=>{reviewIndex=Math.max(0,reviewIndex-1);updateReviews();});document.querySelector("#reviewNext").addEventListener("click",()=>{reviewIndex=Math.min(reviews.length-visibleReviews(),reviewIndex+1);updateReviews();});window.addEventListener("resize",updateReviews);updateReviews();