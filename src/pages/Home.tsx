import { useHistory } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

import { FormEvent, useState } from "react" 

import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleIconImg from "../assets/images/google-icon.svg"

import { database } from "../services/firebase"

import { Button } from "../components/Button"

import "../styles/auth.scss"
import toast, { Toaster } from "react-hot-toast"

export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()

    const [roomCode, setRoomCode] = useState("")

    async function handleCreateRoom() {
        if (!user) {
            await toast.promise(
                signInWithGoogle(), {
                    loading: "Waiting for log in...",
                    success: "Logged in successfully",
                    error: "Could not log in"
                }
            ) 
        }

        setTimeout(() => history.push("/rooms/new"), 2000)
        
    }

    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === "") {
            return
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        if (!roomRef.exists()) {
            toast.error("Room does not exists.")
            return
        }

        if (roomRef.val().closedAt) {
            toast.error("Room already closed.")
            return
        }

        toast.success("Joining room")
        
        history.push(`rooms/${roomCode}`)
    }

    return (
        <div>
            <Toaster />
            <div id="pageAuth">
                <aside>
                    <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
                    <strong>Toda pergunta tem uma resposta.</strong>
                    <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
                </aside>

                <main>
                    <div className="mainContent">
                        <img src={ logoImg } alt="Letmeask" />
                        <button onClick={ handleCreateRoom } className="createRoom">
                            <img src={ googleIconImg } alt="Logo do Google" />
                            Crie sua sala com o Google
                        </button>
                        <div className="separator">ou entre em uma sala</div>
                        <form onSubmit={ handleJoinRoom }>
                            <input
                                type="text"
                                placeholder="Digite o código da sala"
                                onChange={ event => setRoomCode(event.target.value) }
                                value={ roomCode }
                            />
                            <Button type="submit">
                                Entrar na sala
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}