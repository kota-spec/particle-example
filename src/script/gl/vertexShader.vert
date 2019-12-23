precision mediump float;
attribute vec4 color;
uniform float time;
varying vec4 vColor;

void main(){
	vColor=color;
	gl_PointSize=1.5;
	gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}