import React, { Component } from 'react';
import './Canvas.css';

class Canvas extends Component {
	constructor(props){
		super(props);
		this.state = {
			width : 500,
			height : 500,
			canvas : null,
			context : null,
		}
		this.radius = 30;
		this.states = [];
		this.toMove = false;
		this.delX = 0;
		this.delY = 0;
		this.selectedState = null;
	}

	/**
	 * drawCircle method to draw Circle with single click on canvas
	 * setState is not required for drawing, but for showing the x and y co-ordinates, later it can be removed
	 */
	drawCircle = (event) => {
		var mouse = this.getMouseLocation(event);
		var mouseX = mouse.x;
		var mouseY = mouse.y;
		this.state.context.beginPath();
		this.state.context.arc(mouseX, mouseY, this.radius, 0, (Math.PI/180)*360, 0)
		this.state.context.stroke();
		var state = {};
		state.id = this.states[this.states.length - 1] ? this.states[this.states.length - 1].id + 1 : 0
		state.x = mouseX;
		state.y = mouseY;
		this.states.push(state)
		this.printstates()
	}

	/**
	 * Print the states array
	 */
	printstates() {
		this.states.forEach(state => {
			console.log(state);
		});
	}

	/**
	 * function to check if mouse click co-ordinates is inside a circle, using euclidean distance
	 * @param {object} state 
	 * @param {string} x 
	 * @param {string} y 
	 */
	containsPoints(state, x, y) {
		console.log('inside containpoints')
		if (this.radius < Math.abs(Math.sqrt(Math.pow((state.x - x),2) + Math.pow((state.y - y),2))))
			return false
		else
			return true
	}

	/**
	 * Draw the shapes in states[]
	 */
	reDraw() {
		this.state.context.clearRect(0, 0, this.state.width, this.state.height)
		for(var i = 0; i < this.states.length; i++){
			this.state.context.beginPath();
			this.state.context.arc(this.states[i].x, this.states[i].y, this.radius, 0, (Math.PI/180)*360, 0)
			this.state.context.stroke();
		}
	}

	/**
	 * set the canvas and context as canvas object
	 */
	componentDidMount() {
		this.setState({
			canvas : document.getElementById("canvas"),
		}, () => {
			this.setState({
				context : this.state.canvas.getContext('2d')
			})			
		})
	}

	/**
	 * Event for selecting a state object and allow for dragging the selected object
	 */
	selectObjectHandler = (event) => {
		console.log("inside selectObjectHandler")
		var mouse = this.getMouseLocation(event);
		var selectX = mouse.x;
		var selectY = mouse.y;
		console.log('selectX and selectY', selectX, selectY)
		for(var i = this.states.length - 1; i >=0; i --) {
			if (this.containsPoints(this.states[i], selectX, selectY)){
				this.toMove = true;
				console.log(this.toMove)
				this.selectedState = this.states[i];
				this.delX = selectX - this.selectedState.x;
				this.delY = selectY - this.selectedState.y;
				console.log('delX and delY', this.delX, this.delY)
				console.log('selected node ', this.selectedState.x, this.selectedState.y) ;
				return;
			}
		}
		if(this.selectedState) {
			console.log("unselected node " + this.selectedState.id)
			this.selectedState = null;
			this.toMove = false;
		}
	}

	/**
	 * Event for tracking the state object movement with mouse tracking
	 */
	moveObjectHandler = (event) => {
		if(this.toMove){
			var mouse = this.getMouseLocation(event);
			this.selectedState.x = mouse.x - this.delX;
			this.selectedState.y = mouse.y - this.delY;
			this.reDraw();
		}
	}

	/**
	 * Event for making toMove as false, when user lifts the mouse up
	 */
	mouseUpHandler = () => {
		console.log('inside mouseUpHandler');
		this.toMove = false;
	}

	/**
	 * Event for clearing the whole canvas
	 */
	clearCanvas = () => {
		this.state.context.clearRect(0,0, this.state.width, this.state.height);
		this.states = [];
	}

	/**
	 * get mouse x and y co-ordinates inside the canvas
	 * @param {object} event 
	 */
	getMouseLocation(event) {
		var mouse = {};
		mouse.x = event.clientX - this.state.canvas.getBoundingClientRect().left;
		mouse.y = event.clientY - this.state.canvas.getBoundingClientRect().top;
		return mouse;
	}

    render() {
		return (
			<div className="Canvas">
				<div className="Canvas_" >
					<canvas id="canvas" width={this.state.width} height={this.state.height} onDoubleClick={this.drawCircle} onMouseDown={this.selectObjectHandler} onMouseMove={this.moveObjectHandler} onMouseUp={this.mouseUpHandler}>
						<p>Canvas element is not supported</p>
					</canvas>
				</div>
				<button onClick={this.clearCanvas}>Clear Canvas</button>
			</div>
		);
  	}
}

export default Canvas;
