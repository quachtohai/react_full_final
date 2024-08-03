import { Space, Layout, Divider, Typography } from 'antd';
import logo from '@/style/images/logo.jpg';
import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';
import { selectLangDirection } from '@/redux/translate/selectors';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();
  const langDirection = useSelector(selectLangDirection)

  return (
    <Content
      style={{
        padding: '150px 30px 30px',
        width: '100%',
        maxWidth: '400px',
        margin: '0 auto',
      }}
      className="sideContent"
    >
      <div style={{ width: '100%' }}>
        <img
          src={logo}
          alt="ERP PROJECT"
          style={{ margin: '0 auto 40px', display: 'block' }}
          height={63}
          width={220}
        />
        <div className="space40"></div>
        <Title level={3}>ERP Software :</Title>

        <div className="space20"></div>
        <ul className="list-checked" style={{paddingRight:0}}>
          <li className={`list-checked-item ${langDirection === "rtl" ? "list-checked-item-right" : "list-checked-item-left"}`}>
            <Space direction="vertical">
              <Text strong>PRODUCTION PLANNING</Text>

             
            </Space>
          </li>

          <li className={`list-checked-item ${langDirection === "rtl" ? "list-checked-item-right" : "list-checked-item-left"}`}>
            <Space direction="vertical">
              <Text strong>ENTERPRISE MANAGEMENT</Text>
             
            </Space>
          </li>
        </ul>
        <Divider />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          
        </div>
      </div>
    </Content>
  );
}
