uniform float uTime;

varying vec3 vPosition;

void main() {
	// Normalize as we just want the direction, no the magnitude/distance
	vec3 viewDirection = normalize((cameraPosition - vPosition) + vec3(length(cameraPosition)));

	gl_FragColor = vec4( viewDirection, 1.0 );
}