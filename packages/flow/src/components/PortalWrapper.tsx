import { stopPortalEvents } from "utils"
import React from "react"

export const PortalWrapper: React.FC = (props) => {
    return <div {...stopPortalEvents}>
        {props.children}
    </div>
}