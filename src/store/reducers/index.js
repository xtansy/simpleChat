const initialState = {
    joined: false,
    username: '',
    roomId: '',
    users: '',
    messages: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ROOMS:JOINED':
            return {
                ...state,
                username: action.payload.username,
                roomId: action.payload.roomId,
                joined: true
            }
        case 'SET_DATA': 
            return {
                ...state,
                users: action.payload.users,
                messages: action.payload.messages,
            }
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            }
        case 'NEW_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        default: {
            return state;
        }
    }
}

export default reducer;