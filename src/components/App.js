import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

import base from '../base';

import sampleFishes from '../sample-fishes';

class App extends React.Component {
  
  constructor() {
    super();
  }

  // initial state
  state = {
    fishes: {},
    order: {}
  };

  componentWillMount() {
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
    
    // check if there is any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageRef) {
      // update our App component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  }

  componentWillUnMount() {
    base.removeBinding(this.ref);
  }

  addFish = (fish) => {
    // update our state
    const fishes = {...this.state.fishes};
    // add a new fish with timestamp
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    // set state
    this.setState({ fishes });
  };

  updateFish = (key, updatedFish) => {
    const fishes = {...this.state.fishes};
    fishes[key] = updatedFish;
    this.setState({ fishes });
  };

  removeFish = (key) => {
    const fishes = {...this.state.fishes};
    fishes[key] = null;
    this.setState({ fishes });
  };

  loadSamples = () => {
    this.setState({
      fishes: sampleFishes
    })
  };

  addToOrder = (key) => {
    // take copy of state
    const order = {...this.state.order};
    // update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;
    // update state
    this.setState({ order });
  };

  removeFromOrder = (key) => {
    const order = {...this.state.order};
    delete order[key];
    this.setState({ order });
  };
  
  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object
                .keys(this.state.fishes)
                .map(key => <Fish key={key} 
                  details={this.state.fishes[key]} 
                  addToOrder={this.addToOrder} 
                  index={key} />)
            }
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order} 
          params={this.props.params}
          removeFromOrder={this.removeFromOrder}
        />
        <Inventory
          addFish={this.addFish}
          removeFish={this.removeFish} 
          loadSamples={this.loadSamples} 
          fishes={this.state.fishes}
          updateFish={this.updateFish}
        />
      </div>
    )
  }
}

App.propTypes = {
  params: React.PropTypes.object.isRequired
}

export default App;