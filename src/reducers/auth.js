var isAuthenticated = localStorage.getItem('auth_token');



const initialState = {
  isAuthenticated: isAuthenticated != null && isAuthenticated != undefined,
};

const authReducer = (state = initialState, action) => {
  
  switch (action.type) {
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
      };
      
    case 'WALLUNLOCK':
      // We're using WALLUNLOCK as an implicit auth success for now
      return {
        ...state,
        isAuthenticated: true,
      };
    
    default:
      return state;
  }
};

export default authReducer; 