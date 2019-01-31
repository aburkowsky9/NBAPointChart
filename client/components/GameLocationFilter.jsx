import React from 'react';

const GameLocationFilter = ({ handleLocationChange }) => (
  <div>
    <label>
      Location Filter:&nbsp;
      <select defaultValue="Both Home \& Away" onChange={handleLocationChange}>
        <option disabled>Choose Location</option>
        <option value="Both">Both Home & Away</option>
        <option value="Home">Home</option>
        <option value="Away">Away</option>
      </select>
    </label>
  </div>
);

export default GameLocationFilter;
