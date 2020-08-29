// Renders Sierpinski's Triangle in Color
'use strict';
    
// Global WebGL context variable
let gl;

// Number of recursive steps in generating Sierpinski's Triangle
const NUM_STEPS = 5;


// Once the document is fully loaded run this init function.
window.addEventListener('load', function init() {
    // Get the HTML5 canvas object from it's ID
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) { window.alert('Could not find #webgl-canvas'); return; }

    // Get the WebGL context (save into a global variable)
    gl = canvas.getContext('webgl2');
    if (!gl) { window.alert("WebGL isn't available"); return; }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height); // this is the region of the canvas we want to draw on (all of it)
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // setup the background color with red, green, blue, and alpha amounts (this is white)
    
    // Initialize the WebGL program and data
    gl.program = initProgram();
    initBuffers();

    // Render the static scene
    render();
});


/**
 * Initializes the WebGL program.
 */
function initProgram() {
    // Compile shaders
    // Vertex Shader: simplest possible
    let vert_shader = compileShader(gl, gl.VERTEX_SHADER,
        `#version 300 es
        precision mediump float;

        in vec4 aPosition;
        in vec4 aColor;
        
        out vec4 vColor;

        void main() {
            gl_Position = aPosition;
            vColor = aColor;
        }`
    );
    // Fragment Shader: simplest possible, chosen color is red for each point
    let frag_shader = compileShader(gl, gl.FRAGMENT_SHADER,
        `#version 300 es
        precision mediump float;

        in vec4 vColor;
        out vec4 fragColor;

        void main() {
            fragColor = vColor;
        }`
    );

    // Link the shaders into a program and use them with the WebGL context
    let program = linkProgram(gl, vert_shader, frag_shader);
    gl.useProgram(program);
    
    // Get the position attribute index
    program.aPosition = gl.getAttribLocation(program, 'aPosition'); // get the vertex shader attribute "aPosition"
    program.aColor = gl.getAttribLocation(program, 'aColor'); // get the vertex shader attribute "aColor"

    return program;
}


/**
 * Initialize the data buffers.
 */
function initBuffers() {
    // The vertices and colors of Sierpinski's Triangle
    let coords = [];
    sierpinski([-1, -1], [0, 1], [1, -1], NUM_STEPS, coords);
    let colors = [];
    // TODO: loop with colors.push()

    // Create and bind VAO
    gl.sierpinskiVAO = gl.createVertexArray();
    gl.bindVertexArray(gl.sierpinskiVAO);

    // TODO: Load the vertex coordinate data onto the GPU and associate with attribute

    // TODO: Load the vertex color data onto the GPU and associate with attribute
    
    // Cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


/**
 * Render the scene.
 */
function render() {
    // Clear the current rendering
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // TODO: Draw the Sierpinski's Triangle

    // Cleanup
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


/**
 * Generate the vertices for Sierpinski's triangle.
 * Parameters:
 *   a, b, and c are 2-element arrays for the coordinates of the overall triangle
 *   steps is the number of recursive steps to do
 *   coords is the array of vertices to append the new vertices to
 */
function sierpinski(a, b, c, steps, coords) {
    if (steps === 0) {
        // Base case: add triangle vertices to array of coords
        coords.push(a[0], a[1], b[0], b[1], c[0], c[1]);
    } else {
        // TODO: recursive case
    }
}


/**
 * Computes the midpoint of two points. The two points are given as two-elements arrays.
 * Returns a two-element array for the computed midpoint.
 */
function midpoint(p, q) {
    return TODO;
}
