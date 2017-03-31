var React = require('react');

var connect = require('react-redux').connect;

var StarRater = require('./recipe-rater');

var actions = require('../actions/index');

var Repository = React.createClass({
    componentDidMount: function() {
        this.props.dispatch(
            actions.fetchDescription(this.props.repository.name)
        );
    },
    changeRating: function(rating) {
        console.log(this.props);
        this.props.dispatch(
            actions.rateRepository(this.props.repository.name, rating)
        );
    },
    render: function() {
        console.log(this.props);
        return (
            <div className="repository">
                {this.props.repository.name} - {this.props.repository.description}
                &nbsp;
                <ReceipeRater rating={this.props.repository.rating}
                           onChange={this.changeRating} />
            </div>
        );
    }
});

module.exports = Repository;

var Container = connect()(Repository);

module.exports = Container;