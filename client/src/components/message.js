import React from 'react'
import {format} from 'timeago.js'
export default function Message({ message, own }) {

    return (
        <div className={own?"message own":"message"}>
            <p className='message-text'>{message.text}</p>
            <p className={own?"date w":"date b"}>{format(message.createdAt)}</p>
        </div>
    )
}
