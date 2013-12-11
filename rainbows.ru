require 'faye'
require 'rainbows'

Faye::WebSocket.load_adapter('rainbows')
app = Faye::RackAdapter.new(:mount => '/faye', :timeout => 25)
run app