(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();const s=[{href:"/",label:"Home",title:"EchoPlex"},{href:"/ecosystem.html",label:"Ecosystem",title:"The Ecosystem"},{href:"/creator-hub.html",label:"Creator Hub",title:"Creator Hub"},{href:"/story-hub.html",label:"Story Hub",title:"Story Hub"},{href:"/game-hub.html",label:"Game Hub",title:"Game Hub"},{href:"/marketplace.html",label:"Marketplace",title:"Marketplace"},{href:"/communities.html",label:"Communities",title:"Communities"},{href:"/tradefusion.html",label:"TradeFusion",title:"TradeFusion"},{href:"/roadmap.html",label:"Roadmap",title:"Roadmap"},{href:"/vision.html",label:"Vision",title:"Our Vision"},{href:"/about.html",label:"About",title:"About EchoPlex"},{href:"/contact.html",label:"Contact",title:"Contact"}];function c(){const t=window.location.pathname;return t==="/"||t==="/index.html"||t.endsWith("/")?"/":t}function u(){const t=c();return s.findIndex(n=>n.href===t)}function m(){const t=document.getElementById("site-nav");if(!t)return;const n=c(),i=s.map(l=>`<li><a href="${l.href}" class="nav-link ${l.href===n?"active":""}" data-link>${l.label}</a></li>`).join("");t.innerHTML=`
    <div class="nav-inner">
      <a href="/" class="nav-brand" data-link>
        <span class="nav-brand-icon">E</span>
        <span>EchoPlex</span>
      </a>
      <ul class="nav-links">${i}</ul>
      <div class="nav-actions">
        <button class="nav-search" aria-label="Search" id="nav-search-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <button class="nav-mobile-toggle" aria-label="Toggle menu" id="mobile-toggle" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <ul class="mobile-menu-list">
        ${s.map(l=>`<li><a href="${l.href}" class="mobile-menu-link ${l.href===n?"active":""}" data-link>${l.label}</a></li>`).join("")}
      </ul>
    </div>
  `;const a=document.getElementById("mobile-toggle"),e=document.getElementById("mobile-menu");a.addEventListener("click",()=>{const l=e.classList.toggle("open");a.classList.toggle("open",l),a.setAttribute("aria-expanded",l),document.body.style.overflow=l?"hidden":""}),e.querySelectorAll("a").forEach(l=>{l.addEventListener("click",()=>{e.classList.remove("open"),a.classList.remove("open"),a.setAttribute("aria-expanded","false"),document.body.style.overflow=""})}),document.getElementById("nav-search-btn").addEventListener("click",()=>{alert("Search is coming soon.")});const r=()=>{t.classList.toggle("scrolled",window.scrollY>8)};window.addEventListener("scroll",r,{passive:!0}),r()}function h(){const t=document.getElementById("breadcrumbs");if(!t)return;const n=c();if(n==="/"){t.innerHTML="";return}const i=s.find(a=>a.href===n);i&&(t.innerHTML=`
    <div class="breadcrumbs">
      <span class="breadcrumb-item"><a href="/" data-link>Home</a></span>
      <span class="breadcrumb-separator">/</span>
      <span class="breadcrumb-current">${i.label}</span>
    </div>
  `)}function f(){const t=document.getElementById("page-nav");if(!t)return;const n=u();if(n<0)return;const i=n>0?s[n-1]:null,a=n<s.length-1?s[n+1]:null;let e="";i?e+=`
      <a href="${i.href}" class="page-nav-link prev" data-link>
        <span class="page-nav-direction">← Previous</span>
        <span class="page-nav-title">${i.label}</span>
      </a>`:e+="<div></div>",a?e+=`
      <a href="${a.href}" class="page-nav-link next" data-link>
        <span class="page-nav-direction">Next →</span>
        <span class="page-nav-title">${a.label}</span>
      </a>`:e+="<div></div>",t.innerHTML=e}function p(){const t=document.getElementById("site-footer");if(!t)return;const n=s.slice(2,8),i=s.slice(8);t.innerHTML=`
    <div class="footer-content">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="footer-brand-name">
            <span class="nav-brand-icon">E</span>
            <span>EchoPlex</span>
          </div>
          <p class="footer-brand-desc">A unified digital entertainment ecosystem where creativity, gaming, community, and commerce grow together.</p>
        </div>
        <div class="footer-col">
          <h4>Ecosystem</h4>
          <ul>
            <li><a href="/ecosystem.html" data-link>Overview</a></li>
            ${n.map(a=>`<li><a href="${a.href}" data-link>${a.label}</a></li>`).join("")}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <ul>
            ${i.map(a=>`<li><a href="${a.href}" data-link>${a.label}</a></li>`).join("")}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="/roadmap.html" data-link>Roadmap</a></li>
            <li><a href="/vision.html" data-link>Vision</a></li>
            <li><a href="/about.html" data-link>About</a></li>
            <li><a href="/contact.html" data-link>Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="/contact.html" data-link>Get in Touch</a></li>
            <li><a href="/communities.html" data-link>Join Community</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} EchoPlex. All rights reserved.</span>
        <span>Entertainment first. Ownership second. Rewards third.</span>
      </div>
    </div>
  `}function b(){const t=new IntersectionObserver(n=>{n.forEach(i=>{i.isIntersecting&&(i.target.classList.add("is-visible"),t.unobserve(i.target))})},{threshold:.1,rootMargin:"0px 0px -60px 0px"});document.querySelectorAll(".fade-up").forEach(n=>t.observe(n))}function v(){document.body.style.opacity="0",document.body.style.transition="opacity 0.3s ease",requestAnimationFrame(()=>{document.body.style.opacity="1"})}function d(){m(),h(),f(),p(),b(),v()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d();
