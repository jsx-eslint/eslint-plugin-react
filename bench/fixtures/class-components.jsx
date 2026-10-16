import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';

export class TodoList extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      done: PropTypes.bool,
    })).isRequired,
    onToggle: PropTypes.func,
    filter: PropTypes.oneOf(['all', 'active', 'done']),
  };

  static defaultProps = {
    onToggle: () => {},
    filter: 'all',
  };

  constructor(props) {
    super(props);
    this.state = { editing: null, draft: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({ editing: null });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.items.length !== this.props.items.length) {
      this.setState({ draft: '' });
    }
  }

  handleChange(event) {
    this.setState({ draft: event.target.value });
  }

  renderItem(item, index) {
    return (
      <li key={index} className={item.done ? 'done' : ''} onClick={() => this.props.onToggle(item.id)}>
        <input type="checkbox" checked={item.done} />
        {item.title}
        {this.state.editing === item.id && <input value={this.state.draft} onChange={this.handleChange} />}
      </li>
    );
  }

  render() {
    const { items, filter } = this.props;
    const visible = items.filter((item) => filter === 'all' || (filter === 'done' ? item.done : !item.done));
    return (
      <div>
        <h1>Todos ({visible.length})</h1>
        <ul>{visible.map((item, index) => this.renderItem(item, index))}</ul>
        <a href="javascript:void(0)" target="_blank">help</a>
      </div>
    );
  }
}

export default class Counter extends PureComponent {
  state = { count: 0 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  shouldComponentUpdate() {
    return true;
  }

  render() {
    return (
      <div style={{ padding: 8 }}>
        <span>{this.state.count}</span>
        <button onClick={this.increment}>+</button>
        <button type="button" onClick={() => this.setState({ count: 0 })}>reset</button>
      </div>
    );
  }
}

export const Legacy = React.createClass({
  propTypes: {
    name: PropTypes.string,
  },
  getInitialState() {
    return { visible: true };
  },
  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.props.name }} />;
  },
});

export class Profile extends React.Component {
  componentWillMount() {
    this.unused = true;
  }

  render() {
    const { user } = this.props;
    return (
      <section>
        <img src={user.avatar} />
        <p className="name" class="bio">{user.name}</p>
        <Profile.Details user={user} ref="details" />
      </section>
    );
  }
}
