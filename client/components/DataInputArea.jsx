import React from 'react';

const DataInputArea = ({ handleTextAreaInputChange, handleTextAreaSubmit, textAreaInput }) => (
  <div>
    <form onSubmit={handleTextAreaSubmit}>
      <label>
        Input Custom Data:&nbsp;
        <br/>
        <textarea
          placeholder="INPUT FORMAT: Date, Start(ET), Visitor/Neutral, PTSVisitor, Home/Neutral,PTSHome, DataType, OT?, Attend., Notes"
          onChange={handleTextAreaInputChange}
          value={textAreaInput}>
        </textarea>
      </label>
      <br/>
      <button type="Submit">Submit Data</button>
    </form>
  </div>
);

export default DataInputArea;
