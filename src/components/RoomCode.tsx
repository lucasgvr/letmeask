import toast from "react-hot-toast"
import copyImg from "../assets/images/copy.svg"

import "../styles/roomCode.scss"

type RoomCodeProps = {
    code: string;
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipboard() {
        navigator.clipboard.writeText(props.code)
        toast.success("Copied to clipboard")
    }

    return (
        <button className="roomCode" onClick={ copyRoomCodeToClipboard }>
            <div>
                <img src={ copyImg } alt="Copy room code" />
            </div>
            <span>Sala #{ props.code }</span>
        </button>
    )
}