import Footer from "./Footer";
import Header from "./Header";
import MobileBottomTab from "./MobileBottomTab";

function MainLayout({ children }) {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
      <MobileBottomTab/>
    </div>
  );
};

export default MainLayout;