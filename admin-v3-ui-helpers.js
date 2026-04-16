// ─────────────────────────────────────────────────────────────────────────────
// ADMIN V3 UI HELPERS
// Shared UI utility functions for admin-v3 pages
// ─────────────────────────────────────────────────────────────────────────────

var adminV3UIHelpers = (function () {
  
  /**
   * Attach click handlers to action buttons in a list
   * @param {HTMLElement} listEl - The list element containing action buttons
   * @param {Object} actionHandlers - Map of action names to handler functions
   *   e.g., { edit: function(id) { ... }, delete: function(id) { ... } }
   */
  function attachActionHandlers(listEl, actionHandlers) {
    if (!listEl) return;
    
    listEl.querySelectorAll('[data-action]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var action = btn.getAttribute('data-action');
        var id = btn.getAttribute('data-id');
        if (action && actionHandlers[action]) {
          actionHandlers[action](id);
        }
      });
    });
  }

  return {
    attachActionHandlers: attachActionHandlers
  };
})();
