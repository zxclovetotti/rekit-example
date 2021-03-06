import React, { PureComponent, PropTypes } from 'react';

export default class CommentList extends PureComponent {
  static propTypes = {
    topicId: PropTypes.string.isRequired,
    fetchCommentList: PropTypes.func.isRequired,
    dismissFetchCommentListError: PropTypes.func.isRequired,
    commentState: PropTypes.any.isRequired,
  };

  componentWillMount() {
    this.refresh();
  }

  componentWillReceiveProps(props) {
    if ((props.commentState.needReloadList
      || props.commentState.topicId !== props.topicId)
      && !props.commentState.fetchCommentListPending) {
      this.refresh();
    }
  }

  componentWillUnmount() {
    this.props.dismissFetchCommentListError();
  }

  refresh() {
    this.props.fetchCommentList(this.props.topicId);
  }

  render() {
    const { fetchCommentListPending } = this.props.commentState;
    let listData = [];
    if (this.props.commentState.topicId === this.props.topicId) {
      listData = this.props.commentState.listData || [];
    }
    return (
      <div className="comment-comment-list">
        <h4>Comments ({listData.length})</h4>
        {fetchCommentListPending && <div className="loading">Loading</div>}
        <ul>
          {
            listData.map(item => (
              <li key={item.id}>
                <div className="author-date">
                  <span className="author">{item.get('author')}</span>
                  <span className="date">{item.createdAt.toString().replace(/\s*[\(（].*/g, '')}</span>
                </div>
                <div className="comment-content">
                  {item.get('content').split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </li>
            ))
          }
        </ul>
        {listData.length === 0 && <div className="no-comment-tip">No comment yet.</div>}
      </div>
    );
  }
}
