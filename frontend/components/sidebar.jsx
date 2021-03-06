import React from 'react'
import ChannelsList from './channels_list'

function Sidebar() {
    return (
        <div className="workspace-sidebar">
            <nav className="channel-sidebar">
                <div className="side-toolbar">
                    <button className="side-toolbar-btn">
                        (ง •̀_•́)ง ผ(•̀_•́ผ)
                    </button>
                </div>
                <div className="channel-sidebar-list">
                    <div className="ws-scrollbar">
                        <div className="scrollbar-hider">
                            <div className="scrollbar-children" style={{width: '220px'}}>
                                <ChannelsList />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar