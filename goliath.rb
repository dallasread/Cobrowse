require 'goliath'
require 'faye/websocket'
Faye::WebSocket.load_adapter('goliath')

class EchoServer < Goliath::API
  def response(env)
    ws = Faye::WebSocket.new(env)

    ws.on :message do |event|
      ws.send(event.data)
    end

    ws.rack_response
  end
end