
window.Slider = function(container_div, callback, style_prefix, default_value) {
    var container = document.createElement("div");
    container.style.width = "100%";
    container.style.height = "0";
    container.style.position = "relative";
    container.classList.add("slider_container");
    if (style_prefix)
        container.classList.add(style_prefix + "slider_container");

    var left_gutter = document.createElement("div");
    left_gutter.classList.add("slider_left_gutter");

    var right_gutter = document.createElement("div");
    right_gutter.classList.add("slider_right_gutter");

    var knob_container = document.createElement("div");
    knob_container.style.width = "0";
    knob_container.style.height = "0";
    knob_container.style.top = "0";
    knob_container.style.position = "absolute";

    var knob = document.createElement("div");
    knob.classList.add("slider_knob");
    if (style_prefix)
        knob.classList.add(style_prefix + "slider_knob");

    knob.onmousedown = mouse_down;
    knob.ontouchstart = touch_start;

    container_div.appendChild(container);
    container.appendChild(left_gutter);
    container.appendChild(right_gutter);
    container.appendChild(knob_container);
    knob_container.appendChild(knob);

    this.dragged = false;
    let self = this;

    var percentage = default_value === undefined ? 0.5 : default_value;
    layout();
    callback(percentage);

    this.set_value = function(p) {
        percentage = p;
        layout();
    }

    this.knob_div = function() {
        return knob;
    }

    function layout() {
        var width = container.getBoundingClientRect().width;
        left_gutter.style.width = width * percentage + "px";
        right_gutter.style.width = (width * (1.0 - percentage)) + "px";
        right_gutter.style.left = width * percentage + "px";
        knob_container.style.left = (width * percentage) + "px";
    }

    var selection_offset;

    function mouse_down(e) {
        start_drag(e.clientX);
        window.addEventListener("mousemove", mouse_move, false);
        window.addEventListener("mouseup", mouse_up, false);
        e.preventDefault();
    }

    function touch_start(e) {
        start_drag(e.touches[0].clientX);
        window.addEventListener("touchmove", touch_move, { passive: false });
        window.addEventListener("touchend", touch_end, false);
        e.preventDefault();
    }

    function start_drag(clientX) {
        var knob_rect = knob_container.getBoundingClientRect();
        selection_offset = clientX - knob_rect.left - knob_rect.width / 2;
        self.dragged = true;
        $(".npb").show();
    }

    function mouse_move(e) {
        move_knob(e.clientX);
    }

    function touch_move(e) {
        move_knob(e.touches[0].clientX);
        e.preventDefault();
    }

    function move_knob(clientX) {
        var container_rect = container.getBoundingClientRect();
        var x = clientX - selection_offset - container_rect.left;
        var p = Math.max(0, Math.min(1.0, x / container_rect.width));
        if (percentage != p) {
            percentage = p;
            layout();
            callback(p);
        }
    }

    function mouse_up() {
        end_drag();
        window.removeEventListener("mousemove", mouse_move, false);
        window.removeEventListener("mouseup", mouse_up, false);
    }

    function touch_end() {
        end_drag();
        window.removeEventListener("touchmove", touch_move, false);
        window.removeEventListener("touchend", touch_end, false);
    }

    function end_drag() {
        self.dragged = false;
        $(".npb").hide();
    }
}
