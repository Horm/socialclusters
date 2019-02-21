import React from 'react';
import withStyles from "@material-ui/core/es/styles/withStyles";
import List from "@material-ui/core/List/List";
import Fab from "@material-ui/core/Fab/Fab";
import Icon from "@material-ui/core/Icon/Icon";
import PropTypes from "prop-types";
import Topic from "./Topic";

const styles = (theme) => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },

  column: {
    flexBasis: '33.33%',
  },
  textField: {
    paddingRight: 8
  },
})

class Topics extends React.Component {
  state = {
    showAdd: false
  }


  render() {
    const {classes, topics, handleChange} = this.props


    let layout = topics =>
      <div>
      {topics.map(topic => <Topic id={topic.id} name={topic.name} handleSave={handleChange}/>)}
      <List>
      </List>
      <Fab color="primary" className={classes.fab} onClick={() => this.setState({showAdd: true})}>
        <Icon>add</Icon>
      </Fab>

    </div>


    if (this.state.showAdd) {
      return layout(topics.concat([{id: "", name: ""}]))
    } else {
      return layout(topics)
    }
  }
};

Topics.propTypes = {
  topics: PropTypes.array,
  handleChange: PropTypes.func,
};

Topics.defaultProps = {
  topics: [],
  handleChange: () => {}
};

export default withStyles(styles)(Topics)
