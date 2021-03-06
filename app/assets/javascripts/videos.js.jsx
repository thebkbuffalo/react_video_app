// var data = [
//   {id: 1, artist: "The Clash", url: <iframe width="420" height="315" src="https://www.youtube.com/embed/AL8chWFuM-s" frameborder="0" allowfullscreen></iframe>},
//   {id: 2, artist: "Pantera", url: <iframe width="420" height="315" src="https://www.youtube.com/embed/7m7njvwB-Ks" frameborder="0" allowfullscreen></iframe>}
// ]
$(document).ready(function(){
  var VideoPlayer = React.createClass({
    loadVideosFromServer: function() {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    handleVideoSubmit: function(video) {
      var videos = this.state.data;
      video.id = Date.now();
      var newVideos = videos.concat([video]);
      this.setState({data: newVideos});
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: { video: video },
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          this.setState({data: videos});
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    },
    getInitialState: function() {
      return {data: []};
    },
    componentDidMount: function() {
      this.loadVideosFromServer();
      setInterval(this.loadVideosFromServer, this.props.pollInterval);
    },
    render: function() {
      return (
        <div className="videoBox">
          <h1>Videos!!</h1>
          <ListOfVideos data={this.state.data} />
          <VideoForm onVideoSubmit={this.handleVideoSubmit} />
        </div>
      );
    }
  });
  var ListOfVideos = React.createClass({
    render: function() {
      var videoNodes = this.props.data.map(function(video) {
        return (
          <Video artist={video.artist} key={video.id}>

            <iframe width="420" height="315" src={video.embed} frameborder="0" allowfullscreen></iframe>

          </Video>
        );
      });
      return (
        <div className="videoList">
          {videoNodes}
        </div>
      );
    }
  });

  var VideoForm = React.createClass({
    getInitialState: function() {
      return {artist: "", embed: ""};
    },
    handleArtistChange: function(e) {
      this.setState({artist: e.target.value});
    },
    handleUrlChange: function(e) {
      this.setState({embed: e.target.value})
    },
    handleSubmit: function(e) {
      e.preventDefault();
      var artist = this.state.artist
      var embed = this.state.embed
      this.props.onVideoSubmit({artist: artist, embed: embed})
      this.setState({artist: "", embed: ""});
    },
    render: function() {
      return (
        <form className="videoForm" onSubmit={this.handleSubmit}>
          <hr></hr>
          <h1>Add A New Video</h1>
          <input type="text" placeholder="Artist" value={this.state.artist} onChange={this.handleArtistChange} /><br/><br/>
          <p>The Annoying Part: To get the proper link, click Embed and than copy the src from the link without the quotes. (I was trying to figure out string concatination like in Ruby, but that seems more difficult with React.)</p>
          <input type="text" placeholder="Video Embed" value={this.state.embed} onChange={this.handleUrlChange} /><br/><br/>
          <input type="submit" value="Post" />
        </form>
      );
    }
  });

  var Video = React.createClass({
    render: function() {
      return (
        <div className="video">
          <h2 className="artist">
            {this.props.artist}

          </h2>
          {this.props.children}
        </div>
      );
    }
  });

  ReactDOM.render(
    <VideoPlayer url="videos.json" pollInterval={2000} />,
    document.getElementById('content')
  );
});

// $(function() {
//   React.renderComponent(
//     <VideoPlayer url="videos.json" pollInterval={2000} />,
//     document.getElementById('content')
//   );
// })
