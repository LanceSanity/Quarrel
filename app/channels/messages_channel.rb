class MessagesChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    # channel = Channel.find(params[:id])
    # stream_for channel
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end

# MessagesChannel.broadcast_to(@channel, @message)
