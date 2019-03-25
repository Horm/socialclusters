import React from 'react';
import PlatformPostTable from "./PlatformPostTable";
import PostDetail from "./PostDetail";
import {Route, Switch} from "react-router-dom";


class Posts extends React.Component {

  state = {
    postDialogContent: 'Something went wrong...',
    openedPost: {},
    postOpened: false,
    defaultSize: 5,
    platformSaveTopicsHandler: () => Promise.resolve()
  }


  handleClickOpen = (post, content) => {
    this.setState({postOpened: true, postDialogContent: content, openedPost: post});
  };


  render() {
    const {topics, platforms} = this.props;

    return (
      <Switch>
        <Route exact path={"/posts"} component={() =>
          <div>
            {platforms.map((platform, index) => <PlatformPostTable
              key={index}
              platformName={platform.name}
              platform={platform.id}
              columns={platform.columns}
              topics={topics}
              handleOpenPost={(post) => {
                this.handleClickOpen(post, platform.detailsContentFormat(post))
                this.setState({platformSaveTopicsHandler: platform.savePostTopics})
            }
            }
              deletePost={platform.deletePost}
              getPostsAsPage={platform.getPostsAsPage}/>)}</div>


        }/>
        <Route path={"/posts/:platform/:postId"} component={({match}) =>

          <PostDetail topicOptions={topics} match={match}/>}/>
      </Switch>
    )

  }
}


export default (Posts)
