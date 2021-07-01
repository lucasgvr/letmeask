import { ReactNode } from "react"
import classNames from "classnames"

import "../styles/question.scss"

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({
    content,
    author,
    isAnswered = false,
    isHighlighted = false,
    children
}: QuestionProps) {
    return (
        <div 
            className={ classNames(
                "question",
                { answered: isAnswered },                 
                { highlighted: isHighlighted && !isAnswered }                 
            )}
        >
            <p>{ content }</p>
            <footer>
                <div className="userInfo">
                    <img src={ author.avatar } alt={ author.name } />
                    <span>{ author.name }</span>
                </div>
                <div>
                    { children }
                </div>
            </footer>
        </div>
    )
}