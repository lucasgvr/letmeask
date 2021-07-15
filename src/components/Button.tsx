import { ButtonHTMLAttributes } from "react"

import "../styles/button.scss"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
    width?: boolean
}

export function Button({ isOutlined = false, width = false, ...props }: ButtonProps) {
    return (
        <button 
            className={`button ${isOutlined ? "outlined" : ""} ${width ? "width" : ""}`}
            {...props} 
        />    
    )
}