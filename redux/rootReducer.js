
import { combineReducers } from "redux";
import authReducer from "./auth/authSlice"

const rootReducer = combineReducers({
  // Define a top-level state field named `todos`, handled by `todosReducer`
  auth: authReducer,
  
});

export default rootReducer;