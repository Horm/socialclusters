import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Typography from "@material-ui/core/Typography/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import Divider from "@material-ui/core/Divider/Divider";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions/ExpansionPanelActions";
import Button from "@material-ui/core/Button/Button";
import ExpansionPanel from "@material-ui/core/ExpansionPanel/ExpansionPanel";
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types"
import {compose, withHandlers, withState} from "recompose"

const styles = (theme) => ({
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

const Topic = ({id, name, handleSave, classes, handleNameChange, handleIdChange}) => {

  return (
    <ExpansionPanel defaultExpanded={id === ""}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
        <div className={classes.column}>
          <Typography className={classes.heading}>{name}</Typography>
        </div>
        <div className={classes.column}>
          <Typography className={classes.secondaryHeading}>{id}</Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <TextField label={"Name"} value={name} onChange={handleNameChange} className={classes.textField} fullWidth/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={"ID"} value={id}  onChange={handleIdChange} className={classes.textField} fullWidth/>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
      <Divider/>
      <ExpansionPanelActions>
        <Button size="small">Cancel</Button>
        <Button size="small" color="primary" onClick={handleSave}>
          Save
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  )
}

Topic.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  handleSave: PropTypes.func
}

Topic.defaultProps = {
  id: "",
  name: "",
  handleSave: () => {}
}

export default compose(
  withStyles(styles),
  withState('name', 'updateName', props=>props.name),
  withState('id', 'updateId', props=>props.id),
  withHandlers({
    handleNameChange: props => event => {
      props.updateName(event.target.value)
    },
    handleIdChange: props => event => {
      props.updateId(event.target.value)
    },
    handleSave: props => event => {
      event.preventDefault();
      props.onChange(props.name)
      props.onChange(props.id)
    },
  }),
)(Topic)
