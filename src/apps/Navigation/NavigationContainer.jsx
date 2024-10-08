import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Drawer, Layout, Menu } from "antd";

import { useAppContext } from "@/context/appContext";
import { configuration } from "@/redux/configurations/actions";
import { useSelector, useDispatch } from "react-redux";
import useLanguage from "@/locale/useLanguage";
import logoIcon from "@/style/images/logo.jpg";
import logoText from "@/style/images/logo-text.png";
import store from '@/redux/store';
import useResponsive from "@/hooks/useResponsive";

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  WalletOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";

import { selectLangDirection } from "@/redux/translate/selectors";

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  const entity = "menus";
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));
  const [menus, setMenus] = useState([]);
  const dispatch = useDispatch();

  const translate = useLanguage();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  
  const dispatcher = () => {
    dispatch(configuration.list({ entity:'menus' })).then(data=>{   
      let itemTmps =[];
      
      for (var i = 0; i<store.getState().crudConfiguration.list.result.items.menus.count; i++){
        let item = {};
        item = {
          key:store.getState().crudConfiguration.list.result.items.menus.data[i].menuCode,
          icon:<ContainerOutlined />,
          label:<Link to={"/"+ store.getState().crudConfiguration.list.result.items.menus.data[i].description}>
          {translate(store.getState().crudConfiguration.list.result.items.menus.data[i].description)}</Link>,
        }
        itemTmps.push(item);
      }
      
      setItems(itemTmps);
    } )
    

  };    
  
  
  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
   
    return () => {
      controller.abort();
    };
  }, []);  
  
  
  
  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === "/") {
          setCurrentPath("dashboard");
        } else setCurrentPath(location.pathname.slice(1));
      }
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  const onCollapse = () => {
    navMenu.collapse();
  };

  const langDirection = useSelector(selectLangDirection);
  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        overflow: "auto",
        height: "100vh",
        direction: langDirection,
        position: isMobile ? "absolute" : "relative",
        bottom: "20px",
        ...(!isMobile && {
          background: "none",
          border: "none",
          [langDirection === "rtl" ? "right" : "left"]: "20px",
          top: "20px",
          borderRadius: "8px",
        }),
      }}
      theme={"light"}
    >
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
        }}
      >
        {/* <img
          src={logoIcon}
          alt="Logo"
          style={{ marginLeft: "-5px", height: "40px" }}
        /> */}

        {!showLogoApp && (
          <img
            src={logoText}
            alt="Logo"
            style={{
              marginTop: "3px",
              marginLeft: "10px",
              height: "38px",
            }}
          />
        )}
      </div>
      <Menu
        items={items}
        mode="inline"
        theme={"light"}
        selectedKeys={[currentPath]}
        style={{
          background: "none",
          border: "none",
          width: 256,
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const langDirection = useSelector(selectLangDirection);
  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ [langDirection === "rtl" ? "marginRight" : "marginLeft"]: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        contentWrapperStyle={{
          boxShadow: "none",
        }}
        style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
        placement={langDirection === "rtl" ? "right" : "left"}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
