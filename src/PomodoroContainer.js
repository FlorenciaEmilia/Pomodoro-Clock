import React, { Component } from 'react';
import TimeControl from './TimeControl';
import './PomodoroContainer.css';

const audio = document.getElementById('beep');

class PomodoroContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			breakLength: 5,
			sessionLength: 25,
			sessionTotal: 25 * 60,
			breakTotal: 5 * 60,
			breakOn: false,
			isPlaying: false
		};
		this.increaseBreak = this.increaseBreak.bind(this);
		this.decreaseBreak = this.decreaseBreak.bind(this);
		this.increaseSession = this.increaseSession.bind(this);
		this.decreaseSession = this.decreaseSession.bind(this);
		this.playPause = this.playPause.bind(this);

		this.timeReducer = this.timeReducer.bind(this);

		this.totalTime = this.totalTime.bind(this);
		this.changeLength = this.changeLength.bind(this);
		this.reset = this.reset.bind(this);
	}

	changeLength(typeOfLength, action) {
		let newLength = this.state[typeOfLength];
		if (action === 'increment' && newLength <= 59) {
			newLength++;
		} else if (action === 'decrement' && newLength > 1) {
			newLength--;
		}

		if (typeOfLength === 'breakLength') {
			this.setState({
				breakLength: newLength,
				breakTotal: newLength * 60
			});
		} else if (typeOfLength === 'sessionLength') {
			this.setState({
				sessionLength: newLength,
				sessionTotal: newLength * 60
			});
		}
	}

	increaseBreak() {
		this.changeLength('breakLength', 'increment');
	}
	decreaseBreak() {
		this.changeLength('breakLength', 'decrement');
	}
	increaseSession() {
		this.changeLength('sessionLength', 'increment');
	}
	decreaseSession() {
		this.changeLength('sessionLength', 'decrement');
	}

	reset() {
		this.setState({
			breakLength: 5,
			sessionLength: 25,
			sessionTotal: 25 * 60,
			breakTotal: 5 * 60,
			breakOn: false,
			isPlaying: false
		});
		clearInterval(this.intervalID);
		audio.pause();
		audio.currentTime = 0;
	}

	componentWillUnmount() {
		clearInterval(this.intervalID);
	}
	playPause() {
		if (!this.state.isPlaying) {
			//this.timeReducer();
			this.intervalID = setInterval(this.timeReducer, 1000);
			this.setState({
				isPlaying: true
			});
		} else {
			clearInterval(this.intervalID);
			this.setState({
				isPlaying: false
			});
		}
	}

	totalTime(count) {
		let minutes = Math.floor(count / 60);
		let seconds = count % 60;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return `${minutes}:${seconds}`;
	}

	timeReducer() {
		let { breakLength, sessionLength, breakOn, sessionTotal, breakTotal } = this.state;
		if (!breakOn) {
			if (sessionTotal > 0) {
				this.setState((state) => ({
					sessionTotal: state.sessionTotal - 1
				}));
			} else if (sessionTotal === 0) {
				this.setState((state) => ({
					sessionTotal: sessionLength * 60,
					breakOn: true
				}));
				audio.play();
			}
		} else if (breakOn) {
			if (breakTotal > 0) {
				this.setState((state) => ({
					breakTotal: state.breakTotal - 1
				}));
			} else if (breakTotal === 0) {
				this.setState((state) => ({
					breakTotal: breakLength * 60,
					breakOn: false
				}));
				audio.play();
			}
		}
	}

	render() {
		const { sessionLength, breakLength, isPlaying, breakOn, breakTotal, sessionTotal } = this.state;

		const breakProps = {
			title: 'Break',
			length: breakLength,
			increase: this.increaseBreak,
			decrease: this.decreaseBreak,
			isPlaying: isPlaying
		};

		const sessionProps = {
			title: 'Session',
			length: sessionLength,
			increase: this.increaseSession,
			decrease: this.decreaseSession,
			isPlaying: isPlaying
		};

		return (
			<div className="PomodoroContainer">
				<h1>Pomodoro Clock</h1>
				<div id="PomodoroContainer-TimeControl">
					<TimeControl {...breakProps} />
					<TimeControl {...sessionProps} />
				</div>

				<div id="PomodoroContainer-timerContainer">
					<div id="PomodoroContainer-timer">
						<h1 id="timer-label">{breakOn ? 'Break' : 'Session'}</h1>
						<span id="time-left">
							{breakOn ? this.totalTime(breakTotal) : this.totalTime(sessionTotal)}
						</span>
					</div>
					<div id="PomodoroContainer-buttons">
						<button id="start_stop" className={isPlaying ? 'Pause' : 'Play'} onClick={this.playPause}>
							{isPlaying ? 'Pause' : 'Play'}
						</button>

						<button id="reset" onClick={this.reset}>
							<i className="fas fa-redo" />
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default PomodoroContainer;
