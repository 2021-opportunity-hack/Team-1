import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Router, Link, navigate, useLocation } from '@reach/router';
import _ from 'lodash';
import { Layout, Spin } from 'antd';
const { Content } = Layout;
import { ReconciliationOutlined, FormOutlined } from '@ant-design/icons';
import { getUser, getAllEvents, getCategoryListforEvents, getAllTags } from '../ngo/store/actions';
import IndexPage from "./component/index";
import LoginPage from "./component/login";
import ProfilePage from "./component/profile";
import ChangePassword from "./component/changepassword";
import PortalHeader from "./layout/portalheader";
import PortalFooter from "./layout/portalFooter";
import EventDetails from "./component/events/eventDetails";
import MyEvents from "./component/myEvents";

import EventsList from "./component/eventslist";
import ListingView from "./component/listingsView";
import ChatBot from 'react-simple-chatbot';
import '../assets/css/portal.less'
import chatBot from '../assets/images/chat-bot.png'

const KISSHomePage = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const user = useSelector(state => state.user);
    const eventsStore = useSelector(state => state.events);
    /**
     * Scroll Top on Each Routing
     * user Tracking  . . .
     */

    useEffect(() => {
        setTimeout(() => { document.body.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }, [location.pathname])

    const [loading, setloading] = useState(false);
    useEffect(() => {
        if (eventsStore.eventList.loading) {
            dispatch(getUser());
            dispatch(getAllTags());
            dispatch(getAllEvents());
            dispatch(getCategoryListforEvents());
        }
    }, []);


    return <>
        <Layout className="layout_portal">
            <GetChatBot />
            <Layout style={{ background: '#fff'}}>
                <PortalHeader />
                <section className="main-content">
                    <Layout className="layout_contentWrapper">
                        <Content>
                            <Router>
                                <IndexPage path="/home" />
                                <LoginPage path="/" />
                                <LoginPage path="/login" />
                                <ProfilePage path="/profile" />
                                <ChangePassword path="/changepassword" />
                                <EventDetails path="/event" />
                                <EventsList path="/eventslist" />
                                <MyEvents path="/myEvents" />
                                
                                <ListingView path="/listing/:id" />
                            </Router>
                        </Content>
                    </Layout>
                </section>
                <PortalFooter />
            </Layout>
        </Layout>

    </>
}
export default KISSHomePage;


const GetChatBot = () => {
    const steps = [
        {
            id: 1,
            message: `Hello, How may I help you ?`,
            trigger: 2,
        },
        {
            id: 2,
            user: true,
            trigger: 3,
        },
        {
            id: 3,
            message: 'Let me see for {previousValue}, just a moment',
            trigger: 4
        },
        {
            id: 4,
            options: [
                { value: 1, label: 'Number 1', trigger: '3' },
                { value: 2, label: 'Number 2', trigger: '2' },
                { value: 3, label: 'Number 3', trigger: '2' },
            ]            
        }
    ]

    return (
        <ChatBot st headerTitle="Chat with KISS Bot" steps={steps} floating={true} floatingIcon={<img src={chatBot} height={80} />} />

    )

}

