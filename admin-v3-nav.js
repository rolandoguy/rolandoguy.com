'use strict';
/**
 * Admin v3 - Shared Navigation
 *
 * Purpose: Render shared navigation header for admin-v3 pages.
 * This is a minimal component to reduce duplicated page chrome.
 */

var adminV3Nav = (function () {
  function renderNav(containerId, currentPage) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var links = [
      { page: 'workbench', label: 'Workbench', href: 'admin-v3-workbench.html', active: false },
      { page: 'cases', label: 'Cases', href: 'admin-v3-cases.html', active: false },
      { page: 'contacts', label: 'Contacts', href: 'admin-v3-contacts.html', active: false },
      { page: 'venues', label: 'Venues', href: 'admin-v3-venues.html', active: false },
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
