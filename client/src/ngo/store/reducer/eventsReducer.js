import moment from "moment-timezone"
moment.tz.setDefault('America/Los_Angeles')
let userState = { 
    loading: false,
    categoryList:{
        loading: true,
        data: []
    },
    tagList:{
        loading: true,
        data: []
    },
    eventList:{
        loading: true,
        data: []
    }

}
export default function (state = userState, action) {

    if (action.type === 'EVENTS_CATEGORY_LIST') {
        const data = action.payload;
        return {
            ...state,
            categoryList: {
                loading: false,
                data: data
            }
        }
    }
    if (action.type === 'EVENTS_TAG_LIST') {
        const data = action.payload;
        return {
            ...state,
            tagList: {
                loading: false,
                data: data
            }
        }
    }
    if (action.type === 'EVENTS_LIST') {
        const data = action.payload;
        return {
            ...state,
            eventList: {
                loading: false,
                data: data
            }
        }
    }
    return state;
}
