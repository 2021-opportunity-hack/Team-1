import React, { useState, useEffect, useRef, memo } from 'react'
import { Row, Col, Input, Tabs, Select, Popover, Form, Button, Divider, DatePicker, Space, notification, TimePicker, Modal, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link, navigate } from '@reach/router';
const { confirm } = Modal;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
import {
    SafetyCertificateTwoTone, DeleteOutlined, PlusOutlined,
    FileSearchOutlined, AlertOutlined, ContainerOutlined, CreditCardOutlined,
    ArrowRightOutlined, LinkOutlined, UngroupOutlined, ShareAltOutlined,
    ApiOutlined, CalendarOutlined, RotateLeftOutlined,
} from '@ant-design/icons';
import { getAllCategories } from '../../store/actions';

import _, { remove } from 'lodash'
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Kolkata');
import axios from 'axios';
export const helpNumberFormat = (x) =>  x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : x;


const CreateCategory = memo((props) => {
    const { catId = null } = props;
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    useEffect(() => {
        dispatch(getAllCategories());
    },[]);
    
    /**
     * dynamic category array for form
     */
    const [categoryList, setcategoryList] = useState([0]);

    /**
     * getForm data  from Store
     */
    const categoryStore = useSelector(state => state.category);
    const getEventStoreData = () => {
        let mainObj = categoryStore ? categoryStore : {}
        return {
            categoryList: {
                loading: mainObj.loading == true ? false: true,
                data: mainObj.list ? mainObj.list :[],
            }
        }
    }
    let categoryData = getEventStoreData();

    /**
     * based on catId check edit mode or not
     * if setForm data
     */
    let eventEditObj = {};
    useEffect(() => {
        console.log(catId); 
        if (catId !=null && categoryData.categoryList.loading == false) {
            eventEditObj = _(categoryData.categoryList.data).filter(val => val.catid == parseInt(catId) ).value();
            eventEditObj = eventEditObj.length ? eventEditObj[0] : {};
            if (Object.keys(eventEditObj).length == 0) {
                message.warning(`No records fount for this ID : ${catId}`);
                // navigate('/admin/category/list');
            } else {
                eventEditObj = _(eventEditObj).pickBy(val => val).value();

                let formInit = {
                    ...eventEditObj,
                    ...(() => {
                        if (eventEditObj.category_json) {
                            try {
                                let category_json = JSON.parse(eventEditObj.category_json);
                                category_json = category_json && category_json.length ? category_json : null;
                                if (category_json) {
                                    return { category_json: category_json }
                                }
                            } catch (error) { }
                        }
                    })(),
                };
                formInit.category_json && formInit.category_json.length && setcategoryList(Array.from({ length: formInit.category_json.length }, (val, key) => key));
                form.setFieldsValue(formInit);
            }
        } else { }
    }, [categoryData.categoryList.data])

    

    /**
     * on form Finish
     */
    const [loading, setloading] = useState(false);
    const onFinish = async (e) =>{
        console.log(e);
        let category_json = _(e.category_json).pickBy(val => val).map(val=>val).value();
        let formData = {
            name: e.name,
            description: e.description,
            category_json: category_json,
            ...(()=>{
                return catId!=null ? { catid: parseInt(catId) }: {}
            })()
        };
        
        setloading(true);
        await axios.post(`/events/api/saveCategory`, { data: formData }).then(res => {
            if(res.data.result.error) {
                message.error(`Failed to add category, please try again!`);
            } else {
                message.success("Category Created Successfully");
                dispatch(getAllCategories());
            }
            window.location.href = "/admin/category/list";
        }).finally(() => {
            setloading(false);
        })
    }

    /**
     * form Update for all change
     */
    let formStore = {};
    const [fValue, setfValue] = useState(1);
    const fUpdateTrigger = () => { setfValue(fValue + 1) }

    /**
     * remove CategoryList
     */
    const removeCategoryList = (val) =>  setcategoryList(_(categoryList).filter(value => value != val).value() );

    return <>
        <div className="_apifilter_subheader">
            <div className="_details">
                <div className="_title"> <SafetyCertificateTwoTone twoToneColor="#52c41a" /> Create Category </div>
                <div className="_subTitle">create category with necessary information</div>
            </div>
            <div className="filters"></div>
        </div>
        <Divider style={{ margin: '20px 0' }} />


        <div className="category_creation" style={{ minHeight: '80vh'}}>
            <Form className="initial_form" layout="vertical"
                form={form}
                onFinish={(e) => onFinish(e)}
                initialValues={{
                    ...(() => {
                        return {...formStore}
                    })(),
                }}>
                
                <div className="category_list">
                    <BasicFields {...{ form, fUpdateTrigger }} />

                    <div className="category_dynamic_fields_header">
                        <div className="category_dynamic_title">
                            Add Form fields
                        </div>
                        <div className="category_dynamic_button">
                            <Button icon={<PlusOutlined />} size="large" type="dashed" className="add_dynamicFields_button"
                                onClick={() => {
                                    let next = categoryList.length ? categoryList[categoryList.length - 1] + 1 : 1;
                                    setcategoryList([...categoryList, next])
                                }}> Add </Button>
                        </div>
                    </div>

                    {categoryList.map((formIndex, key) => <>
                        <div className="category_box_wrapper">
                            <div className="category_menu">
                                <div className="category_count"><span>{key + 1}</span></div>
                                {key != 0 && <div className="category_remove" onClick={() => { removeCategoryList(formIndex)}}><DeleteOutlined /></div>}
                            </div>
                            <DynamicFields {...{ form, formIndex, fUpdateTrigger }} />
                        </div>
                    </>)}
                </div>

                <Divider style={{ margin: '20px 0' }} />
                <Space>
                    <Button loading={loading} disabled={loading} icon={<FileSearchOutlined />} size="large" type="primary" htmlType="submit"> Save Form </Button>
                </Space>
            </Form>
        </div>

    </>
})
export default CreateCategory;

/**
 * Sub form box
 */
const BasicFields = (props) =>{
    const { form, fUpdateTrigger } = props;

    return <>
        <div className="category_box_basic">
            <div className="category_item">
                <Form.Item  hasFeedback={true} name= {'name'} label="name" rules={[{ required: true, message: 'Please fill!' }]}>
                    <Input size="middle" onChange={(e) => { fUpdateTrigger() }} />
                </Form.Item>
            </div>

            <div className="category_item">
                <Form.Item hasFeedback={true} name={'description'} label="description" rules={[{ required: false, message: 'Please fill!' }]}>
                    <TextArea rows={3} onChange={(e) => { fUpdateTrigger() }} />
                </Form.Item>
            </div>
        </div>
    </>
}

/**
 * Sub form box
 */
const DynamicFields = (props) =>{
    const { form, formIndex, fUpdateTrigger } = props;
    return <>
        <div className="category_box">
            <div className="category_item">
                <Form.Item  hasFeedback={true} name= {['category_json', formIndex ,'name']} label="name" rules={[{ required: true, message: 'Please fill!' }]}>
                    <Input size="middle" onChange={(e) => { fUpdateTrigger() }} defaultValue={formIndex.name}/>
                </Form.Item>
            </div>

            <div className="category_item">
                <Form.Item  hasFeedback={true} name= {['category_json', formIndex ,'input_type']} label="input type" rules={[{ required: true, message: 'Please fill!' }]}>
                    <Select size="middle" onChange={(e) => { fUpdateTrigger() }}  defaultValue={formIndex.input_type}>
                        <Option value="text">text</Option>
                        <Option value="dropdown">dropdown</Option>
                        <Option value="tags">tags</Option>
                        <Option value="upload">file upload</Option>
                        <Option value="datepicker">datepicker</Option>
                    </Select>
                </Form.Item>
            </div>
            
            {(form.getFieldValue(['category_json', formIndex, 'input_type']) || formIndex.input_type)  == 'dropdown' && <FormDropdown {...{ fUpdateTrigger, formIndex, form }} />}
            {(form.getFieldValue(['category_json', formIndex, 'input_type']) || formIndex.input_type)  == 'tags' && <FormTags {...{ fUpdateTrigger, formIndex , form }} />}

        </div>
    </>
}

/**
 * dropdown Field
 */
const FormDropdown = (props) =>{
    const { fUpdateTrigger, formIndex, form } = props;    
    
    return <>
        <div className="category_item">
            <Form.Item  hasFeedback={true} name={['category_json', formIndex, 'dropdown']} label="dropdown values" rules={[{ required: true, message: 'Please fill!' }]}>
                <Select mode="tags" allowClear size="middle" onChange={(e) => { fUpdateTrigger() }} defaultValue={formIndex.dropdown}> </Select>
            </Form.Item>
        </div>
    </>
}

/**
 * tag Field
 */
const FormTags = (props) => {
    const { fUpdateTrigger, formIndex, form } = props;

    return <>
        <div className="category_item">
            <Form.Item hasFeedback={true} name={['category_json', formIndex, 'tags']} label="tag values" rules={[{ required: true, message: 'Please fill!' }]}>
                <Select mode="tags" allowClear size="middle" onChange={(e) => { fUpdateTrigger() }} defaultValue={formIndex.dropdown} > </Select>
            </Form.Item>
        </div>
    </>
}