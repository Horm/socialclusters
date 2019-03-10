import React from "react";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import * as PropTypes from "prop-types";
import TableRow from "@material-ui/core/TableRow";

let PostsTableBody = props => {
  const {twitter, selected, topics, handleSelect} = props


  const getTopicName = id => ((topics || [])[(topics || []).map(topic => topic.textId).indexOf(id)] || {name: id}).name;
  const getTopics = (topics) => (topics || []).map(topic => getTopicName(topic)).join(', ');
  const getText = (text) => (text || '').substr(0, 20) + '...';

  const isSelected = id => selected.indexOf(id) !== -1;

  return <TableBody>
    {twitter.map((post, index) => <TableRow
      hover
      role="checkbox"
      aria-checked={false}
      tabIndex={-1}
      selected={false}
      onClick={event => handleSelect(event, post._id)}
    >
      <TableCell padding="checkbox">
        <Checkbox checked={isSelected(post._id)}/>
      </TableCell>
      <TableCell align="left">{post.timestamp}</TableCell>
      <TableCell align="left">{"Twitter"}</TableCell>

      <TableCell align="left">{post.author.username}</TableCell>
      <TableCell component="th" scope="row" padding="none">
        {getText(post.text)}
      </TableCell>
      <TableCell align="left">{getTopics(post.topics)}</TableCell>
    </TableRow>)}
  </TableBody>;
}

PostsTableBody.propTypes = {
  twitter: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  topics: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired
}

PostsTableBody.defaultProps = {
  twitter: [],
  selected: [],
  topics: [],
  handleSelect: () => {
  },
}


export default PostsTableBody
