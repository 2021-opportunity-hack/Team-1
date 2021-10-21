import moment from "moment-timezone"
moment.tz('America/Los_Angeles')
let userState = {
    loaded:false,
}

export default function (state = userState, action) {

    if (action.type === 'TAGS_LIST') {
        const data = action.payload;
        return {
            ...state,
            loading: true,
            list: data
        }
    }
    return state;
}
