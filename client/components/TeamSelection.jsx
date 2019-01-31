import React from 'react';

const TeamSelection = ({ handleTeamChange }) => (
  <div>
    <label>
      Graph Type:&nbsp;
      <select defaultValue='Choose Team' onChange={ handleTeamChange }>
        <option disabled>Choose Team</option>
        <option value="New York Knicks">New York Knicks</option>
        <option value="San Antonio Spurs">San Antonio Spurs</option>
      </select>
    </label>
  </div>
);

export default TeamSelection;
