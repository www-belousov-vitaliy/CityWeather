// Types

import { ThunkAction } from "redux-thunk";
import { weatherApi } from "../api/weather-api";
import { InferValueType, StateType } from "./store";

export type InitialStateType = typeof initialState;

export type WeatherActionsType = ReturnType<InferValueType<typeof actions>>;

// State

const initialState = {
  initializePropcess: false,
  isError: false,
  coord: {
    lon: null,
    lat: null,
  },
  weather: [
    {
      id: null,
      main: null,
      description: null,
      icon: null,
    },
  ],
  base: null,
  main: {
    temp: null,
    feels_like: null,
    temp_min: null,
    temp_max: null,
    pressure: null,
    humidity: null,
  },
  visibility: null,
  wind: {
    speed: null,
    deg: null,
  },
  clouds: {
    all: null,
  },
  dt: null,
  sys: {
    type: null,
    id: null,
    message: null,
    country: null,
    sunrise: null,
    sunset: null,
  },
  timezone: null,
  id: null,
  name: null,
  cod: null,
};

// Actions

const SET_WEATHER = "weather/weather/GET_WEATHER";
const SET_INITIALIZE_PROCESS = "weather/weather/SET_INITIALIZE_PROCESS";
const SET_IS_ERROR = "weather/weather/SET_IS_ERROR";

// Action Creators

const actions = {
  setWeather: (data: InitialStateType) =>
    ({ type: SET_WEATHER, data } as const),
  setInitializePropcess: (isInitialize: boolean) =>
    ({ type: SET_INITIALIZE_PROCESS, isInitialize } as const),
  setIsError: (toggle: boolean) => ({ type: SET_IS_ERROR, toggle } as const),
};

// Reducer

const weatherReducer = (
  state: InitialStateType = initialState,
  action: WeatherActionsType
) => {
  switch (action.type) {
    case SET_IS_ERROR:
      return {
        ...state,
        isError: action.toggle,
      };
    case SET_INITIALIZE_PROCESS:
      return {
        ...state,
        initializePropcess: action.isInitialize,
      };
    case SET_WEATHER:
      return {
        ...action.data,
      };
    default:
      return state;
  }
};

// Thunks

export const getWeather = (
  city: string
): ThunkAction<Promise<void>, StateType, unknown, WeatherActionsType> => {
  return async (dispatch, getState) => {
    if (!getState().weather.initializePropcess) {
      dispatch(actions.setInitializePropcess(true));
      dispatch(actions.setIsError(false));
      try {
        const response = await weatherApi.getWeather(city);
        if (response.cod === 200) {
          dispatch(actions.setWeather(response));
        }
      } catch (e) {
        dispatch(actions.setIsError(true));
      }
      dispatch(actions.setInitializePropcess(false));
    }
  };
};

export default weatherReducer;
