import React from 'react';

const TeamSelection = ({ handleTeamChange, allTeams }) => (
  <div>
    <label>
      Graph Type:&nbsp;
      <select defaultValue='Choose Team' onChange={ handleTeamChange }>
        <option disabled>Choose Team</option>
        {allTeams.map((team, i) => <option key={i} value={team}>{team}</option>)}
      </select>
    </label>
  </div>
);

export default TeamSelection;
