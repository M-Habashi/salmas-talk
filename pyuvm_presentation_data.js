(function () {
  window.PYUVM_PRESENTATION = {
    render: function renderPresentation() {
      return ['<div class="grid-bg"></div>', ...(window.PYUVM_SLIDES || [])].join('');
    }
  };
})();
