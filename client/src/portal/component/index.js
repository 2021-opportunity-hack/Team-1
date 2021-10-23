import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Router, Link, navigate, useLocation } from '@reach/router';
import _ from 'lodash';
import { Tabs, List, Card, Layout, Spin, Tag, Row, Col, Input, Divider, Space, message, Button } from 'antd';
const { Content } = Layout;
import { ReconciliationOutlined, FormOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment-timezone'
/**
 * Actions
 */
import { getUser, getAllEvents, getCategoryListforEvents } from '../../ngo/store/actions';

const Index = (props) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const eventsStore = useSelector(state => state.events);
    const [state, setState] = useState({ isLoading: true, search: null, searchResult: [] })
    /** 
     * Scroll to Top
     */
    useEffect(() => {
        setTimeout(() => { document.body.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }, [location.pathname])

/*     if(eventsStore.eventList.loading){
        dispatch(getUser());
        dispatch(getAllEvents());
        dispatch(getCategoryListforEvents());
    } */


    /**
     * getForm data  from Store
     */
    const getEventStoreData = () => {
        let mainObj = eventsStore ? eventsStore : {}
        let categoryList = mainObj.categoryList ? mainObj.categoryList : {};

        let eventList = mainObj.eventList ? mainObj.eventList : {};

        return {
            categoryList: {
                loading: true,
                data: [],
                ...categoryList
            },
            eventList: {
                loading: true,
                data: [],
                ...eventList
            }
        }
    }
    let eventsData = getEventStoreData();

    /**
     * Loading message
     */
    useEffect(() => {
        if (eventsData.eventList.loading) {
            message.success("Loading . . .");
        } else {
            setState({ ...state, isLoading: false })
        }
    }, [eventsData.eventList.loading])
    /**
     * category List and Events count
     */
    /*     let categoryList = _(eventsData.eventList.data).groupBy('catid').value()
    
        categoryList = _(categoryList).map((val, key) => {
            let name = _(eventsData.categoryList.data).filter(v => v.catid == key).value();
            name = name.length ? name[0].name : 'Others';
            return { categoryName: name, data: val }
        }).value() */

    let categoryList = _(eventsData.categoryList.data).map((rec) => { return { name: rec.name, id: rec.catid } }).value()
    let eventsList = _(eventsData.eventList.data).map((rec) => { return { ...rec, category: _.find(categoryList, { "id": rec.catid }) } }).value()

    const onSearch = (val) => {
        let searchRec = eventsList.filter(o => Object.keys(o).some(k => String(o[k]).toLowerCase().includes(val.toLowerCase())));
        setState({ ...state, search: val, searchResult: searchRec })
    }
    const onChange = (e) => {
        if (e.target.value === '' || e.target.value === null) {
            setState({ ...state, search: null, searchResult: [] })
        } else {
            setState({ ...state, search: null, searchResult: [] })
        }
    }
    const getEvents = (id) => {
        let dataSource = id ? _.filter(eventsList, { "catid": id }) : eventsList
        if (state.searchResult.length > 0) {
            dataSource = state.searchResult
        }
        return (

            <List itemLayout="vertical" size="large"
                dataSource={dataSource}
                pagination={{ pageSize: 9, showQuickJumper: true }}
                renderItem={item => (
                    <div className="listing">
                        <Link to={`/listing/${item.eventid}`}>
                            <Card Bordered>
                                <div className="img" style={{ backgroundImage: `url(${item.gallery})` }}></div>
                                <div className="details">
                                    <p className="category"><Tag icon={<FormOutlined />} color="#55acee">{item.category.name}</Tag></p>
                                    <p className="title">{item.event_name}</p>
                                    <p className="desc">{item.event_desc}</p>
                                    {/* <p dangerouslySetInnerHTML={{__html:item.event_desc}} className="desc"/> */}
                                    <Divider />
                                    <div className="info">
                                        <p className="key"><ClockCircleOutlined /> <strong>Event Date</strong></p>
                                        <p className="value"> {moment(item.start_date).format('lll')} - {moment(item.end_date).format('lll')} </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </div>
                )}
            />

        )
    }

    const { TabPane } = Tabs;
    const { Search } = Input;
    console.log({ categoryList, eventsList })
    return <>
        <Content style={{ padding: 20 }} className="homePage">
            <section style={{ marginTop: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col span={24}><h1>Our Events and Jobs Listings</h1></Col>
                </Row>
            </section>
            {!state.isLoading ?
                <section style={{ marginTop: 20, padding: 20 }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Tabs defaultActiveKey={0} tabBarExtraContent={<Search onChange={onChange} onSearch={onSearch} placeholder="Search" allowClear enterButton="Search" size="large" />}>
                                <TabPane tab="All" key={0}>
                                    {getEvents()}
                                </TabPane>
                                {categoryList.map((rec, indx) =>
                                    <TabPane tab={rec.name} key={rec.id + 1}>
                                        {getEvents(rec.id)}
                                    </TabPane>
                                )}
                            </Tabs>
                        </Col>
                    </Row>
                </section>
                : null
            }
        </Content>

    </>
}
export default Index;


{/* <Row gutter={[16, 16]}>
                    <Col span={16}>
                        <div className="category_card">
                            {categoryList.map(val => <>
                                <div className="category_box">
                                    <div className="category_title"> {val.categoryName}</div>
                                    <div className="category_event_list">
                                        {_(val.data).orderBy('start_date').reverse().take(5).value().map(event => <>
                                            <div className="category_event_box" onClick={() => navigate(`/event/${event.eventid}`)}>
                                                <div className="category_event_name">{event.event_name}</div>
                                                <Space>
                                                    <div className="category_event_start"><ClockCircleOutlined /> Date: <span className="date">{event.start_date && moment(event.start_date).format('YYYY-MM-DD')}</span></div>
                                                    <div className="category_event_start"> -- &nbsp;<span className="date">{event.end_date && moment(event.end_date).format('YYYY-MM-DD')}</span></div>
                                                </Space>
                                            </div>
                                        </>)}
                                    </div>
                                </div>
                            </>)}
                        </div>
                    </Col>
                    <Col span={8}>
                        <Calendar className="calender_box" onSelect={() => { navigate(`/event`) }} fullscreen={false} />
                    </Col>
                </Row> */}