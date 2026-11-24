import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ChartPoint = { x: number; y: number };

type BalanceState = {
  amount: number;
  changePercent: number;
  chart: ChartPoint[];
};

const initialState: BalanceState = {
  amount: 1240.5,
  changePercent: 4.2,
  chart: [
    { x: 0, y: 18 },
    { x: 1, y: 22 },
    { x: 2, y: 16 },
    { x: 3, y: 28 },
    { x: 4, y: 24 },
    { x: 5, y: 36 },
    { x: 6, y: 30 },
    { x: 7, y: 42 },
    { x: 8, y: 38 },
    { x: 9, y: 48 },
  ],
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    topUp(state, action: PayloadAction<number>) {
      state.amount = Number((state.amount + action.payload).toFixed(2));
      state.changePercent = Number((state.changePercent + 0.3).toFixed(1));
      state.chart.push({
        x: state.chart.length,
        y: Math.min(56, (state.chart.at(-1)?.y ?? 30) + 4),
      });
    },
    send(state, action: PayloadAction<number>) {
      state.amount = Number((state.amount - action.payload).toFixed(2));
      state.chart.push({
        x: state.chart.length,
        y: Math.max(8, (state.chart.at(-1)?.y ?? 30) - 3),
      });
    },
  },
});

export const { topUp, send } = balanceSlice.actions;
export const balanceReducer = balanceSlice.reducer;
