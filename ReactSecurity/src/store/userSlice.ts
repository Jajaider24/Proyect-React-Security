// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../models/User.ts";
//Definir la composición de la variable reactiva
interface UserState {
    user: User | null;
}

const storedUser = localStorage.getItem("user");
const initialState: UserState = {
    user: storedUser ? JSON.parse(storedUser) : null,
};

const userSlice = createSlice({
    name: "user",
    //Esto es cuando se apaga el computador y vuelve a prender, se mantiene la sesión
    initialState,
    reducers: {
        //Esto es cuando se aplica el logion y cuando se cierra sesion
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            if (action.payload) {
                localStorage.setItem("user", JSON.stringify(action.payload));
            } else {
                localStorage.removeItem("user");
            }
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;