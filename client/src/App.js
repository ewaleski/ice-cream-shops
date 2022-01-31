import React, { Component } from 'react';
import classes from 'classnames';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = { 
      results: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const data = async() => {
      const response = await fetch('/api/get-shops');
      const res = await response.json();
      return res;
    };
    data()
      .then(res => this.setState({ results: res.results, isLoading: false }))
      .catch(err => console.log(err));
  }


  render() {
    const { results, isLoading } = this.state;

    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Top Five Ice Cream Shops in Alpharetta</h1>
        </header>
        {isLoading && <div className="loader"/>}
        <div className="review-section">
          {results.map((shop, index) => (
            <div key={index} className="shop-container">
              <div className="shop-name">{shop.name}</div>
              <div className="shop-address">{shop.address}</div>
              <div className="shop-city">{shop.city}</div>
              <div className="shop-image">
                <img src={shop.image}></img>
              </div>
              <div className={classes(`rating-container star-rating-${shop.reviewRating}`)}>★★★★★</div>
              <div className="shop-review">"{shop.review}"</div>
              <div className="reviewer-name">- {shop.reviewerName}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
