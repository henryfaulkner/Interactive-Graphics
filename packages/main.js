$("#simple-wireframe-sphere").click(function () {
  if (typeof TinyMCE == "undefined") {
    $.getScript("interactive-text.js", function () {
      removeScene();
    });
    $.getScript("simple-wireframe-sphere.js", function () {});
  }
});
