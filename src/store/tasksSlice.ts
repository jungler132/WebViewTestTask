import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskItem = {
  id: string;
  title: string;
  done: boolean;
};

type TasksState = {
  items: TaskItem[];
};

const initialState: TasksState = {
  items: [
    { id: '1', title: 'Review partner dashboards', done: true },
    { id: '2', title: 'Open WebView deep-link test', done: false },
    { id: '3', title: 'Check payment redirect flow', done: false },
    { id: '4', title: 'Update local balance demo', done: true },
    { id: '5', title: 'Verify offline error state', done: false },
  ],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.items.find((item) => item.id === action.payload);
      if (task) {
        task.done = !task.done;
      }
    },
  },
});

export const { toggleTask } = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;

export function selectProgress(items: TaskItem[]) {
  if (items.length === 0) {
    return 0;
  }
  return items.filter((item) => item.done).length / items.length;
}
