import React, { Component } from 'react';
import './TimeControl.css';

class TimeControl extends Component {
	constructor(props) {
		super(props);
		this.handleIncrease = this.handleIncrease.bind(this);
		this.handleDecrease = this.handleDecrease.bind(this);
	}

	handleIncrease() {
		this.props.increase();
	}
	handleDecrease() {
		this.props.decrease();
	}
	render() {
		let controlType = this.props.title.toLowerCase();

		return (
			<div className="TimeControl">
				<h1 id={`${controlType}-label`}>{this.props.title}</h1>
				<div id="TimeControl-customization">
					<button
						id={`${controlType}-decrement`}
						onClick={this.handleDecrease}
						disabled={this.props.isPlaying}
					>
						<i className="fas fa-arrow-down" />
					</button>
					<p id={`${controlType}-length`} className="TimeControl-length">
						{this.props.length}
					</p>
					<button
						id={`${controlType}-increment`}
						onClick={this.handleIncrease}
						disabled={this.props.isPlaying}
					>
						<i className="fas fa-arrow-up" />
					</button>
				</div>
			</div>
		);
	}
}

export default TimeControl;
