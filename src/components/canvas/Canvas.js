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
			mouseX : 0,
			mouseY : 0,
			radius : 30
		}
	}

	/*
		drawCircle method to draw Circle with single click on canvas
		setState is not required for drawing, but for showing the x and y co-ordinates, later it can be removed
	*/
	drawCircle = (event) => {
		this.setState({
			mouseX : event.clientX - this.state.canvas.getBoundingClientRect().left,
			mouseY : event.clientY - this.state.canvas.getBoundingClientRect().top
		}, () => {
			this.state.context.beginPath();
			this.state.context.arc(this.state.mouseX, this.state.mouseY, this.state.radius, 0, (Math.PI/180)*360, 0)
			this.state.context.stroke();
		})
	}

	//set the canvas and context as canvas object
	componentDidMount() {
		this.setState({
			canvas : document.getElementById("canvas"),
		}, () => {
			this.setState({
				context : this.state.canvas.getContext('2d')
			})			
		})
	}


    render() {

		return (
		<div className="Canvas">
			<canvas id="canvas" width={this.state.width} height={this.state.height} onClick={this.drawCircle}>
				<p>Canvas element is not supported</p>
			</canvas>
			<p> x: {this.state.mouseX}, y : {this.state.mouseY}</p>
		</div>
		);
  	}
}

export default Canvas;
