import React from "react";
import * as actions from "../action.ts";

import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { bindActionCreators } from "redux";
import * as actions from "../action.ts";

export interface StoreComponentProps {
  store: any; // You should replace `any` with the specific type of your store
}

const StoreComponent = ({ store }: StoreComponentProps) => {
  const [state, setState] = useState(store.getState());
  const debug = Debug("semirara:component:storecomponent");

  useEffect(() => {
    debug("componentDidMount()");
    const unsubscribeStore = store.subscribe(() => {
      setState(store.getState());
    });

    return () => {
      debug("componentWillUnmount()");
      unsubscribeStore();
    };
  }, [store]);

  const mapState = (state: any) => state; // Replace `any` with the specific type of your state

  const shouldComponentUpdate = (nextProps: StoreComponentProps, nextState: any) => {
    if (
      Object.keys(nextProps).length !== Object.keys(store).length ||
      Object.keys(nextState).length !== Object.keys(state).length
    ) return true;
    for (const k in nextState) {
      if (
        typeof nextState[k] === "object" ||
        state[k] !== nextState[k]
      ) return true;
    }
    for (const k in nextProps) {
      if (
        k !== "store" &&
          typeof nextProps[k] === "object" ||
        store[k] !== nextProps[k]
      ) return true;
    }
    return false;
  };

  useEffect(() => {
    debug("componentWillMount()");
    setState(mapState(store.getState()));
    const action = bindActionCreators(actions, store.dispatch);
  }, [store]);

  return (
    <div>
      {/* Render your component here */}
    </div>
  );
};
};

export default StoreComponent;
