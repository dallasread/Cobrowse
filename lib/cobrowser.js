function _cobrowser_load() {
  
  var $co = jQuery.noConflict();

  (function ($) {
   
    Cobrowse = {
      connected: false,
  
      mouse: { x: 0, y: 0, width: $(window).width(), height: $(window).height() },
  
      createCta: function() {
        var cobrowse = $("<div>").attr("id", "cobrowse")
        var cta = atob("aHR0cHM6Ly93d3cuZGFsanMub3JnL2NvYnJvd3Nlci9hc3NldHMvaW1ncy9oZWxwLnBuZw==");
        Cobrowse.offline_ad = "Call our customer service department!";
        Cobrowse.online_ad = "";
        if ($("#cobrowser").data("cta")) { cta = $("#cobrowser").data("cta"); }
        if ($("#cobrowser").data("offline")) { Cobrowse.offline_ad = $("#cobrowser").data("offline"); }
        if ($("#cobrowser").data("online")) { Cobrowse.online_ad = $("#cobrowser").data("online"); }
    
        var cta_img = $("<img>").attr("src", cta)
        var cta = $("<a>").attr("href", "#").attr("id", "cobrowse_cta").addClass("cobrowse_show_activate");
        cta_img.appendTo(cta)
        cta.appendTo(cobrowse)
    
        var wrapper = $("<div>").attr("id", "cobrowse_wrapper");
        var prompt = $("<p>").attr("id", "cobrowse_prompt").text(Cobrowse.offline_ad);
        var start = $("<a>").attr("href", "#").attr("id", "cobrowse_start").addClass("green_button").text("Connect")
        var already_have_code = $("<a>").attr("href", "#").attr("id", "cobrowse_already_have").text("Already have an activation code?");
        prompt.appendTo(wrapper);
        start.appendTo(wrapper);
        already_have_code.appendTo(wrapper)
    
        var activation_code_form = $("<form>").attr("id", "cobrowse_activation_code_form");
        var activation_code_form_input = $("<input>").attr("type", "text").attr("id", "cobrowse_activation_code");
        var activation_code_form_submit = $("<input>").attr("type", "submit").addClass("green_button").val("Join")
        activation_code_form_input.appendTo(activation_code_form)
        activation_code_form_submit.appendTo(activation_code_form)
        activation_code_form.appendTo(wrapper)
    
        wrapper.appendTo(cobrowse)
        cobrowse.appendTo("body")
      },
  
      createControlCentre: function() {
        if (!Cobrowse.offline_ad) { Cobrowse.offline_ad = "Call our customer service department!"; }
        if (!Cobrowse.offline_ad) { Cobrowse.online_ad = ""; }
        var cobrowse_control_center = $("<div>").attr("id", "cobrowse_control_center")
        var ac = $("<div>").attr("id", "cobrowse_ac")
        var activation_code_text = $("<input>").attr("id", "cobrowse_activation_code_text").addClass("green_button").attr("readonly", true)
        var activation_code_label = $("<label>").attr("for", "cobrowse_activation_code_text").attr("id", "cobrowse_activation_code_label").text("Session ID: ")
        var online_ad = $("<p>").attr("id", "cobrowse_online_ad").addClass("cobrowse_ad").text(Cobrowse.online_ad)
        var offline_ad = $("<p>").attr("id", "cobrowse_offline_ad").addClass("cobrowse_ad").text(Cobrowse.offline_ad)
        var destroy_session = $("<a>").attr("href", "#").attr("id", "cobrowse_destroy_session").text("Disconnect")
    
        activation_code_label.appendTo(ac)
        activation_code_text.appendTo(ac)
        ac.appendTo(cobrowse_control_center)
        online_ad.appendTo(cobrowse_control_center)
        offline_ad.appendTo(cobrowse_control_center)
        destroy_session.appendTo(cobrowse_control_center)
        cobrowse_control_center.appendTo("body")
      },
  
      createArrows: function() {
        var scroll_down = $("<div>").attr("id", "cobrowser_scroll_down")
        var scroll_up = $("<div>").attr("id", "cobrowser_scroll_up")
        scroll_down.appendTo("body")
        scroll_up.appendTo("body")
      },
  
      addStyle: function() {
        Cobrowse.stylesheet = atob("aHR0cHM6Ly93d3cuZGFsanMub3JnL2NvYnJvd3Nlci5taW4uY3Nz");
        if ($("#cobrowser").attr("data-stylesheet")) { Cobrowse.stylesheet = $("#cobrowser").data("stylesheet"); }
        var ss = document.createElement("link");
        ss.setAttribute("rel", "stylesheet");
        ss.setAttribute("type", "text/css");
        ss.setAttribute("href", Cobrowse.stylesheet);
        document.getElementsByTagName("head")[0].appendChild(ss);
      },
  
      init: function() {
        if (btoa(window.location.hostname) == $("#cobrowser").data("api-key")) {
          Cobrowse.addStyle();
          Cobrowse.createCta();
          Cobrowse.createControlCentre();
          Cobrowse.createArrows();
    
          if ($.cookie("cobrowse_channel") && $.cookie("cobrowse_channel") != "NULL") {
            $("#cobrowse").hide();
            Cobrowse.activate($.cookie("cobrowse_channel"))
          } else {
            $("#cobrowse_control_center").hide();
          }
        }
      },
  
      connect: function() {
        var end_point = atob("aHR0cHM6Ly93d3cuZGFsanMub3JnOjkyOTEvZmF5ZQ==");
        Cobrowse.connected = true;
        Cobrowse.faye = new Faye.Client(end_point);
        $.cookie("cobrowse_channel", Cobrowse.activation_code);
    
        if ($("#cobrowser").attr("data-url") && $("#cobrowser").attr("data-url") != document.URL) {
          var url = document.URL;
          var html = $("html").clone()
          html.find("#cobrowser, #cobrowse, #cobrowse_control_center").remove()
          Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "page_change", url: url, html: html.html() });
        }
    
        Cobrowse.faye.subscribe(Cobrowse.channel + "/event", function(m) {
          if (Cobrowse.mouse.id != m.id) {
            if (m.event == "mousemove") {
              if (!$("#remote-pointer-" + m.id).length) {
                var pointer = $("<div>").addClass("remote-pointer").attr("id", "remote-pointer-" + m.id);
                $("#cobrowse_online_ad").show()
                $("#cobrowse_offline_ad").hide()
                pointer.appendTo("body");
                $(window).resize()
              } else {
                var scrolled = $(document).scrollTop();
    
                $("#remote-pointer-" + m.id).animate({
                  left: m.x,
                  top: m.y
                }, 90);
    
                if (m.y > Cobrowse.mouse.height + scrolled) {
                  $("#cobrowser_scroll_down").show();
                  $("#cobrowser_scroll_up").hide();
                } else if (m.y + 10 < scrolled) {
                  $("#cobrowser_scroll_up").show();
                  $("#cobrowser_scroll_down").hide();
                } else {
                  $("#cobrowser_scroll_up, #cobrowser_scroll_down").hide();
                }
          
                $("#cobrowse_online_ad").show()
              }
            } else if (m.event == "page_change") {
              var newDoc = document.open("text/html", "replace");
              newDoc.write(m.html);
              newDoc.close();
          
              var js, id = 'cobrowser', ref = newDoc.getElementsByTagName('script')[0];
    					if (newDoc.getElementById(id)) {return;}
    					js = newDoc.createElement('script'); js.id = id; js.async = true;
    					js.src = "cobrowser.min.js";
    					ref.parentNode.insertBefore(js, ref);
          
              $("#cobrowser").attr("data-url", m.url);
            } else if (m.event == "resize") {
              if (m.mouse.width > Cobrowse.mouse.width) {
                $("body").css("width", Cobrowse.mouse.width)
              } else {
                $("body").css("width", m.mouse.width)
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
            } else if (m.event == "disconnect") {
              $("#remote-pointer-" + m.id).remove();
            }
          }
        });
    
        Cobrowse.updateMouse();
        $("#cobrowse_offline_ad").show()
      },
  
      updateMouse: function() {
        if (Cobrowse.connected) {
          Cobrowse.mouse.event = "mousemove";
          Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
          setTimeout(Cobrowse.updateMouse, 100);
        }
      },
  
      activate: function(code) {
        if (typeof($.cookie("cobrowse_mouse_id")) != "undefined") {
          Cobrowse.mouse.id = $.cookie("cobrowse_mouse_id");
        } else { 
          Cobrowse.mouse.id = Cobrowse.uuid();
          $.cookie("cobrowse_mouse_id", Cobrowse.mouse.id);
        }
    
        Cobrowse.activation_code = code.toUpperCase();
        Cobrowse.channel = "/" + Cobrowse.activation_code;
        $("#cobrowse_activation_code_text").val(Cobrowse.activation_code);
        $("#cobrowse").hide()
        $("#cobrowse_control_center").show()
        Cobrowse.connect();
      },
  
      deactivate: function() {
        $(".remote-pointer").remove()
        $("#cobrowse_activation_code").val("")
        $("#cobrowse_control_center, #cobrowse_wrapper").hide()
        $("#cobrowse").show()
        Cobrowse.disconnect()
      },
  
      disconnect: function() {
        Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "disconnect", id: Cobrowse.mouse.id });
        Cobrowse.faye.disconnect()
        $.removeCookie("cobrowse_channel");
        $.removeCookie("cobrowse_page");
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

    $(document).ready(function(){
      Cobrowse.init();
    });

    $(document).on("click", ".cobrowse_show_activate", function() {
      $("#cobrowse_wrapper").toggle();
      return false;
    });

    $(document).on("click", "#cobrowse_start", function() {
      Cobrowse.activate(Cobrowse.uuid(true).toUpperCase());
      return false;
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
      }
    });

    $(document).on("click", "*", function() {
      $.cookie("cobrowse_page", $(this).attr("href"));
    });

    // $(window).resize(function() {
    //   if (Cobrowse.connected) {
    //     Cobrowse.mouse.width = $(window).width();
    //     Cobrowse.mouse.height = $(window).height();
    //     Cobrowse.faye.publish(Cobrowse.channel + "/event", { event: "resize", id: Cobrowse.mouse.id, mouse: Cobrowse.mouse });
    //   }
    // });

    $(document).on("click", "html, body", function() {
      if (Cobrowse.connected) {
        Cobrowse.mouse.event = "click";
        Cobrowse.faye.publish(Cobrowse.channel + "/event", Cobrowse.mouse);
      }
    });

    // $(document).on("keyup", "input, textarea, select", function() {
    //    if (Cobrowse.connected) {
    //      Cobrowse.faye.publish(Cobrowse.channel + "/event", { id: Cobrowse.mouse.id, event: "field", path: $(this).getPath(), value: $(this).val() })
    //    }
    // });
   
  }($co));
  
}