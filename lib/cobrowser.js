var $co = jQuery.noConflict();

Cobrowse = {
  connected: false,
  
  mouse: { x: 0, y: 0, width: 0, height: 0 },
  
  createCta: function() {
    var cobrowse = $co("<div>").attr("id", "cobrowse")
    var cta = "https://www.daljs.org/cobrowser/assets/imgs/help.png"
    if ($co("#cobrowser").data("cta")) { cta = $co("#cobrowser").data("cta"); }
    
    var cta_img = $co("<img>").attr("src", cta)
    var cta = $co("<a>").attr("href", "#").attr("id", "cobrowse_cta").addClass("cobrowse_show_activate");
    cta_img.appendTo(cta)
    cta.appendTo(cobrowse)
    
    var wrapper = $co("<div>").attr("id", "cobrowse_wrapper");
    var start = $co("<a>").attr("href", "#").attr("id", "cobrowse_start").text("Connect")
    var already_have_code = $co("<a>").attr("href", "#").attr("id", "cobrowse_already_have").text("Already have an activation code?");
    start.appendTo(wrapper);
    already_have_code.appendTo(wrapper)
    
    var activation_code_form = $co("<form>").attr("id", "cobrowse_activation_code_form");
    var activation_code_form_input = $co("<input>").attr("type", "text").attr("id", "cobrowse_activation_code");
    var activation_code_form_submit = $co("<input>").attr("type", "submit").val("Start")
    activation_code_form_input.appendTo(activation_code_form)
    activation_code_form_submit.appendTo(activation_code_form)
    activation_code_form.appendTo(wrapper)
    
    wrapper.appendTo(cobrowse)
    cobrowse.appendTo("body")
  },
  
  createControlCentre: function() {
    var cobrowse_control_center = $co("<div>").attr("id", "cobrowse_control_center")
    var activation_code_text = $co("<input>").attr("id", "cobrowse_activation_code_text").val("3J7L").attr("readonly", true)
    var activation_code_label = $co("<label>").attr("for", "cobrowse_activation_code_text").attr("id", "cobrowse_activation_code_label").text("Your Session ID is")
    var destroy_session = $co("<a>").attr("href", "#").attr("id", "cobrowse_destroy_session").text("Disconnect")
    
    activation_code_label.appendTo(cobrowse_control_center)
    activation_code_text.appendTo(cobrowse_control_center)
    destroy_session.appendTo(cobrowse_control_center)
    cobrowse_control_center.appendTo("body")
  },
  
  addStyle: function() {
    var ss = document.createElement("link");
    ss.setAttribute("rel", "stylesheet");
    ss.setAttribute("type", "text/css");
    ss.setAttribute("href", "assets/css/style.css");
    document.getElementsByTagName("head")[0].appendChild(ss);
  },
  
  init: function() {
    Cobrowse.addStyle();
    Cobrowse.createCta();
    Cobrowse.createControlCentre();
    if ($co.cookie("cobrowse_channel") && $co.cookie("cobrowse_channel") != "NULL") {
      $co("#cobrowse").hide();
      Cobrowse.activate($co.cookie("cobrowse_channel"))
    } else {
      $co("#cobrowse_control_center").hide();
    }
  },
  
  setEvents: function() {
    if (!Cobrowse.eventsAreSet) {
      Cobrowse.eventsAreSet = true;
    }
  },
  
  connect: function() {
    Cobrowse.connected = true;
    Cobrowse.faye = new Faye.Client("https://www.daljs.org:9291/faye");
    $co.cookie("cobrowse_channel", Cobrowse.activation_code);
    
    Cobrowse.faye.subscribe(Cobrowse.channel + "/event", function(m) {
      if (m.event == "mousemove") {
        if (Cobrowse.mouse.id != m.id) {
          if ($co("#remote-pointer-" + m.id).length) {
            $co("#remote-pointer-" + m.id).animate({
              left: m.x,
              top: m.y
            }, 40);
          } else {
            var pointer = $co("<div>").addClass("remote-pointer").attr("id", "remote-pointer-" + m.id);
            var p = $co("<label />").text(m.id);
            pointer.appendTo("body");
          }
        }
      } else if (m.event == "click") {
        if ($co("#remote-pointer-" + m.id).length) {
          $co("#remote-pointer-" + m.id).addClass("click");
          setTimeout(function(){
            $co("#remote-pointer-" + m.id).removeClass("click");
          }, 500);
        }
      } else if (m.event == "field") {
        // if ($co("#remote-pointer-" + m.id).length) {
        //   $co(m.path).val(m.value);
        // }
      } else if (m.event == "page") {
        if (!Cobrowse.mouse.is_client) {
          var newDoc = document.open("text/html", "replace");
          newDoc.write(m.html);
          newDoc.close();
        }
      } else if (m.event == "disconnect") {
        $co("#remote-pointer-" + m.id).remove();
      }
    });
    
    if (Cobrowse.mouse.is_client) {
      Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "page", html: $co('html').html() });
    }

    Cobrowse.setEvents();
    Cobrowse.updateMouse();
  },
  
  updateMouse: function() {
    if (Cobrowse.connected) {
      Cobrowse.mouse.event = "mousemove";
      Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
      setTimeout(Cobrowse.updateMouse, 50);
    }
  },
  
  activate: function(code) {
    Cobrowse.activation_code = code.toUpperCase();
    Cobrowse.channel = "/" + Cobrowse.activation_code;
    $co("#cobrowse_activation_code_text").val(Cobrowse.activation_code);
    $co("#cobrowse").hide()
    $co("#cobrowse_control_center").show()
    Cobrowse.connect();
  },
  
  deactivate: function() {
    $co(".remote-pointer").remove()
    $co("#cobrowse_activation_code").val("")
    $co("#cobrowse_control_center, #cobrowse_start, #cobrowse_activation_code_form, #cobrowse_already_have").hide()
    $co("#cobrowse").show()
    Cobrowse.disconnect()
  },
  
  disconnect: function() {
    Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "disconnect", id: Cobrowse.mouse.id });
    Cobrowse.faye.disconnect()
    $co.removeCookie("cobrowse_channel");
    Cobrowse.connected = false;
    Cobrowse.faye = null;
    Cobrowse.activation_code = null;
    Cobrowse.channel = null;
  },
  
  uuid: function(short) {
    if (short == true) {
      var min = 1000;
      var max = 10000;
      var num = Math.floor(Math.random() * (max - min + 1)) + min;
      return num.toString();
    } else {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    }
  }
}

$co(document).ready(function(){
  Cobrowse.mouse.id = Cobrowse.uuid();
  Cobrowse.init();
});

$co(document).on("click", ".cobrowse_show_activate", function() {
  $co("#cobrowse_start, #cobrowse_already_have").toggle();
  return false;
});

$co(document).on("click", "#cobrowse_start", function() {
  Cobrowse.activate(Cobrowse.uuid(true).toUpperCase());
});

$co(document).on("click", "#cobrowse_already_have", function() {
  $co("#cobrowse_activation_code_form").show()
  return false;
});

$co(document).on("submit", "#cobrowse_activation_code_form", function() {
  var code = $co("#cobrowse_activation_code").val()
  Cobrowse.activate(code);
  return false;
});

$co(document).on("click", "#cobrowse_destroy_session", function() {
  Cobrowse.deactivate();
  return false;
});

$co(document).on("mousemove", "html, body", function(e) {
  if (Cobrowse.connected) {
    Cobrowse.mouse.x = e.pageX || e.clientX;
    Cobrowse.mouse.y = e.pageY || e.clientY;
    Cobrowse.mouse.width = $co(window).width();
    Cobrowse.mouse.height = $co(window).height();
  }
});

$co(document).on("click", "html, body", function() {
  if (Cobrowse.connected) {
    Cobrowse.mouse.event = "click";
    Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
  }
});

$co(document).on("keyup", "input, textarea, select", function() {
  // if (Cobrowse.connected) {
  //   Cobrowse.faye.publish(Cobrowse.channel + "/event", { id: Cobrowse.mouse.id, event: "field", path: $co(this).getPath(), value: $co(this).val() })
  // }
});

$co(window).scroll(function() {
  if (Cobrowse.connected) {
    Cobrowse.mouse.event = "scroll";
    Cobrowse.mouse.scrollTop = $co(window).scrollTop();
    Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
  }
});