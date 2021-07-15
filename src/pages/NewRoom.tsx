import { FormEvent, useState } from "react"
import { Link, useHistory } from "react-router-dom"

import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"

import { Button } from "../components/Button"

import { database } from "../services/firebase"
import { useAuth } from "../hooks/useAuth"

import "../styles/auth.scss"
import toast from "react-hot-toast"

export function NewRoom() {
    const { user } = useAuth()

    const history = useHistory()

    const [newRoom, setNewRoom] = useState("")

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault()
        
        if (newRoom.trim() === "") {
            return
        }

        const roomRef = database.ref("rooms")

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        toast.success("Room created")
        
        history.push(`/admin/rooms/${firebaseRoom.key}`)
    }

    return (
        <div id="pageAuth">
            <aside>
                <img src={ illustrationImg } alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta.</strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>

            <main>
                <div className="mainContent">
                    <img src={ logoImg } alt="Letmeask" />
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={ handleCreateRoom }>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={ event => setNewRoom(event.target.value) }
                            value={ newRoom }
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala já existente? <Link to="/">Clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}