// Renders a dynamically loaded complex car model
'use strict';
    
// Global WebGL context variable
let gl;


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
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // setup the background color with red, green, blue, and alpha amounts (this is white)
    
    // Initialize the WebGL program
    gl.program = initProgram();

    // Load models and wait for them all to complete
    Promise.all(Array.from(Array(178).keys()).map(x => loadModel(`nissan-gtr/part${x+1}.json`))).then(
        models => {
            // All models have now fully loaded
            // Now we can add user interaction events and render the scene
            // The provided models is an array of all of the loaded models
            // Each model is a VAO and a number of indices to draw
            gl.models = models;
            initEvents();
            render();
        }
    );
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

        const mat4 projection = mat4(
            1.1, 0, 0, 0,
            0, 1.8, 0, 0,
            0, 0, -1, -1,
            0, 0, -20, 0);
        const mat4 model_view = mat4(
            0.9,  0.3, -0.4, 0,
            0.0,  0.9,  0.5, 0,
            0.5, -0.4,  0.8, 0,
            -10, 0, -75, 1);
        
        void main() {
            gl_Position = projection * model_view * aPosition;
            gl_PointSize = 0.5;
        }`
    );
    // Fragment Shader: simplest possible, chosen color is red for each point
    let frag_shader = compileShader(gl, gl.FRAGMENT_SHADER,
        `#version 300 es
        precision mediump float;

        out vec4 fragColor;

        void main() {
            fragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }`
    );

    // Link the shaders into a program and use them with the WebGL context
    let program = linkProgram(gl, vert_shader, frag_shader);
    gl.useProgram(program);
    
    // Get the position attribute index
    program.aPosition = gl.getAttribLocation(program, 'aPosition'); // get the vertex shader attribute "aPosition"
    
    return program;
}


/**
 * Load a model from a file into a VAO and return the VAO.
 */
function loadModel(filename) {
    // TODO: copy from model-loading (but adjusting for 3D)
}


/**
 * Render the scene.
 */
function render() {
    // Clear the current rendering
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the models
    for (let [vao, count] of gl.models) {
        gl.bindVertexArray(vao);
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
    }

    // Cleanup
    gl.bindVertexArray(null);
}


/**
 * Setup the user-interaction events.
 */
function initEvents() {
    // TODO
}
