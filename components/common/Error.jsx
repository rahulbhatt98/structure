import React from 'react'

const Error = ({error}) => {
    return (
        <span className="text-red-400 text-sm">
            {error}
        </span>
    )
}

export default Error;