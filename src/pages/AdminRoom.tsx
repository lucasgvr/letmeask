import { useHistory, useParams } from "react-router-dom"
import { useRoom } from "../hooks/useRoom"

import { database } from "../services/firebase"

import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"
import checkImg from "../assets/images/check.svg"
import answerImg from "../assets/images/answer.svg"

import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Question } from "../components/Question"

import "../styles/room.scss"

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id

    const { questions, title } = useRoom(roomId)

    async function handleCloseRoom() {
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date()
        })

        history.push("/")
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm("Tem certeza que deseja exluir essa pergunta?")) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }

    return (
        <div id="pageRoom">
            <header>
                <div className="content">
                    <img src={ logoImg } alt="Letmeask" />
                    <div>
                        <RoomCode code={ roomId }/>
                        <Button 
                            isOutlined
                            onClick={ handleCloseRoom }
                        >
                            Encerrar sala
                        </Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="roomTitle">
                    <h1>Sala { title }</h1>
                    { questions.length > 0 && <span>{ questions.length } pergunta(s)</span> }
                </div>

                <div className="questionList">
                    { questions.map(question => {
                        return (
                            <Question
                                key={ question.id }
                                content={ question.content }
                                author={ question.author }
                                isAnswered={ question.isAnswered }
                                isHighlighted={ question.isHighlighted }
                            >
                                <button
                                    type="button"
                                    onClick={ () => handleCheckQuestionAsAnswered(question.id) }
                                >
                                    <img src={ checkImg } alt="Marcar pergunta como respondida" />
                                </button>
                                <button
                                    type="button"
                                    onClick={ () => handleHighlightQuestion(question.id) }
                                >
                                    <img src={ answerImg } alt="Dar destaque à pergunta" />
                                </button>
                                <button
                                    type="button"
                                    onClick={ () => handleDeleteQuestion(question.id) }
                                >
                                    <img src={ deleteImg } alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    }) }
                </div>
            </main>
        </div>
    )
}