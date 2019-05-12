import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import PostsToolbar from "./PostsToolbar";
import PostsTableHead from "./PostsTableHead";
import PostsTableBody from "./PostsTableBody";
import * as PropTypes from "prop-types";
import {getTopicsForAPI} from "../../lib/topics";

const styles = (theme) => ({
  table: {
    minWidth: 100,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
});

class PlatformPostTable extends React.Component {


  rowsPerPageOptions = [5, 10, 20];

  deletePost = this.props.deletePost;
  getPostsAsPage = this.props.getPostsAsPage;

  state = {
    filterWithTopic: {},
    filterWithoutTopic: false,
    orderBy: "timestamp",
    order: "desc",
    twitter: [],
    selected: [],
    rowsPerPage: this.rowsPerPageOptions[0],
    dataLength: 0,
    page: 0,
    anchorEl: null,
  };


  handleFilterTopicSwitch = (topicId) => {
    console.log(topicId);
    if (!topicId) {
      this.setState(prevState => {
        this.fetchPosts(this.state.rowsPerPage, this.state.page, !prevState.filterWithoutTopic, {}); // TODO - Refactor
        return {
          filterWithoutTopic: !prevState.filterWithoutTopic,
          filterWithTopic: {}
        }
      });
      console.log(this.state.filterWithTopic)
    } else {
      this.setState(prevState => {
        const newObject = prevState.filterWithTopic;
        newObject[topicId] = !!!newObject[topicId];
        this.fetchPosts(this.state.rowsPerPage, this.state.page, false, newObject); // TODO - Refactor

        return {
          filterWithTopic: newObject,
          filterWithoutTopic: false
        }
      });
    }





  };

  handleSortClick = (field) => {

    const getOppositeOrder = prevState => prevState.order === 'asc' ? 'desc' : 'asc';

    if (field === this.state.orderBy) {
      // TODO - Asc Dsc constants
      this.setState(prevState => {
        this.fetchPosts(prevState.size, prevState.page, prevState.filterWithoutTopic, prevState.filterWithTopic, `${prevState.orderBy},${getOppositeOrder(prevState)}`)
        return {order: getOppositeOrder(prevState)}
      })
    } else {
      this.setState(prevState => {
        this.fetchPosts(prevState.size, prevState.page, prevState.filterWithoutTopic, prevState.filterWithTopic, `${field},${prevState.order}`);
        return {orderBy: field}
      })
    }


  };

  handleSelectClick = (event, id) => {
    const {selected} = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({selected: newSelected});
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({selected: state.twitter.map(n => n._id)})); // TODO - Multi Data Source
      return;
    }
    this.setState({selected: []});
  };


  handlePageChange = (event, page) => {
    this.setState({page})
    this.fetchPosts(this.state.rowsPerPage, page) // TODO - Refactor

  };

  handleChangeRowsPerPage = event => {
    this.setState({rowsPerPage: event.target.value});
    this.fetchPosts(event.target.value, this.state.page) // TODO - Refactor

  };

  handleDeletePosts() {
    let promises = this.state.selected.map(selectedPostId => this.deletePost(selectedPostId));

    Promise.all(promises)
      .then(() => {
        this.setState({selected: []});
        this.fetchPosts()
      })
      .catch(error => console.error(error))
  }


  componentDidMount() {
    this.fetchPosts(this.state.rowsPerPage, this.state.page)
  }


  fetchPosts(size = this.state.rowsPerPage, page = this.state.page, filterWithoutTopic = this.state.filterWithoutTopic, filterWithTopic = this.state.filterWithTopic, sort = `${this.state.orderBy},${this.state.order}`) {
    let applyResponseToState = response => {
      this.setState({
        page: response.data.number,
        dataLength: response.data.totalElements,
        rowsPerPage: response.data.size, // TODO
        twitter: response.data.content,
      })
    };

    const topics = getTopicsForAPI(this.state.filterWithTopic);

    this.getPostsAsPage(size, page, filterWithoutTopic, topics, sort)
      .then(applyResponseToState)
      .catch(error => console.log(error))
  }


  render() {
    const {classes, topics, columns, platformName, handleOpenPost, platform} = this.props;


    return (

      <Paper className={classes.root}>
        <PostsToolbar
          title={platformName}
          numSelected={this.state.selected.length}
          handleDeletePosts={this.handleDeletePosts.bind(this)}
          handleFilterTopicSwitch={this.handleFilterTopicSwitch}
          filterWithTopic={this.state.filterWithTopic}
          filterWithoutTopic={this.state.filterWithoutTopic}
          topics={topics}
        />


        <div className={classes.tableWrapper}>

          <Table className={classes.table} aria-labelledby="tableTitle">
            <PostsTableHead
              order={this.state.order}
              orderBy={this.state.orderBy}
              numSelected={this.state.selected.length}
              rowCount={this.state.twitter.length}
              columns={columns}
              handleSelectAllClick={this.handleSelectAllClick}
              handleSortClick={this.handleSortClick}
            />
            <PostsTableBody
              platform={platform}
              twitter={this.state.twitter}
              selected={this.state.selected}
              topics={topics}
              handleOpenPost={handleOpenPost}
              columns={columns}
              handleSelect={this.handleSelectClick}
            />
          </Table>

        </div>

        <TablePagination
          rowsPerPageOptions={this.rowsPerPageOptions}
          component="div"
          count={this.state.dataLength}
          rowsPerPage={this.state.rowsPerPage}
          page={this.state.page}
          onChangePage={this.handlePageChange}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    )
  }

}

PlatformPostTable.propTypes = {
  platformName: PropTypes.string.isRequired,
  topics: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  deletePost: PropTypes.func.isRequired,
  getPostsAsPage: PropTypes.func.isRequired,
};

PlatformPostTable.defaultProps = {
  platformName: "",
  topics: [],
  columns: [],
  deletePost: () => Promise.resolve(),
  getPostsAsPage: () => Promise.resolve(),
}


export default withStyles(styles)(PlatformPostTable)
