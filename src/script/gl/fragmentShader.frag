precision mediump float;
uniform float time;
uniform vec2 uMouse;
varying vec4 vColor;

void main(){
	float t=time*.001;
	gl_FragColor=vec4(vColor.r*abs(sin(uMouse.x)),vColor.g*abs(cos(uMouse.y)),vColor.b*abs(sin(uMouse.y)),1.);
}
