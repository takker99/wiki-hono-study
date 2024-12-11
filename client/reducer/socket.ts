export default function socketReducer(state = {}, action: { type: any }) {
  switch (action.type) {
    case "socket:connect":
      state.connecting = true;
      break;
    case "socket:disconnect":
      state.connecting = false;
      break;
  }
  return state;
}
