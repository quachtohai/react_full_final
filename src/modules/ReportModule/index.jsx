import ErpLayout from "../../layout/ErpLayout";
import { DatePicker, Select } from 'antd';
import { PageHeader } from "@ant-design/pro-layout";
import { ArrowDownOutlined, ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { selectLangDirection } from "@/redux/translate/selectors";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { generate as uniqueId } from 'shortid';
import { useState, useEffect } from "react";
import dayjs from "dayjs";
export default function ReportingModule() {
    const optionTimeZone = { timeZone: 'Asia/Ho_Chi_Minh' };
    let options = [{
        value: 'welding',
        label: 'Welding',
    },
    {
        value: 'coating',
        label: 'Coating',
    },
    {
        value: 'heattreat',
        label: 'Heat treat',
    },
    {
        value: 'assembling',
        label: 'Assembling',
    }];

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [type, setType] = useState("");

    const pdf_url = "http://localhost:7284/api/ReportViewer/ReportingService?fromDate=" + fromDate
        + "&toDate=" + toDate + "&type=" + type
    const handleClick = () => {
        console.log(fromDate);
        console.log(toDate);
        console.log(type);
        return <a href={pdf_url}>Resume</a>
    }
    const langDirection = useSelector(selectLangDirection);
    return (
        <>
            <ErpLayout>
                <>
                    <PageHeader
                        title={"REPORTING"}
                        ghost={true}
                        onBack={() => window.history.back()}
                        backIcon={
                            langDirection === "rtl" ? (
                                <ArrowRightOutlined />
                            ) : (
                                <ArrowLeftOutlined />
                            )
                        }>

                        <DatePicker
                            format={"YYYY-MM-DD"}
                            placeholder="from date"
                            onChange={(value) => {
                                setFromDate(dayjs(value).format('YYYY-MM-DD').toLocaleString('en-US', optionTimeZone))
                            }}                            
                        />
                        <DatePicker
                            format={"YYYY-MM-DD"}
                            placeholder="to date"
                            onChange={(value) => {

                                setToDate(dayjs(value).format('YYYY-MM-DD').toLocaleString('en-US', optionTimeZone))
                            }}
                            

                        />
                        <Select style={{ width: "150px" }} onChange={(value) => {                            
                            setType(value)
                        }} >

                            {options?.map((option) => {
                                return (
                                    <Select.Option key={`${uniqueId()}`} value={option.value} >
                                        {option.label}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                        <a href={pdf_url} target="_blank" type="primary"
                            style={{
                                marginRight: 10, color: 'white', background: "#3457D5", paddingLeft: 40, paddingRight: 40,
                                borderRadius: 8, paddingTop: 7, paddingBottom: 7
                            }} >Open</a>

                        <Button style={{ marginRight: 10 }} onClick={handleClick} type="primary" icon={<PlusOutlined />}>
                            {"EXPORT EXCEL"}
                        </Button>

                    </PageHeader>
                </>
            </ErpLayout>
        </>
    );
}
