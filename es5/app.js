var CommentBox = React.createClass({
  getInitialState: function() {
    return {comments: this.fetchComments()};
  },
  handleCommentSubmit: function(comment) {
    var comments = this.fetchComments();
    comments.push(comment);
    this.setState({comments: comments});
    localStorage.comments = JSON.stringify(comments);
  },
  fetchComments: function() {
    var comments = localStorage.comments;
    if (typeof comments === "undefined") {
      comments = JSON.stringify([]);
      localStorage.comments = comments;
    }
    return this.parseComments(comments);
  },
  parseComments: function(comments) {
    try {
      comments = JSON.parse(comments);
    } catch (e) {
      comments = [];
    }
    return comments;
  },
  componentDidMount: function() {
    this.setState({comments: this.fetchComments()});
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList comments={this.state.comments}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.comments.map(function(comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
var CommentForm= React.createClass({
  handleSubmit: function(e) {

    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text   = React.findDOMNode(this.refs.text).value.trim();

    if (!text || !author) {
      return;
    }

    this.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(this.refs.author).value = '';
    React.findDOMNode(this.refs.author).focus();
    React.findDOMNode(this.refs.text).value = '';
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" ref="author" placeholder="Your name" onKeyUp={this.blah}/>
        <input type="text" ref="text" placeholder="Say something..." />
        <input type="submit" value="Post" />
      </form>
    );
  }
});
var converter = new Showdown.converter();
var Comment= React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
React.render(
  <CommentBox />,
  document.getElementById('content')
);