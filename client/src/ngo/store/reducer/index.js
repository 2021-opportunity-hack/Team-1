
import { combineReducers } from "redux";

import userReducer from './userReducer.js'
import eventsReducer from "./eventsReducer"
import dashboardReducer from "./dashboardReducer";
import categoryReducer from "./categoryReducer";
import stdcategoryReducer from "./stdcategoryReducer";
import studentReducer from "./studentReducer";
import tagReducer from "./tagReducer";
import siteNotificationReducer from "./siteNotificationReducer";

import studentFormReducer from "./studentFormReducer";
import commentsReducer from "./commentsReducer";


const rootReducer = combineReducers({
    user: userReducer,
    events: eventsReducer,
    dashboard:dashboardReducer,
    category:categoryReducer,
    stdcategory:stdcategoryReducer,
    students:studentReducer,
    tags:tagReducer,
    notification: siteNotificationReducer,
    forms:studentFormReducer,
    comments:commentsReducer,
});

export default rootReducer; 