import { stopPortalEvents } from "utils"
import React from "react"

export const PortalWrapper: React.FC<{ children: React.ReactNode }> = (props) => {
    return <div {...stopPortalEvents}>
        {props.children}
    </div>
}