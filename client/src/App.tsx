import { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./global.css";
import BaseRouter from "./routes";
import { authCheckState } from "./store/actions/auth";

const App = ({ onTryAutoSignup }: any) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    onTryAutoSignup();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onTryAutoSignup]);

  return (
    <div className="App">
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}

      <BaseRouter />
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) => ({
  onTryAutoSignup: () => dispatch(authCheckState()),
});

export default connect(null, mapDispatchToProps)(App);
