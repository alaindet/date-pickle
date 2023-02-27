export function createStore(
  initialState: any,
  reducer: (state: any, action?: any) => any,
) {
  let _state = reducer(initialState);
  let stateHandler!: (state: any) => void;
  const state = (handler: ((state: any) => void)) => stateHandler = handler;
  const dispatch = (action: any) => {
    _state = reducer(_state, action);
    if (stateHandler) stateHandler(state);
  };

  return { state, dispatch };
}

const { state, dispatch } = createStore(
  {
    name: 'Alain',
    age: 33,
  },
  (state: any, action: any): any => {
    switch (action?.type) {
    case 'UPDATE_NAME':
      return { ...state, name: action.name };
    case 'INCREMENT_AGE':
      return { ...state, age: state.age + 1 };
    default:
      return state;
    }
  },
);

state(s => console.log('state', s));

dispatch({ type: 'INCREMENT_AGE' });
dispatch({ type: 'INCREMENT_AGE' });
dispatch({ type: 'INCREMENT_AGE' });
