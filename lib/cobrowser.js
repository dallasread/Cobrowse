var $co = jQuery.noConflict();

Cobrowse = {
  connected: false,
  
  mouse: { x: 0, y: 0, width: $co(window).width(), height: $co(window).height() },
  
  createCta: function() {
    var cobrowse = $co("<div>").attr("id", "cobrowse")
    var cta = "https://www.daljs.org/cobrowser/assets/imgs/help.png"
    Cobrowse.offline_ad = "Call our customer service department!";
    Cobrowse.online_ad = "";
    if ($co("#cobrowser").data("cta")) { cta = $co("#cobrowser").data("cta"); }
    if ($co("#cobrowser").data("offline")) { Cobrowse.offline_ad = $co("#cobrowser").data("offline"); }
    if ($co("#cobrowser").data("online")) { Cobrowse.online_ad = $co("#cobrowser").data("online"); }
    
    var cta_img = $co("<img>").attr("src", cta)
    var cta = $co("<a>").attr("href", "#").attr("id", "cobrowse_cta").addClass("cobrowse_show_activate");
    cta_img.appendTo(cta)
    cta.appendTo(cobrowse)
    
    var wrapper = $co("<div>").attr("id", "cobrowse_wrapper");
    var prompt = $co("<p>").attr("id", "cobrowse_prompt").text(Cobrowse.offline_ad);
    var start = $co("<a>").attr("href", "#").attr("id", "cobrowse_start").addClass("green_button").text("Connect")
    var already_have_code = $co("<a>").attr("href", "#").attr("id", "cobrowse_already_have").text("Already have an activation code?");
    prompt.appendTo(wrapper);
    start.appendTo(wrapper);
    already_have_code.appendTo(wrapper)
    
    var activation_code_form = $co("<form>").attr("id", "cobrowse_activation_code_form");
    var activation_code_form_input = $co("<input>").attr("type", "text").attr("id", "cobrowse_activation_code");
    var activation_code_form_submit = $co("<input>").attr("type", "submit").addClass("green_button").val("Join")
    activation_code_form_input.appendTo(activation_code_form)
    activation_code_form_submit.appendTo(activation_code_form)
    activation_code_form.appendTo(wrapper)
    
    wrapper.appendTo(cobrowse)
    cobrowse.appendTo("body")
  },
  
  createControlCentre: function() {
    if (!Cobrowse.offline_ad) { Cobrowse.offline_ad = "Call our customer service department!"; }
    if (!Cobrowse.offline_ad) { Cobrowse.online_ad = ""; }
    var cobrowse_control_center = $co("<div>").attr("id", "cobrowse_control_center")
    var ac = $co("<div>").attr("id", "cobrowse_ac")
    var activation_code_text = $co("<input>").attr("id", "cobrowse_activation_code_text").addClass("green_button").attr("readonly", true)
    var activation_code_label = $co("<label>").attr("for", "cobrowse_activation_code_text").attr("id", "cobrowse_activation_code_label").text("Session ID: ")
    var online_ad = $co("<p>").attr("id", "cobrowse_online_ad").addClass("cobrowse_ad").text(Cobrowse.online_ad)
    var offline_ad = $co("<p>").attr("id", "cobrowse_offline_ad").addClass("cobrowse_ad").text(Cobrowse.offline_ad)
    var destroy_session = $co("<a>").attr("href", "#").attr("id", "cobrowse_destroy_session").text("Disconnect")
    
    activation_code_label.appendTo(ac)
    activation_code_text.appendTo(ac)
    ac.appendTo(cobrowse_control_center)
    online_ad.appendTo(cobrowse_control_center)
    offline_ad.appendTo(cobrowse_control_center)
    destroy_session.appendTo(cobrowse_control_center)
    cobrowse_control_center.appendTo("body")
  },
  
  createArrows: function() {
    var scroll_down = $co("<div>").attr("id", "cobrowser_scroll_down")
    var scroll_up = $co("<div>").attr("id", "cobrowser_scroll_up")
    scroll_down.appendTo("body")
    scroll_up.appendTo("body")
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
    Cobrowse.createArrows();
    
    if ($co.cookie("cobrowse_channel") && $co.cookie("cobrowse_channel") != "NULL") {
      $co("#cobrowse").hide();
      Cobrowse.activate($co.cookie("cobrowse_channel"))
    } else {
      $co("#cobrowse_control_center").hide();
    }
  },
  
  connect: function() {
    var url = document.URL;
    Cobrowse.connected = true;
    Cobrowse.faye = new Faye.Client("https://www.daljs.org:9291/faye");
    $co.cookie("cobrowse_channel", Cobrowse.activation_code);
    
    if (url != $co.cookie("cobrowse_page")) {
      $co.cookie("cobrowse_page", url);
      var html = $co('html').clone()
      html.find("#cobrowser").remove()
      Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "page_change", url: url, html: html.html() });
      console.log("page change")
    }
    
    Cobrowse.faye.subscribe(Cobrowse.channel + "/event", function(m) {
      if (Cobrowse.mouse.id != m.id) {
        if (m.event == "mousemove") {
          if (!$co("#remote-pointer-" + m.id).length) {
            var pointer = $co("<div>").addClass("remote-pointer").attr("id", "remote-pointer-" + m.id);
            $co("#cobrowse_online_ad").show()
            $co("#cobrowse_offline_ad").hide()
            pointer.appendTo("body");
            $co(window).resize()
          } else {
            var scrolled = $co(document).scrollTop();
    
            $co("#remote-pointer-" + m.id).animate({
              left: m.x,
              top: m.y
            }, 40);
    
            if (m.y > Cobrowse.mouse.height + scrolled) {
              $co("#cobrowser_scroll_down").show();
              $co("#cobrowser_scroll_up").hide();
            } else if (m.y + 10 < scrolled) {
              $co("#cobrowser_scroll_up").show();
              $co("#cobrowser_scroll_down").hide();
            } else {
              $co("#cobrowser_scroll_up, #cobrowser_scroll_down").hide();
            }
          
            $co("#cobrowse_online_ad").show()
          }
        } else if (m.event == "page_change") {
          $co.cookie("cobrowse_page", m.url);
          var newDoc = document.open("text/html", "replace");
          newDoc.write(m.html);
          newDoc.close();
        } else if (m.event == "resize") {
          if (m.mouse.width > Cobrowse.mouse.width) {
            $co("body").css("width", Cobrowse.mouse.width)
          } else {
            $co("body").css("width", m.mouse.width)
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
        } else if (m.event == "disconnect") {
          $co("#remote-pointer-" + m.id).remove();
        }
      }
    });
    
    Cobrowse.updateMouse();
    $co("#cobrowse_offline_ad").show()
  },
  
  updateMouse: function() {
    if (Cobrowse.connected) {
      Cobrowse.mouse.event = "mousemove";
      Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
      setTimeout(Cobrowse.updateMouse, 50);
    }
  },
  
  activate: function(code) {
    Cobrowse.mouse.id = Cobrowse.uuid();
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
    $co("#cobrowse_control_center, #cobrowse_wrapper").hide()
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
  Cobrowse.init();
});

$co(document).on("click", ".cobrowse_show_activate", function() {
  $co("#cobrowse_wrapper").toggle();
  return false;
});

$co(document).on("click", "#cobrowse_start", function() {
  Cobrowse.activate(Cobrowse.uuid(true).toUpperCase());
  return false;
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
  }
});

$co(document).on("click", "*", function() {
  $co.cookie("cobrowse_page", $co(this).attr("href"));
});

$co(window).resize(function() {
  if (Cobrowse.connected) {
    Cobrowse.mouse.width = $co(window).width();
    Cobrowse.mouse.height = $co(window).height();
    Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "resize", id: Cobrowse.mouse.id, mouse: Cobrowse.mouse });
  }
});

$co(document).on("click", "html, body", function() {
  if (Cobrowse.connected) {
    Cobrowse.mouse.event = "click";
    Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
  }
});

// $co(document).on("keyup", "input, textarea, select", function() {
//    if (Cobrowse.connected) {
//      Cobrowse.faye.publish(Cobrowse.channel + "/event", { id: Cobrowse.mouse.id, event: "field", path: $co(this).getPath(), value: $co(this).val() })
//    }
// });