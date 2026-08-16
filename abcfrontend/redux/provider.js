"use client"
const { Provider } = require("react-redux");
const { default: store } = require("./store");

function ReduxProvider({children}){
    return <Provider store={store}>{children}</Provider>
};

export default ReduxProvider;