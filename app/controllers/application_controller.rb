class ApplicationController < ActionController::Base
    protect_from_forgery unless: -> { request.format.json? }
    helper_method :current_user, :signed_in?

    private

    def current_user
        @current_user ||= User.find_by_session_token(session[:session_token])
    end

    def signed_in?
        !!current_user
    end

    def sign_in(user)
        @current_user = user
        session[:session_token] = user.reset_token!
    end

    def sign_out
        current_user.try(:reset_token!)
        session[:session_token] = nil
    end

    def valid_username(name)
        (name =~ /\A[a-z 0-9_]{4,25}\z/) == 0
    end

    # def require_signed_in
    #     redirect_to new_session_url unless signed_in?
    # end
end
