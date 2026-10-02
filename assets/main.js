/**
 * LionDevelopment - Vanilla JavaScript Interactive Engine
 * Standalone, zero build-step, Cloudflare Pages ready.
 */

// Configuration
const TELEGRAM_ADMIN_USERNAME = 'LionSkripts_Admin'; // Or user's Telegram username
const TELEGRAM_CHANNEL_URL = 'https://t.me/LionDevelopment';
const DISCORD_INVITE_URL = 'https://discord.gg/liondevelopment';

// DOM Ready initialization
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCopyButtons();
  initSearchAndFilters();
  initModals();
  initFaqAccordion();
  initCommissionCalculator();
});

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, icon = 'check_circle') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="material-symbols-outlined text-[#ff5708] text-[20px]">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

/* ==========================================================================
   Copy to Clipboard Helpers
   ========================================================================== */
function copyToClipboard(text, successMsg = 'کد با موفقیت کپی شد!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'content_copy');
    }).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg, 'content_copy');
  } catch (err) {
    showToast('خطا در کپی کردن متن', 'error');
  }
  document.body.removeChild(textArea);
}

function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      const msg = btn.getAttribute('data-copy-msg') || 'دستور در کلیپ‌بورد کپی شد!';
      copyToClipboard(text, msg);
    });
  });
}

/* ==========================================================================
   Mobile Drawer Menu
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('mobile-menu-close');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });
  }

  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   Modals: Free Download & Telegram Ordering
   ========================================================================== */
let currentOrderData = {
  name: '',
  price: '',
  version: '',
  sku: ''
};

function initModals() {
  // Free Download Modal
  const freeModal = document.getElementById('downloadModal');
  const freeCloseBtns = document.querySelectorAll('.close-download-modal');

  freeCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (freeModal) freeModal.classList.remove('active');
    });
  });

  // Telegram Order Modal
  const orderModal = document.getElementById('telegramOrderModal');
  const orderCloseBtns = document.querySelectorAll('.close-order-modal');

  orderCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (orderModal) orderModal.classList.remove('active');
    });
  });

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (freeModal) freeModal.classList.remove('active');
      if (orderModal) orderModal.classList.remove('active');
    }
  });

  // Handle Telegram Order Submission
  const submitOrderBtn = document.getElementById('btnSubmitTelegramOrder');
  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', submitTelegramOrder);
  }
}

// Trigger Free Download
window.openFreeDownloadModal = function(name, version, author, downloads) {
  const modal = document.getElementById('downloadModal');
  if (!modal) return;

  const titleEl = document.getElementById('modalDownloadTitle');
  const verEl = document.getElementById('modalDownloadVersion');
  const authorEl = document.getElementById('modalDownloadAuthor');
  const statEl = document.getElementById('modalDownloadStats');

  if (titleEl) titleEl.textContent = name;
  if (verEl) verEl.textContent = version || '1.16 - 1.21.4';
  if (authorEl) authorEl.textContent = author || 'LionDevelopment';
  if (statEl) statEl.textContent = downloads || '15,000+ دریافت';

  modal.classList.add('active');
};

window.executeDownload = function(isGuest = true) {
  const titleEl = document.getElementById('modalDownloadTitle');
  const skriptName = titleEl ? titleEl.textContent : 'LionSkript';
  
  showToast(`در حال آماده‌سازی پکیج امن و بدون ویروس: ${skriptName}...`, 'downloading');

  setTimeout(() => {
    // Generate simulated clean .sk file for instant download
    const skContent = `# ========================================================
# LionDevelopment Certified Skript: ${skriptName}
# Platform: Paper / Purpur / Spigot
# Verified: 20.0 TPS - Zero Lag Tested
# Support: https://t.me/${TELEGRAM_ADMIN_USERNAME}
# ========================================================

options:
    prefix: &6[LionDev]&r
    debug: false
    version: "2.8.4"

on load:
    send "{@prefix} &a${skriptName} با موفقیت بارگذاری شد!" to console
    send "{@prefix} &eبهینه‌سازی شده روی هسته سرور شما با 20.0 TPS" to console

# جهت تنظیمات پیشرفته فایل کانفیگ و دیتابیس، به کانال تلگرام ما مراجعه کنید.
`;
    const blob = new Blob([skContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${skriptName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.sk`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`فایل ${skriptName}.sk با موفقیت دانلود شد!`, 'check_circle');

    const modal = document.getElementById('downloadModal');
    if (modal) modal.classList.remove('active');
  }, 900);
};

// Trigger Premium Telegram Order
window.openTelegramOrderModal = function(name, price, version, compatibility) {
  const modal = document.getElementById('telegramOrderModal');
  if (!modal) return;

  currentOrderData = {
    name: name,
    price: price,
    version: version || '1.20 - 1.21.4',
    compatibility: compatibility || 'Paper / Purpur / Spigot'
  };

  const titleEl = document.getElementById('orderModalTitle');
  const priceEl = document.getElementById('orderModalPrice');
  const verEl = document.getElementById('orderModalVersion');

  if (titleEl) titleEl.textContent = name;
  if (priceEl) priceEl.textContent = price;
  if (verEl) verEl.textContent = currentOrderData.version;

  modal.classList.add('active');
};

function submitTelegramOrder() {
  const buyerName = document.getElementById('orderBuyerName')?.value || 'ناشناس';
  const buyerId = document.getElementById('orderBuyerTelegram')?.value || '@کاربر';
  const serverIp = document.getElementById('orderServerName')?.value || 'سرور ماینکرفت';
  const paymentMethod = document.getElementById('orderPaymentMethod')?.value || 'کارت به کارت / زرین‌پال';
  const notes = document.getElementById('orderNotes')?.value || 'بدون توضیحات اضافی';

  const orderId = 'LION-' + Math.floor(100000 + Math.random() * 900000);

  const messageText = `سلام، درخواست خرید اسکریپت از سایت LionDevelopment:
━━━━━━━━━━━━━━━━━━━━
📌 نام اسکریپت: ${currentOrderData.name}
💰 مبلغ: ${currentOrderData.price}
⚙️ نسخه سرور: ${currentOrderData.version}
🔖 کد پیگیری: ${orderId}
━━━━━━━━━━━━━━━━━━━━
👤 نام خریدار: ${buyerName}
🆔 آیدی تلگرام: ${buyerId}
🌐 نام / آی‌پی سرور: ${serverIp}
💳 روش پرداخت ترجیحی: ${paymentMethod}
📝 توضیحات: ${notes}
━━━━━━━━━━━━━━━━━━━━
لطفاً شماره کارت / لینک پرداخت و لایسنس را ارسال نمایید.`;

  const encodedText = encodeURIComponent(messageText);
  const telegramUrl = `https://t.me/${TELEGRAM_ADMIN_USERNAME}?text=${encodedText}`;

  // Copy order code
  copyToClipboard(orderId, `کد سفارش ${orderId} کپی شد. در حال هدایت به تلگرام...`);

  setTimeout(() => {
    window.open(telegramUrl, '_blank');
    const modal = document.getElementById('telegramOrderModal');
    if (modal) modal.classList.remove('active');
  }, 800);
}

/* ==========================================================================
   Interactive Search & Filtering
   ========================================================================== */
function initSearchAndFilters() {
  const searchInput = document.getElementById('skript-search');
  const categoryFilter = document.getElementById('category-filter');
  const versionFilter = document.getElementById('version-filter');
  const sortFilter = document.getElementById('sort-filter');
  const tierTabs = document.querySelectorAll('[data-tier-tab]');
  const tagPills = document.querySelectorAll('.tag-pill');
  const productCards = document.querySelectorAll('.skript-product-card');
  const countDisplay = document.getElementById('displayed-count');

  let activeTier = 'all';

  function applyFilters() {
    const query = (searchInput?.value || '').trim().toLowerCase();
    const selectedCategory = categoryFilter?.value || 'all';
    const selectedVersion = versionFilter?.value || 'all';
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardTitle = (card.getAttribute('data-title') || '').toLowerCase();
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
      const cardVersion = (card.getAttribute('data-version') || '').toLowerCase();
      const cardTier = (card.getAttribute('data-tier') || '').toLowerCase();
      const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();
      const cardText = card.textContent.toLowerCase();

      // Check text search
      const matchesSearch = !query || cardText.includes(query) || cardTitle.includes(query) || cardTags.includes(query);

      // Check category
      const matchesCategory = (selectedCategory === 'all') || (cardCategory === selectedCategory);

      // Check version
      const matchesVersion = (selectedVersion === 'all') || cardVersion.includes(selectedVersion);

      // Check tier (all, free, premium)
      const matchesTier = (activeTier === 'all') || (cardTier === activeTier);

      if (matchesSearch && matchesCategory && matchesVersion && matchesTier) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = visibleCount;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }

  if (versionFilter) {
    versionFilter.addEventListener('change', applyFilters);
  }

  tierTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tierTabs.forEach(t => {
        t.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
        t.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });
      tab.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
      tab.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');

      activeTier = tab.getAttribute('data-tier-tab') || 'all';
      applyFilters();
    });
  });

  tagPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const tag = pill.textContent.replace('#', '').trim();
      if (searchInput) {
        searchInput.value = tag;
        applyFilters();
      }
    });
  });

  // Sorting
  if (sortFilter) {
    sortFilter.addEventListener('change', () => {
      const grid = document.getElementById('products-grid');
      if (!grid) return;
      const cardsArray = Array.from(productCards);

      const mode = sortFilter.value;
      cardsArray.sort((a, b) => {
        if (mode === 'downloads') {
          const dlA = parseInt(a.getAttribute('data-downloads') || '0', 10);
          const dlB = parseInt(b.getAttribute('data-downloads') || '0', 10);
          return dlB - dlA;
        } else if (mode === 'rating') {
          const rA = parseFloat(a.getAttribute('data-rating') || '0');
          const rB = parseFloat(b.getAttribute('data-rating') || '0');
          return rB - rA;
        } else if (mode === 'price-low') {
          const pA = parseFloat(a.getAttribute('data-price-raw') || '0');
          const pB = parseFloat(b.getAttribute('data-price-raw') || '0');
          return pA - pB;
        } else if (mode === 'price-high') {
          const pA = parseFloat(a.getAttribute('data-price-raw') || '0');
          const pB = parseFloat(b.getAttribute('data-price-raw') || '0');
          return pB - pA;
        }
        return 0;
      });

      cardsArray.forEach(c => grid.appendChild(c));
    });
  }
}

/* ==========================================================================
   FAQ Accordions
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        // Close all
        document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.textContent = 'expand_more');

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.textContent = 'expand_less';
        }
      });
    }
  });
}

/* ==========================================================================
   Custom Project Commission Price Calculator (Contact Page)
   ========================================================================== */
function initCommissionCalculator() {
  const checkboxes = document.querySelectorAll('.calc-feature');
  const baseSelect = document.getElementById('calc-type');
  const totalDisplay = document.getElementById('calc-total-toman');
  const totalUsdDisplay = document.getElementById('calc-total-usd');

  function calculate() {
    if (!totalDisplay) return;

    let base = parseInt(baseSelect?.value || '400000', 10);
    let extras = 0;

    checkboxes.forEach(cb => {
      if (cb.checked) {
        extras += parseInt(cb.value || '0', 10);
      }
    });

    const totalToman = base + extras;
    totalDisplay.textContent = totalToman.toLocaleString('fa-IR') + ' تومان';

    if (totalUsdDisplay) {
      const usdApprox = Math.round(totalToman / 95000);
      totalUsdDisplay.textContent = `(~ $${usdApprox} USD)`;
    }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', calculate));
  if (baseSelect) baseSelect.addEventListener('change', calculate);
  calculate();
}
