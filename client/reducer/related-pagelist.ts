export default function relatedPageListReducer(
  state = [],
  action: { type: any; value: never[] },
) {
  switch (action.type) {
    case "related-pagelist":
      state = action.value;
      break;
  }
  return state;
}
