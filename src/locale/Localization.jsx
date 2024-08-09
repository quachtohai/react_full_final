import { ConfigProvider, theme } from 'antd';

export default function Localization({ children }) {
  return (
    <ConfigProvider
      theme={{

        token: {

          colorPrimary: '#1640D6',
          colorLink: '#1640D6',
          borderRadius: 8,
          colorBgContainer: 'rgb(211,211,211)'
        },
      }}
    >
     
        {children}
      
        
    </ConfigProvider>
  );
}
