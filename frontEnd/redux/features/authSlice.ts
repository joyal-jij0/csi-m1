import { createSlice, PayloadAction } from '@reduxjs/toolkit' 
import { storeTokens, clearTokens, storeUserId, getAccessToken, getUserId } from '@/api/api'

interface AuthState {
    isAuthenticated: boolean; 
}

const initialState: AuthState = {
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload 
        }
    }
})

export const {setAuthenticated} = authSlice.actions 

export const login = (accessToken: string, refresToken: string, userId: string) => async(dispatch: any) => {
    await storeTokens(accessToken, refresToken);
    await storeUserId(userId)
    dispatch(setAuthenticated(true))
}

export const logout = () => async (dispatch: any) => {
    await clearTokens();
    dispatch(setAuthenticated(false))
}

export const  checkAuthStatus = () => async (dispatch: any) => {
    try {
        const token = await getAccessToken();
        const userId = await getUserId();
        if (token && userId) {
            dispatch(setAuthenticated(true));
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error checking auth status: ", error)
        return false;
    }
}

export default authSlice.reducer;