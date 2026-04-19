'use strict';
/**
 * Admin v3 - Shared Navigation
 *
 * Purpose: Render shared navigation header for admin-v3 pages.
 * This is a minimal component to reduce duplicated page chrome and keep
 * the internal-only status of admin-v3 visible.
 */

var adminV3Nav = (function () {
  function renderNav(containerId, currentPage) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var links = [
      { page: 'workbench', label: 'Workbench', href: 'admin-v3-workbench.html', active: false },
      { page: 'cases', label: 'Cases', href: 'admin-v3-cases.html', active: false },
      { page: 'calendar', label: 'Calendar', href: 'admin-v3-calendar.html', active: false },
      { page: 'income', label: 'Income', href: 'admin-v3-income.html', active: false }
    ];

    var html = '<nav class="admin-v3-nav">';
    
    // Active pages
    html += '<div class="admin-v3-nav-section">';
    links.forEach(function (link) {
      var activeClass = link.page === currentPage ? ' active' : '';
      html += '<a href="' + link.href + '" class="admin-v3-nav-link' + activeClass + '">' + link.label + '</a>';
    });
    html += '</div>';

    html += '</nav>';
    html += '<div style="margin:12px 0 0; padding:12px 14px; border:1px solid #f3d4a3; background:#fff7e8; color:#5f4300; border-radius:8px; font-size:13px; line-height:1.45;">';
    html += '<strong>Admin v3 is internal-only operational tooling.</strong> It does not publish to the public website. ';
    html += 'Cases is the primary CRM workflow. Contacts and Venues remain available by direct URL for legacy reference only. ';
    html += 'Public-facing editorial changes still belong in admin-v2 and the explicit public-safe mirror flow.';
    html += '</div>';
    container.innerHTML = html;
  }

  function renderSignOut(containerId, callback) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var html = '<button id="adminV3SignOutBtn" class="admin-v3-sign-out">Sign Out</button>';
    container.innerHTML = html;

    document.getElementById('adminV3SignOutBtn').addEventListener('click', function () {
      if (callback) callback();
    });
  }

  return {
    renderNav: renderNav,
    renderSignOut: renderSignOut
  };
})();

if (typeof window !== 'undefined') {
  window.adminV3Nav = adminV3Nav;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = adminV3Nav;
}
