import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const add_friend = createAsyncThunk(
    'chat/add_friend',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/chat/customer/add-customer-friend', info)
            return fulfillWithValue({
                friends: data.friends,
                currentFd: data.friends.find(f => f.fdId === info.sellerId)
            })
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

// export const send_message = createAsyncThunk(
//     'chat/send_message',
//     async (info, { rejectWithValue, fulfillWithValue }) => {
//         try {
//             const { data } = await api.post('/chat/customer/send-message', info)
//             return fulfillWithValue(data)
//         } catch (error) {
//             return rejectWithValue(error.response.data)
//         }
//     }
// )

export const send_message = createAsyncThunk(
    'chat/send_message',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/chat/customer/send-message', {
                userId: info.userId,
                text: info.text,
                sellerId: info.sellerId,
                name: info.name
            })
            // Return the entire data object
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

export const chatReducer = createSlice({
    name: 'chat',
    initialState: {
        my_friends: [],
        fb_messages: [],
        currentFd: null,
        errorMessage: '',
        successMessage: '',
        loading: false
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
        updateCurrentFd: (state, action) => {
            state.currentFd = state.my_friends.find(f => f.fdId === action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(add_friend.pending, (state) => {
                state.loading = true
            })
            .addCase(add_friend.fulfilled, (state, { payload }) => {
                state.loading = false
                state.my_friends = payload.friends
                if (payload.currentFd) {
                    state.currentFd = payload.currentFd
                }
                state.successMessage = 'Friend added successfully'
            })
            .addCase(add_friend.rejected, (state, { payload }) => {
                state.loading = false
                state.errorMessage = payload?.message || 'Something went wrong'
            })
            .addCase(send_message.fulfilled, (state, { payload }) => {
                // Update to handle the correct payload structure
                if (payload.data) {
                    state.fb_messages = [...state.fb_messages, payload.data]
                }
                state.successMessage = payload.message || 'Message sent successfully'
            })
            .addCase(send_message.rejected, (state, { payload }) => {
                // Add error handling for send_message
                state.errorMessage = payload?.message || 'Failed to send message'
            })
    }
})

export const { messageClear, updateCurrentFd } = chatReducer.actions
export default chatReducer.reducer