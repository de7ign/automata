import React, { Component } from 'react';
import { Paper } from '@material-ui/core';

class Canvas extends Component {
  // constructor(props){
  // 	super(props);
  // 	this.state = {
  // 		width : 500,
  // 		height : 500,
  // 		canvas : null,
  // 		context : null,
  // 	}
  // 	this.radius = 30;
  // 	this.states = [];
  // 	this.toMove = false;
  // 	this.toDrawLink = false;
  // 	this.delX = 0;
  // 	this.delY = 0;
  // 	this.selectedState = null;
  // 	this.arrowHeadlength = 30;
  // 	this.arrowAngle =  Math.atan2(100-40,100-40);;
  // }

  // /**
  //  * drawCircle method to draw Circle with single click on canvas
  //  * setState is not required for drawing, but for showing the x and y co-ordinates, later it can be removed
  //  */
  // drawCircle = (event) => {
  // 	var mouse = this.getMouseLocation(event);
  // 	var mouseX = mouse.x;
  // 	var mouseY = mouse.y;
  // 	this.state.context.beginPath();
  // 	this.state.context.arc(mouseX, mouseY, this.radius, 0, (Math.PI/180)*360, 0)
  // 	this.state.context.stroke();
  // 	var state = {};
  // 	state.id = this.states[this.states.length - 1] ? this.states[this.states.length - 1].id + 1 : 0
  // 	state.x = mouseX;
  // 	state.y = mouseY;
  // 	this.states.push(state)
  // 	this.printstates()
  // }

  // /**
  //  * Print the states array
  //  */
  // printstates() {
  // 	this.states.forEach(state => {
  // 		console.log(state);
  // 	});
  // }

  // /**
  //  * function to check if mouse click co-ordinates is inside a circle, using euclidean distance
  //  * @param {object} state 
  //  * @param {string} x 
  //  * @param {string} y 
  //  */
  // containsPoints(state, x, y) {
  // 	console.log('inside containpoints')
  // 	if (this.radius < Math.abs(Math.sqrt(Math.pow((state.x - x),2) + Math.pow((state.y - y),2))))
  // 		return false
  // 	else
  // 		return true
  // }

  // /**
  //  * Draw the shapes in states[]
  //  */
  // reDraw() {
  // 	this.state.context.clearRect(0, 0, this.state.width, this.state.height)
  // 	for(var i = 0; i < this.states.length; i++){
  // 		this.state.context.beginPath();
  // 		this.state.context.arc(this.states[i].x, this.states[i].y, this.radius, 0, (Math.PI/180)*360, 0)
  // 		this.state.context.stroke();
  // 	}
  // }

  // /**
  //  * set the canvas and context as canvas object
  //  */
  // componentDidMount() {
  // 	this.setState({
  // 		canvas : document.getElementById("canvas"),
  // 	}, () => {
  // 		this.setState({
  // 			context : this.state.canvas.getContext('2d')
  // 		}, ()=>{

  // 		})			
  // 	})

  // 	document.addEventListener("keydown", this.canvasKeyHandler.bind(this))
  // 	document.addEventListener("keyup", this.canvasKeyHandler.bind(this))
  // }

  // /**
  //  * Event for selecting a state object and allow for dragging the selected object
  //  */
  // selectObjectHandler = (event) => {
  // 	console.log("inside selectObjectHandler")

  // 	//draw link
  // 	if(this.toDrawLink){
  // 		/**
  // 		 * First draw self-link, when the mouse pointer goes out of circumference, then arrow will be drawn
  // 		 */

  // 		 this.state.context.beginPath();
  // 		 this.state.context.arc()

  // 	}

  // 	var mouse = this.getMouseLocation(event);
  // 	var selectX = mouse.x;
  // 	var selectY = mouse.y;
  // 	console.log('selectX and selectY', selectX, selectY)
  // 	for(var i = this.states.length - 1; i >=0; i --) {
  // 		if (this.containsPoints(this.states[i], selectX, selectY)){
  // 			this.toMove = true;
  // 			console.log(this.toMove)
  // 			this.selectedState = this.states[i];
  // 			this.delX = selectX - this.selectedState.x;
  // 			this.delY = selectY - this.selectedState.y;
  // 			console.log('delX and delY', this.delX, this.delY)
  // 			console.log('selected node ', this.selectedState.x, this.selectedState.y) ;
  // 			return;
  // 		}
  // 	}
  // 	if(this.selectedState) {
  // 		console.log("unselected node " + this.selectedState.id)
  // 		this.selectedState = null;
  // 		this.toMove = false;
  // 	}
  // }

  // /**
  //  * Event for tracking the state object movement with mouse tracking
  //  */
  // moveObjectHandler = (event) => {
  // 	if(this.toMove){
  // 		var mouse = this.getMouseLocation(event);
  // 		this.selectedState.x = mouse.x - this.delX;
  // 		this.selectedState.y = mouse.y - this.delY;
  // 		this.reDraw();
  // 	}
  // }

  // drawLink() {
  // 	this.state.context.beginPath();
  // 	this.state.context.moveTo(40, 40);
  // 	this.state.context.lineTo(100,100);
  // 	this.state.context.stroke();

  // 	this.state.context.beginPath();
  // 	var tox = 100;
  // 	var toy=100;
  // 	var fromx = 40;
  // 	var fromy = 40;
  // 	var r = 6;
  // 	var x_center = tox;
  // 	var y_center = toy;
  // 	var angle, x, y;
  // 	angle = Math.atan2(toy-fromy,tox-fromx)
  // 	x = r*Math.cos(angle) + x_center;
  // 	y = r*Math.sin(angle) + y_center;
  
  // 	this.state.context.moveTo(x, y);
  
  // 	angle += (1/3)*(2*Math.PI)
  // 	x = r*Math.cos(angle) + x_center;
  // 	y = r*Math.sin(angle) + y_center;
  
  // 	this.state.context.lineTo(x, y);
  
  // 	angle += (1/3)*(2*Math.PI)
  // 	x = r*Math.cos(angle) + x_center;
  // 	y = r*Math.sin(angle) + y_center;
  
  // 	this.state.context.lineTo(x, y);
  
  // 	this.state.context.closePath();
  
  // 	this.state.context.fill()
  // }

  // /**
  //  * Event for making toMove as false, when user lifts the mouse up
  //  */
  // mouseUpHandler = () => {
  // 	console.log('inside mouseUpHandler');
  // 	this.toMove = false;
  // }

  // /**
  //  * Event for clearing the whole canvas
  //  */
  // clearCanvas = () => {
  // 	this.state.context.clearRect(0,0, this.state.width, this.state.height);
  // 	this.states = [];
  // }

  // /**
  //  * get mouse x and y co-ordinates inside the canvas
  //  * @param {object} event 
  //  */
  // getMouseLocation(event) {
  // 	var mouse = {};
  // 	mouse.x = event.clientX - this.state.canvas.getBoundingClientRect().left;
  // 	mouse.y = event.clientY - this.state.canvas.getBoundingClientRect().top;
  // 	return mouse;
  // }

  // /**
  //  * Event to handle shift key down and up for link drawing
  //  */
  // canvasKeyHandler = (event) => {
  // 	if(event.keyCode === 16) this.toDrawLink = !this.toDrawLink;
  // }

    render() {
		return (
      <Paper elevation={12} style={{marginLeft: 20, marginTop: 20, marginBottom: 20, padding: 20, display: "inline-block"}}>
        <div style={{ border: "solid 3px #33C3F0", display: "inline-block", borderRadius: "5px"}}>
          <canvas id="canvas" width="1200" height="700" >
            <p>Canvas element is not supported</p>
          </canvas>
        </div>
      </Paper>
		);
  	}
}

export default Canvas;
