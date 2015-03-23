/* jshint esnext: true */
class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {comments: this.fetchComments()};
  }
  handleCommentSubmit(comment) {
    var comments = this.fetchComments();
    comments.push(comment);
    localStorage.comments = comments;
  }
  fetchComments() {
    var comments = localStorage.comments;
    if (typeof comments === "undefined") {
      comments = JSON.stringify([]);
      localStorage.comments = comments;
    }
    return this.parseComments(comments);
  }
  parseComments(comments) {
    try {
      comments = JSON.parse(comments);
    } catch (e) {
      comments = [];
    }
    return comments;
  }
  componentDidMount() {
    this.setState({comments: this.fetchComments()});
  }
  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList comments={this.state.comments}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
}
class CommentList extends React.Component {
  render() {
    var commentNodes = this.props.comments.map(comment => {
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
}
class CommentForm extends React.Component {
  handleSubmit(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text   = React.findDOMNode(this.refs.text).value.trim();

    if (!text || !author) {
      return;
    }

    something.props.onCommentSubmit({author: author, text: text});
    React.findDOMNode(something.refs.author).value = '';
    React.findDOMNode(something.refs.text).value = '';
  }
  render() {
    // need to bind context when using a class. this way otherwise its bound to window
    return (
      <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
        <input type="text" ref="author" placeholder="Your name" onKeyUp={this.blah}/>
        <input type="text" ref="text" placeholder="Say something..." />
        <input type="submit" value="Post" />
      </form>
    );
  }
}
var converter = new Showdown.converter();
class Comment extends React.Component {
  render() {
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
}
React.render(
  <CommentBox />,
  document.getElementById('content')
);