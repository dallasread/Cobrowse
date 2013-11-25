Cobrowse = {
  connected: false,
  
  mouse: { x: 0, y: 0, width: 0, height: 0 },
  
  cta: function() {
    var cobrowse = $("<div>").attr("id", "cobrowse")
    
    var cta_img = $("<img>").attr("src", "assets/help.png")
    var cta = $("<a>").attr("href", "#").attr("id", "cobrowse_cta").addClass("cobrowse_show_activate");
    cta_img.appendTo(cta)
    cta.appendTo(cobrowse)
    
    var wrapper = $("<div>").attr("id", "cobrowse_wrapper");
    var start = $("<a>").attr("href", "#").attr("id", "cobrowse_start").text("Start")
    var already_have_code = $("<a>").attr("href", "#").attr("id", "cobrowse_already_have").text("Already have an activation code?");
    start.appendTo(wrapper);
    already_have_code.appendTo(wrapper)
    
    var activation_code_form = $("<form>").attr("id", "cobrowse_activation_code_form");
    var activation_code_form_input = $("<input>").attr("type", "text").attr("id", "cobrowse_activation_code");
    var activation_code_form_submit = $("<input>").attr("type", "submit").val("Start")
    activation_code_form_input.appendTo(activation_code_form)
    activation_code_form_submit.appendTo(activation_code_form)
    activation_code_form.appendTo(wrapper)
    
    wrapper.appendTo(cobrowse)
    cobrowse.appendTo("body")
  },
  
  controlCentre: function() {
    var cobrowse_control_center = $("<div>").attr("id", "cobrowse_control_center")
    var activation_code_text = $("<input>").attr("id", "cobrowse_activation_code_text").val("3J7L").attr("readonly", true)
    var activation_code_label = $("<label>").attr("for", "cobrowse_activation_code_text").attr("id", "cobrowse_activation_code_label").text("Your Session ID is")
    var destroy_session = $("<a>").attr("href", "#").attr("id", "cobrowse_destroy_session").text("Destroy Session")
    
    activation_code_label.appendTo(cobrowse_control_center)
    activation_code_text.appendTo(cobrowse_control_center)
    destroy_session.appendTo(cobrowse_control_center)
    cobrowse_control_center.appendTo("body")
  },
  
  init: function() {
    Cobrowse.cta();
    Cobrowse.controlCentre();
    if ($.cookie("cobrowse_channel") && $.cookie("cobrowse_channel") != "NULL") {
      
      Cobrowse.activate($.cookie("cobrowse_channel"))
    } else {
      $("#cobrowse").fadeIn();
    }
  },
  
  setEvents: function() {
    if (!Cobrowse.eventsAreSet) {
      Cobrowse.eventsAreSet = true;
    }
  },
  
  connect: function() {
    Cobrowse.connected = true;
    Cobrowse.faye = new Faye.Client('http://localhost:9292/faye');
    $.cookie("cobrowse_channel", Cobrowse.activation_code);
    
    Cobrowse.faye.subscribe(Cobrowse.channel + "/event", function(m) {
      if (m.event == "mousemove") {
        if (Cobrowse.mouse.id != m.id) {
          if ($("#remote-pointer-" + m.id).length) {
            $("#remote-pointer-" + m.id).animate({
              left: m.x,
              top: m.y
            }, 100);
          } else {
            var pointer = $("<div>").addClass("remote-pointer").attr("id", "remote-pointer-" + m.id).css("background-image", "url(imgs/pointer.png)");
            var p = $("<label />").text(m.id);
            pointer.appendTo("body");
          }
        }
      } else if (m.event == "click") {
        if ($("#remote-pointer-" + m.id).length) {
          $("#remote-pointer-" + m.id).addClass("click");
          setTimeout(function(){
            $("#remote-pointer-" + m.id).removeClass("click");
          }, 500);
        }
      } else if (m.event == "field") {
        // if ($("#remote-pointer-" + m.id).length) {
        //   $(m.path).val(m.value);
        // }
      } else if (m.event == "page") {
        if (!Cobrowse.mouse.is_client) {
          var newDoc = document.open("text/html", "replace");
          newDoc.write(m.html);
          newDoc.close();
        }
      } else if (m.event == "disconnect") {
        $("#remote-pointer-" + m.id).remove();
      }
    });
    
    if (Cobrowse.mouse.is_client) {
      Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "page", html: $('html').html() });
    }

    Cobrowse.setEvents();
    Cobrowse.updateMouse();
  },
  
  updateMouse: function() {
    if (Cobrowse.connected) {
      Cobrowse.mouse.event = "mousemove";
      Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
      setTimeout(Cobrowse.updateMouse, 110);
    }
  },
  
  activate: function(code) {
    Cobrowse.activation_code = code.toUpperCase();
    Cobrowse.channel = "/" + Cobrowse.activation_code;
    $("#cobrowse_activation_code_text").val(code);
    $("#cobrowse").fadeOut()
    $("#cobrowse_control_center").fadeIn()
    Cobrowse.connect();
  },
  
  deactivate: function() {
    Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "disconnect", id: Cobrowse.mouse.id });
    Cobrowse.faye.unsubscribe(Cobrowse.channel + "/event");
    Cobrowse.activation_code = null;
    Cobrowse.channel = null;
    $.cookie("cobrowse_channel", null);
    $(".remote-pointer").remove()
    $("#cobrowse_activation_code").val("")
    $("#cobrowse_control_center, #cobrowse_start, #cobrowse_activation_code_form, #cobrowse_already_have").fadeOut()
    $("#cobrowse").fadeIn()
    Cobrowse.disconnect()
  },
  
  disconnect: function() {
    Cobrowse.faye.disable("autodisconnect");
    Cobrowse.connected = false;
    Cobrowse.faye = null;    
  },
  
  uuid: function(short) {
    if (short == true) {
      return 'xxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    } else {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    }
  }
}

$(document).ready(function(){
  Cobrowse.mouse.id = Cobrowse.uuid();
  Cobrowse.init();
});

$(document).on("click", ".cobrowse_show_activate", function() {
  $("#cobrowse_start, #cobrowse_already_have").fadeToggle();
  return false;
});

$(document).on("click", "#cobrowse_start", function() {
  Cobrowse.activate(Cobrowse.uuid(true).toUpperCase());
});

$(document).on("click", "#cobrowse_already_have", function() {
  $("#cobrowse_activation_code_form").show()
  return false;
});

$(document).on("submit", "#cobrowse_activation_code_form", function() {
  var code = $("#cobrowse_activation_code").val()
  Cobrowse.activate(code);
  return false;
});

$(document).on("click", "#cobrowse_destroy_session", function() {
  Cobrowse.deactivate();
  return false;
});

$(document).on("mousemove", "html, body", function(e) {
  if (Cobrowse.connected) {
    Cobrowse.mouse.x = e.pageX || e.clientX;
    Cobrowse.mouse.y = e.pageY || e.clientY;
    Cobrowse.mouse.width = $(window).width();
    Cobrowse.mouse.height = $(window).height();
  }
});

$(document).on("click", "html, body", function() {
  if (Cobrowse.connected) {
    Cobrowse.mouse.event = "click";
    Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
  }
});

$(document).on("keyup", "input, textarea, select", function() {
  // if (Cobrowse.connected) {
  //   Cobrowse.faye.publish(Cobrowse.channel + "/event", { id: Cobrowse.mouse.id, event: "field", path: $(this).getPath(), value: $(this).val() })
  // }
});

$(window).scroll(function() {
  if (Cobrowse.connected) {
    Cobrowse.mouse.event = "scroll";
    Cobrowse.mouse.scrollTop = $(window).scrollTop();
    Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
  }
});