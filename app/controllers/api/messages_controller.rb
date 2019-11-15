class Api::MessagesController < ApplicationController
    # before_action :require_signed_in

    def index
        if params[:channel_id]
            @messages = Channel.find(params[:channel_id]).messages
        else
            @messages = Message.all
        end
    end

    def show
        @message = Message.find(params[:id])
    end

    def create
        @message = current_user.messages.new(message_params) 
        @message.user = current_user
        if @message.save
            render json: @message
        
        # ActionCable.server.broadcast 'channel_channel',
        #     body: @message.body,
        #     username: @message.user.username
        # )
        else
            render json: @message.errors.full_messages, status: 422
       end
    end

    private

    def message_params
        params.require(:message).permit(:body, :channel_id)
    end
end
