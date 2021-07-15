import  React from  "react";
import { Route, Redirect, useParams } from  "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { database } from "./firebase";

type RoomParams = {
    id: string;
}

type testProps = {
    roomId: string;
    user: {
        id: string | undefined;
    };
}

let condition: boolean | undefined;

function test({roomId, user}: testProps) {
    let roomAuthorId;

    const roomRef = database.ref(`rooms/${roomId}`)
    
    roomRef.on('value', (snapshot) => {
        roomAuthorId = snapshot.child("authorId").val();
    })

    if (user?.id !== roomAuthorId) {
        return false
    } 

    if (user?.id === roomAuthorId) {
        return true
    } 
}

const PrivateRoute: React.FC<{
        component: React.FC;
        path: string;
    }> = (props) => {

    const { user } = useAuth()

    const params = useParams<RoomParams>()
    const roomId = params.id

    const parameter = {
        roomId: roomId,
        user: {
            id: user?.id
        }
    }

    condition = test(parameter)
    console.log(condition)

    return condition ? (<Route path={props.path} component={props.component} />) : 
        (<Redirect to="/"  />);
};

export default PrivateRoute;