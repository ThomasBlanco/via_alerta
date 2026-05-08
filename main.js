/* ====================================================
   VíaAlerta — main.js
   Interactividad del dashboard ciudadano
   ==================================================== */

/* ---- MENÚ MÓVIL ---- */
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('abierto');
  });
  document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('abierto'));
  });
}

/* ---- LIKE EN TARJETAS ---- */
function likeReporte(btn) {
  const span = btn.querySelector('span');
  if (btn.classList.contains('activo')) {
    btn.classList.remove('activo');
    span.textContent = parseInt(span.textContent) - 1;
  } else {
    btn.classList.add('activo');
    span.textContent = parseInt(span.textContent) + 1;
  }
}

/* ---- TOGGLE COMENTARIOS ---- */
function toggleComentarios(btn) {
  const card = btn.closest('.reporte-card');
  const box = card.querySelector('.comentarios-box');
  const isHidden = box.hidden;
  box.hidden = !isHidden;
  btn.style.background = isHidden ? 'rgba(56,189,248,0.08)' : '';
  btn.style.borderColor = isHidden ? 'var(--accent)' : '';
  btn.style.color = isHidden ? 'var(--accent)' : '';
}

/* ---- ENVIAR COMENTARIO ANÓNIMO ---- */
function enviarComentario(inputId, lista) {
  const input = document.getElementById(inputId);
  const texto = input.value.trim();
  if (!texto) return;
  const div = document.createElement('div');
  div.className = 'comentario';
  div.innerHTML = `<strong>Anónimo:</strong> ${texto}`;
  lista.appendChild(div);
  input.value = '';
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  // Actualizar contador en el botón
  const card = lista.closest('.reporte-card');
  const btnCom = card.querySelector('.btn-comentar');
  const match = btnCom.textContent.match(/\d+/);
  if (match) {
    const nuevo = parseInt(match[0]) + 1;
    btnCom.textContent = `💬 Comentarios (${nuevo})`;
  }
}

/* ---- FORMULARIO DE REPORTE ---- */
function enviarReporte(e) {
  e.preventDefault();
  const form = document.getElementById('reporte-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  // Generar código de reporte
  const numero = Math.floor(100 + Math.random() * 900);
  const año = new Date().getFullYear();
  const codigo = `#VIA-${año}-${numero}`;
  document.getElementById('codigo-reporte').textContent = codigo;
  // Mostrar éxito
  form.hidden = true;
  const success = document.getElementById('form-success');
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
  document.getElementById('reporte-form').reset();
  document.getElementById('reporte-form').hidden = false;
  document.getElementById('form-success').hidden = true;
  document.getElementById('preview-foto').hidden = true;
}

/* ---- PREVIEW DE FOTO ---- */
function mostrarFoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('preview-foto');
      preview.hidden = false;
      preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa del daño reportado" />`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

/* ---- CONSULTA DE ESTADO ---- */
function buscarEstado() {
  const input = document.getElementById('codigo-busqueda');
  const codigo = input.value.trim();
  if (!codigo) return;
  const resultado = document.getElementById('estado-resultado');
  const codigoLabel = document.getElementById('codigo-resultado');
  // Normalizar entrada
  const codigoNorm = codigo.toUpperCase().startsWith('#') ? codigo.toUpperCase() : '#' + codigo.toUpperCase();
  codigoLabel.textContent = codigoNorm;
  resultado.hidden = false;
  resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('codigo-busqueda')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') buscarEstado();
});

/* ---- ANIMACIÓN DE ENTRADA SUAVE ---- */
const observerOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOpts);

document.querySelectorAll('.reporte-card, .stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

/* ---- HEADER SCROLL SHADOW ---- */
window.addEventListener('scroll', () => {
  const header = document.getElementById('site-header');
  if (window.scrollY > 10) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.4)';
  } else {
    header.style.boxShadow = 'none';
  }
});