import { useHistory, useLocation, useParams } from "react-router-dom"
import { useRoom } from "../hooks/useRoom"
import { useState } from "react"

import { database } from "../services/firebase"

import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"
import likeImg from "../assets/images/like.svg"

import toast, { Toaster } from "react-hot-toast"

import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Question } from "../components/Question"

import "../styles/room.scss"
import "../styles/modal.scss"

import Modal from "react-modal"

type RoomParams = {
    id: string;
}

type CheckRoomParams = {
    verified: boolean;
    roomAuthorId: string;
    userId: string;
}

export function AdminRoom() {
    const history = useHistory()
    const location = useLocation()

    const checkRoomParams = location.state as CheckRoomParams | undefined

    const params = useParams<RoomParams>()
    const roomId = params.id

    if (!checkRoomParams?.verified) {
        history.push({
            pathname: "/check",
            state: roomId
        })
    }

    const roomAuthorId = checkRoomParams?.roomAuthorId
    const userId = checkRoomParams?.userId

    const { questions, title } = useRoom(roomId)

    async function handleCloseRoom() {
        if (roomAuthorId === userId) {
            await database.ref(`rooms/${roomId}`).update({
                closedAt: new Date()
            })

            toast.success("Room closed")
            history.push("/")
        } else {
            toast.error("Permission denied")
        }
    }

    async function handleDeleteQuestion(questionId: string) {
        if (roomAuthorId === userId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()

            setQuestionModalIsOpen(false)
            toast.success("Question deleted")
        } else {
            toast.error("Permission denied")
        }
    }

    function saveQuestionId(questionId: string) {
        setGlobalQuestionId(questionId)
        setQuestionModalIsOpen(true)
    }

    async function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean) {
        if (roomAuthorId === userId) {
            if (isAnswered) {
                await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                    isAnswered: false
                })

                toast.success("Question unanswered")
            } else {
                await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                    isAnswered: true,
                    isHighlighted: false
                })

                toast.success("Question answered")
            }
        } else {
            toast.error("Permission denied")
        }
    }

    async function handleHighlightQuestion(questionId: string, isHighlighted: boolean, isAnswered: boolean) {
        if (roomAuthorId === userId) {
            if(isAnswered) {
                toast.error("This question was already answered")
            } else {
                if (isHighlighted) {
                    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                        isHighlighted: false
                    })

                    toast.success("Question unhighlighted")
                } else {
                    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                        isHighlighted: true
                    })

                    toast.success("Question highlighted")
                }
            }
        } else {
            toast.error("Permission denied")
        }
    }

    const [questionModalIsOpen, setQuestionModalIsOpen] = useState(false)
    const [closeRoomModalIsOpen, setCloseRoomModalIsOpen] = useState(false)
    const [gloalQuestionId, setGlobalQuestionId] = useState("")

    return (
        <div>
            <Toaster />

            <Modal
                isOpen={closeRoomModalIsOpen}
                className="modal"
                overlayClassName="overlay"
                onRequestClose={() => setCloseRoomModalIsOpen(false)}
                shouldCloseOnOverlayClick={true}
            >
                <div className="modalWrapper">
                    <div className="modal">
                       <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#737380" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-x-circle">
                           <circle cx="12" cy="12" r="10"></circle>
                           <line x1="15" y1="9" x2="9" y2="15"></line>
                           <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <h3>Encerrar sala</h3>
                        <p>
                            Quer mesmo encerrar essa sala? <br/>
                            Ela será apagada para sempre.  
                        </p>
                        <footer>
                            <Button width isOutlined={true} onClick={() => setCloseRoomModalIsOpen(false)}>Cancelar</Button>
                            <Button width onClick={handleCloseRoom}>Encerrar sala</Button>
                        </footer>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={questionModalIsOpen}
                className="modal"
                overlayClassName="overlay"
                onRequestClose={() => setQuestionModalIsOpen(false)}
                shouldCloseOnOverlayClick={true}
            >
                <div className="modalWrapper">
                    <div className="modal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h3>Excluir pergunta</h3>
                        <p>
                            Quer mesmo excluir esse pergunta? <br/>
                            Ela será apagada para sempre.  
                        </p>
                        <footer>
                            <Button width isOutlined={true} onClick={() => setQuestionModalIsOpen(false)}>Cancelar</Button>
                            <Button width onClick={() => handleDeleteQuestion(gloalQuestionId)}>Excluir pergunta</Button>
                        </footer>
                    </div>
                </div>
            </Modal>

            <div id="pageRoom">
                <header>
                    <div className="content">
                        <img src={ logoImg } alt="Letmeask" />
                        <div>
                            <RoomCode code={ roomId }/>
                            <Button 
                                isOutlined
                                onClick={ () => setCloseRoomModalIsOpen(true) }
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
                                    <div>
                                        { question.likeCount > 0 && <span>{ question.likeCount }</span> }
                                        <img src={ likeImg } alt="" />
                                    </div>
                                    
                                    <button
                                        className={`${question.isAnswered ? "answered" : ""}`}
                                        type="button"
                                        onClick={ () => handleCheckQuestionAsAnswered(question.id, question.isAnswered) }
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12.0003" cy="11.9998" r="9.00375" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    <button
                                        className={`${question.isHighlighted ? "highlighted" : ""}`}
                                        type="button"
                                        onClick={ () => handleHighlightQuestion(question.id, question.isHighlighted, question.isAnswered) }
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>

                                    </button>
                                    <button
                                        type="button"
                                        onClick={ () => saveQuestionId(question.id) }
                                    >
                                        <img src={ deleteImg } alt="Remover pergunta" />
                                    </button>
                                </Question>
                            )
                        }) }
                    </div>
                </main>
            </div>
        </div>
    )
}