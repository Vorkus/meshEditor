uniform float uTime;

varying vec3 vPosition;

void main() {
	vPosition = position;

	float displacement;
	if (sin(uTime) >= 0.0) {
		displacement = sin(uTime);
	} else {
		displacement = -sin(uTime);
	}

	vec3 newPosition = position + (normal * displacement/3.0);
	gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}