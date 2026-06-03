(() => {
  const navItems = [
    { id: 'home', label: '首页', href: 'https://pptx.store/' },
    { id: 'workbench', label: 'PPT 工作台', href: 'https://app.pptx.store/workbench' },
    { id: 'book', label: '文献拆分', href: 'https://app.pptx.store/book-split' },
    { id: 'services', label: '服务介绍', href: 'https://pptx.store/services.html' },
    { id: 'about', label: '关于我们', href: 'https://pptx.store/about.html' },
  ];

  const currentScript = document.currentScript;
  const activePage = currentScript?.dataset.active || '';
  const header = document.querySelector('header.global-nav');

  if (!header) return;

  const linkHtml = navItems
    .map((item) => {
      const activeClass = item.id === activePage ? ' class="active"' : '';
      return `<a href="${item.href}"${activeClass}>${item.label}</a>`;
    })
    .join('');

  header.innerHTML = `
    <a href="https://pptx.store/" class="logo">PPTX.STORE</a>
    <div class="nav-links">
      ${linkHtml}
      <a href="https://app.pptx.store/workbench" class="btn-wave">立即体验 →</a>
    </div>
  `;
})();
