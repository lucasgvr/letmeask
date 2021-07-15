import { useHistory, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import { database } from "../services/firebase"

import "../styles/checkPermission.scss"

export function CheckPermission() {
    const { user } = useAuth()

    const location = useLocation()
    const roomId = location.state

    let verified: boolean
    let roomAuthorId: string

    const history = useHistory()

    async function handleCheckPermissionForRoom() {
        const roomRef = await database.ref(`rooms/${roomId}`).get()

        roomAuthorId = await roomRef.child("authorId").val()

        const userId = user?.id

        if (roomAuthorId === userId) {
            verified = true
            history.replace({
                pathname: `/admin/rooms/${roomId}`,
                state: {
                    verified,
                    roomAuthorId,
                    userId
                }
            })
        } else {
            history.push("/")
        }
    }

    handleCheckPermissionForRoom()

    return (
        <>
            <p className="checkText">Checking Permissions...</p>
            <div className="loader">
                <div className="inner one"></div>
                <div className="inner two"></div>
                <div className="inner three"></div>
            </div>

        </>
    )
}